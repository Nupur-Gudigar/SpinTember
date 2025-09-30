import React, { useRef, useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import html2canvas from "html2canvas";
// Import all frames
import academicFrame from "../assets/academic-frame.png";
import cozyFrame from "../assets/cozy-frame.png";
import chaoticFrame from "../assets/chaotic-frame.png";
import creativeFrame from "../assets/creative-frame.png";
import fireworksSound from "../assets/fireworks.mp3"; // ✅ import fireworks audio
import "./VictoryPhoto.css";

import { useDispatch, useSelector } from "react-redux";
import { addPhoto } from "../redux/photosSlice";
import Toast from "../components/Toast";

const VictoryPhoto = () => {
  const webcamRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const task = location.state?.task || "Your Challenge";
  const adventureType = location.state?.adventureType || "creative"; // Get adventure type

  const dispatch = useDispatch();
  const { isMuted } = useSelector((state) => state.audio);

  // Dynamic frame selection based on adventure type
  const getFrameForAdventure = (adventureType) => {
    switch (adventureType.toLowerCase()) {
      case 'academic':
        return academicFrame;
      case 'cozy':
        return cozyFrame;
      case 'chaotic':
        return chaoticFrame;
      case 'creative':
        return creativeFrame;
      default:
        return creativeFrame; // fallback
    }
  };

  const frameOverlay = getFrameForAdventure(adventureType);

  // ✅ toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("info");

  // ✅ Fireworks audio ref
  const fireworksRef = useRef(null);

  // Handle fireworks sound based on mute state
  useEffect(() => {
    if (fireworksRef.current) {
      if (!isMuted) {
        fireworksRef.current.currentTime = 0;
        fireworksRef.current.volume = 0.7;
        fireworksRef.current.loop = true; // 🔑 loop enabled
        fireworksRef.current.play().catch(() => {});
      } else {
        fireworksRef.current.pause();
      }
    }

    return () => {
      if (fireworksRef.current) {
        fireworksRef.current.pause();
        fireworksRef.current.currentTime = 0;
      }
    };
  }, [isMuted]);

  const triggerToast = (msg, type = "info") => {
    setShowToast(false);
    setTimeout(() => {
      setToastMessage(msg);
      setToastType(type);
      setShowToast(true);
    }, 10);
  };

  const capturePhoto = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
  };

  const savePolaroid = async () => {
    try {
      const element = document.querySelector(".polaroid-save");
      if (!element) throw new Error("No polaroid element found");

      const canvas = await html2canvas(element, {
        useCORS: true,
        backgroundColor: null,
      });
      const dataURL = canvas.toDataURL("image/png");

      const safeTask = task.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      const fileName = `${safeTask}_${adventureType}adventure.png`;

      const link = document.createElement("a");
      link.href = dataURL;
      link.download = fileName;
      link.click();

      triggerToast("📸 Polaroid downloaded!", "success");
    } catch (err) {
      triggerToast("⚠️ Failed to download photo!", "error");
    }
  };

  const saveToWall = async () => {
    try {
      const element = document.querySelector(".polaroid-save");
      if (!element) throw new Error("No polaroid element found");

      const canvas = await html2canvas(element, {
        useCORS: true,
        backgroundColor: null,
      });
      const dataURL = canvas.toDataURL("image/png");

      dispatch(addPhoto({ image: dataURL, task, adventureType }));

      triggerToast("📌 ADDED TO PHOTO WALL!", "success");
    } catch (err) {
      triggerToast("⚠️ FAILED TO SAVE TO WALL!", "error");
    }
  };

  return (
    <div className="victory-bg">
      {/* 🔊 Fireworks audio element */}
      <audio ref={fireworksRef} src={fireworksSound} />

      <div className="victory-overlay" />
      <div className="victory-content">
        <h1 className="victory-title">🎉 YOU DID IT!! 🎉</h1>
        <h2 className="victory-task">
          You Completed the task. Let’s take a victory photo!
          <br />
          <span className="victory-task-name">{task}</span>
        </h2>

        {!photo ? (
          <div className="camera-container">
            <Webcam
              audio={false}
              screenshotFormat="image/png"
              ref={webcamRef}
              className="webcam-view"
            />

            {/* 🔹 Button Row */}
            <div className="action-buttons">
              <button className="victory-btn capture-btn" onClick={capturePhoto}>
                📸 TAKE PICTURE
              </button>

              <Link to="/AdventureSelection">
                <button className="victory-btn back-btn">⬅ BACK</button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="polaroid-save" data-adventure={adventureType}>
              <img src={photo} alt="Victory" className="captured-photo" />
              <img src={frameOverlay} alt="Frame" className="frame-overlay" />
            </div>

            <div className="result-buttons">
              <button className="victory-btn save-btn" onClick={savePolaroid}>
                💾 SAVE POLAROID
              </button>
              <button className="victory-btn save-btn" onClick={saveToWall}>
                📌 SAVE TO WALL
              </button>
              <button
                className="victory-btn honor-btn"
                onClick={() => navigate("/BoardOfHonor")}
              >
                🏆 GO TO PHOTO WALL
              </button>
              <button
                className="victory-btn retake-btn"
                onClick={() => setPhoto(null)}
              >
                🔄 RETAKE
              </button>
            </div>

            {/* 🔹 Back button for result screen */}
            <div className="action-buttons">
              <Link to="/AdventureSelection">
                <button className="victory-btn back-btn">⬅ BACK</button>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* ✅ Toast */}
      <Toast
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
        type={toastType}
      />
    </div>
  );
};

export default VictoryPhoto;
