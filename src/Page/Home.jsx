import "../App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";

import SoundTrack1 from "../assets/track1.wav";
import SoundTrack2 from "../assets/track2.wav";

const socket = io.connect("https://escape-room-back.onrender.com/");

function App() {
  const [message, setMessage] = useState("");
  const [time, setTime] = useState(600);
  const [addTime, setAddTime] = useState("");
  const [start, setStart] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioTrack1] = useState(new Audio(SoundTrack1));
  const [audioTrack2] = useState(new Audio(SoundTrack2));

  const [secondsLeft, setSecondsLeft] = useState(3600);
  const [timerStart, setTimerStart] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const sendMessage = () => {
    const data = {
      message: message,
      time: time,
    };
    socket.emit("send_message", { data });
    playAudio();
  };

  const addTimeHander = () => {
    console.log(addTime);
    let time_in_min = parseInt(addTime) * 60;
    console.log(time_in_min);
    setSecondsLeft(
      (secondsLeft) => secondsLeft + parseInt(time_in_min)
    );
    socket.emit("timeAdd", { time_in_min });
  };

  const startTimer = () => {
    setStart(true);
    socket.emit("startTimer", "true");
    setTimerStart(true);
    playAudioBackground();
  };

  const pauseTimer = () => {
    pauseAudio();
    setIsPaused(true);
    socket.emit("pauseTimer", "true");
  };
  const resumeTimer = () => {
    //audioTrack2.play();
    setIsPaused(false);
    socket.emit("resumeTimer", "true");
    setIsPlaying(true);
  };

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
    // audioTrack2.volume = 1;
    // audioTrack1.play();
    setIsPlaying(true);
    //audioTrack2.volume = 0.5;
  };

  const playAudioBackground = () => {
    //audioTrack2.play();
    setIsPlaying(true);
  };

  const pauseAudio = () => {
    //audioTrack2.pause();
    setIsPlaying(false);
  };

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

  return (
    <div className="container">
      <div className="display-text h-25 d-flex align-items-center justify-content-center">
        <h1 className="timer">
          {minutes}:{seconds < 10 ? "0" : ""}
          {seconds}
        </h1>
      </div>
      <div className="row d-flex">
        {!start && (
          <div className="w-fit">
            <div className="form-group   mt-4">
              <button className="btn btn-primary" onClick={startTimer}>
                Start Timer
              </button>
            </div>
          </div>
        )}
        {start && (
          <div className="w-fit">
            {isPlaying ? (
              <div className="w-fit">
                <div className="form-group  mt-4">
                  <button className="btn btn-primary" onClick={pauseTimer}>
                    Pause Timer
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-fit">
                <div className="form-group mt-4">
                  <button className="btn btn-primary" onClick={resumeTimer}>
                    Resume Timer
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <hr className="mt-4 mb-4 c-white" />

      <div className="row">
        <div className="col-lg-3">
          <div className="form-group mb-2">
            <label className="form-label">Add Time</label>
            <input
              type="number"
              className="form-control"
              placeholder="Time in Minutes"
              onChange={(event) => {
                setAddTime(event.target.value);
              }}
            />
          </div>
        </div>
        <div className="col-lg-3 d-flex align-items-end">
          <div className="form-group mb-2">
            <button className="btn btn-primary" onClick={addTimeHander}>
              Add More Time
            </button>
          </div>
        </div>
      </div>

      <hr className="mt-4 mb-4 c-white" />

      <div className="form-group mb-2">
        <label className="form-label">Message</label>
        <textarea
          className="form-control"
          placeholder="Your Message..."
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        />
      </div>
      <div className="form-group mb-2">
        <label className="form-label">Time to display</label>
        <input
          className="form-control"
          placeholder="Time in Seconds"
          onChange={(event) => {
            setTime(event.target.value);
          }}
          value={time}
        />
      </div>
      <div className="form-group mt-4 d-flex justify-content-center">
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>
      <div className="mt-5 display-text">Developed By <a className="my_web" href="https://udarax.me/" target="_blank">UDARAX.ME</a></div>
    </div>
  );
}

export default App;
