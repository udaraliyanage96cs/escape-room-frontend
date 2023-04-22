import "../App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";

import SoundTrack1 from "../assets/track1.wav";
import SoundTrack2 from "../assets/track2.wav";

const socket = io.connect("https://esc-back.netlify.app/");

function App() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [time, setTime] = useState("");
  const [addTime, setAddTime] = useState("");

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioTrack1] = useState(new Audio(SoundTrack1));
  const [audioTrack2] = useState(new Audio(SoundTrack2));

  const sendMessage = () => {
    const data = {
      title: title,
      message: message,
      time: time,
    };
    socket.emit("send_message", { data });
    playAudio();
  };

  const addTimeHander = () => {
    console.log(addTime);
    socket.emit("timeAdd", { addTime });
  };

  const startTimer = () => {
    socket.emit("startTimer", "true");
    playAudioBackground();
  };

  const pauseTimer = () => {
    pauseAudio();
    socket.emit("pauseTimer", "true");
  };
  const resumeTimer = () => {
    //audioTrack2.play();
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

  return (
    <div className="container">
      <div className="form-group mb-2">
        <label className="form-label">Title</label>
        <input
          className="form-control"
          placeholder="Your Title ..."
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
      </div>
      <div className="form-group mb-2">
        <label className="form-label">Message</label>
        <input
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
        />
      </div>
      <div className="form-group mt-4 d-flex justify-content-center">
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>
      <div className="row  d-flex justify-content-center">
        <div className="col-lg-2">
          <div className="form-group  d-flex justify-content-center mt-4">
            <button className="btn btn-primary" onClick={startTimer}>
              Start Timer
            </button>
          </div>
        </div>
        {isPlaying ? (
          <div className="col-lg-2">
            <div className="form-group  d-flex justify-content-center mt-4">
              <button className="btn btn-primary" onClick={pauseTimer}>
                Pause Timer
              </button>
            </div>
          </div>
        ) : (
          <div className="col-lg-2">
            <div className="form-group  d-flex justify-content-center mt-4">
              <button className="btn btn-primary" onClick={resumeTimer}>
                Resume Timer
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="row">
        <div className="col-lg-3">
          <div className="form-group mb-2">
            <label className="form-label">Add Time</label>
            <input
              type="number"
              className="form-control"
              placeholder="Time in Seconds"
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
    </div>
  );
}

export default App;
