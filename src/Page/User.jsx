import io from "socket.io-client";
import { useEffect, useState, Fragment } from "react";
const socket = io.connect("https://escape-room-back.onrender.com/");

import SoundTrack1 from "../assets/track1.wav";
import SoundTrack2 from "../assets/track2.wav";

export default function User() {
  const [messageReceived, setMessageReceived] = useState("");
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(3600);
  const [timerStart, setTimerStart] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioTrack1] = useState(new Audio(SoundTrack1));
  const [audioTrack2] = useState(new Audio(SoundTrack2));
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    let timeout = 0;
    socket.on("receive_message", (data) => {
      playAudio();
      setShowContent(true);
      console.log(data);
      setMessageReceived(data);
      setLoading(false);
      timeout = data.data.time * 1000;
      setTimeout(() => {
        setShowContent(false);
      }, timeout);
    });
    socket.on("getTimer", (data) => {
      playAudioBackground();
      console.log(data);
      setIsPaused(false);
      if (data == "true") {
        console.log(data);
        setTimerStart(true);
      }
    });
    socket.on("getPauseTimer", (data) => {
      pauseAudio();
      if (data == "true") {
        setIsPaused(true);
      }
    });
    socket.on("getResumeTimer", (data) => {
      audioTrack2.play();
      console.log(data);
      if (data == "true") {
        setIsPaused(false);
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.on("timeAdd", (amountInSeconds) => {
      console.log(amountInSeconds.time_in_min);
      setSecondsLeft(
        (secondsLeft) => secondsLeft + parseInt(amountInSeconds.time_in_min)
      );
    });
  }, []);

  useEffect(() => {
    if (timerStart) {
      if (secondsLeft <= 0) return;
      const intervalId = setInterval(() => {
        if (!isPaused) {
          setSecondsLeft((secondsLeft) => secondsLeft - 1);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [secondsLeft, timerStart, isPaused]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  useEffect(() => {
    const handleEnd = () => setIsPlaying(false);
    audioTrack1.addEventListener("ended", handleEnd);
    return () => audioTrack1.removeEventListener("ended", handleEnd);
  }, [audioTrack1]);

  useEffect(() => {
    const handleEnd = () => setIsPlaying(false);
    audioTrack2.addEventListener("ended", handleEnd);
    audioTrack2.loop = true;
    return () => audioTrack2.removeEventListener("ended", handleEnd);
  }, [audioTrack2]);

  const playAudio = () => {
    audioTrack2.volume = 1;
    audioTrack1.play();
    setIsPlaying(true);
    audioTrack2.volume = 0.5;
  };

  const playAudioBackground = () => {
    audioTrack2.play();
    setIsPlaying(true);
  };

  const pauseAudio = () => {
    audioTrack2.pause();
    setIsPlaying(false);
  };

  return (
    <div className="container">
      <div className="h-75">
        {!loading && (
          <div className="h-75  d-flex ">
            {showContent && (
                <div className="display-text mesage-text d-flex align-items-center">{messageReceived.data.message}</div>
            )}
          </div>
        )}
      </div>
      <div className="display-text h-25 align-items-center justify-content-center">
        <h1 className="timer">
          {minutes}:{seconds < 10 ? "0" : ""}
          {seconds}
        </h1>
        <div className="mt-3 display-text">Developed By <a className="my_web" href="https://udarax.me/" target="_blank">UDARAX.ME</a></div>
      </div>
    </div>
  );
}
