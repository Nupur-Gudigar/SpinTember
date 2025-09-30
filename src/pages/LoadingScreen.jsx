import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./LoadingScreen.css";

import bgGif from "../assets/loading-screen-bg.gif";

const LoadingScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const adventureType = location.state?.adventure || "Creative";
  const [progress, setProgress] = useState(0);

  // 🔹 Map adventure → subtitle
  const subtitleMap = {
    Chaotic: "Just like the UPSIDE DOWN",
    Academic: "Back-To-School Grind",
    Cozy: "Blankets, Lofi-music and glowing candles",
    Creative: "Channel your inner Studio Ghibli",
  };

  const subtitle = subtitleMap[adventureType] || "Channel your inner Studio Ghibli";

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Navigate dynamically based on adventure
            navigate(`/${adventureType}Wheel`, {
              state: { adventure: adventureType },
            });
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [navigate, adventureType]);

  return (
    <div className="loading-bg">
      {/* Background GIF */}
      <img src={bgGif} alt="Loading background" className="loading-bg-img" />

      {/* 🔹 Stick text at top */}
      <h1 className="loading-text">
        GETTING YOUR <span>{adventureType.toUpperCase()}</span> FALL ADVENTURE READY...
      </h1>

      {/* 🔹 Adventure subtitle */}
      <p className="loading-subtitle">
        {subtitle}
      </p>

      {/* Foreground Overlay */}
      <div className="loading-overlay">
        {/* 🔹 Loading bar stays bottom */}
        <div className="loading-bar">
          <div className="loading-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
