
import React, { useState, useRef } from "react";
import "./CreativeWheel.css";
import { Link, useNavigate } from "react-router-dom";
import HomeButton from "./HomeButton";
import useSpinSound from "../hooks/useSpinSound"; // ✅ spin sound hook

const prompts = [
  {
    title: "Album Cover",
    challenge: "Design an album cover for your September theme playlist.",
  },
  {
    title: "Studio Ghibli Wallpaper",
    challenge: "Make a Studio Ghibli aesthetic phone/desktop wallpaper.",
  },
  {
    title: "Autumn Bookmark",
    challenge: "DIY an autumn bookmark with doodles, washi tape, or pressed leaves.",
  },
  {
    title: "September Issue Cover",
    challenge: "Create your own “September Issue” Vogue/GQ-style cover with yourself or random props.",
  },
  {
    title: "Fall Poster",
    challenge: "Create a Fall themed poster for your room.",
  },
  {
    title: "Warning Sign",
    challenge: "Create a warning sign for something harmless in your room. Example: 'Danger: Pumpkin Spice Overload.'",
  },
  {
    title: "Burn Book Journal",
    challenge: "Make yourself a Mean Girls Burn Book style journal.",
  },
  {
    title: "Fall Stretch",
    challenge: "Try a new warm-up/stretch/yoga move you can add to your fall workout routine.",
  },
  {
    title: "Cider Label",
    challenge: "Mock up a cider bottle label as if it were a White Claw limited edition.",
  },
  {
    title: "Nintendo Cover",
    challenge: "Mock up a Nintendo game cover: Super Mario Pumpkin Patch.",
  },
  {
    title: "Hogwarts Banner",
    challenge: "Redesign Fall Hogwarts House Banner (Gryffindor/Slytherin/etc.) with pumpkins and scarves.",
  },
  {
    title: "Budget Spread",
    challenge: "Design a simple fall-themed budget spread in Notion, Excel, or even paper.",
  },
];

const FULL_TURNS = 5;
const POINTER_ANGLE = 270;

const CreativeWheel = () => {
  const [rotation, setRotation] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [stage, setStage] = useState("idle");

  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const { playSpinSound, stopSpinSound } = useSpinSound();

  const segment = 360 / prompts.length;
  const colors = [
    "#0d1b4c", "#253a7f", "#3b5ba9",
    "#4b0082", "#6a0dad", "#8a2be2", "#9370db", "#b19cd9",
    "#f4a6a6"
  ];

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setStage("spinning");
    playSpinSound();

    const idx = Math.floor(Math.random() * prompts.length);
    const center = idx * segment + segment / 2;
    const current = ((rotation % 360) + 360) % 360;
    const target = (POINTER_ANGLE - center + 360) % 360;
    const deltaWithinCircle = (target - current + 360) % 360;
    const newRotation = rotation + FULL_TURNS * 360 + deltaWithinCircle;

    setRotation(newRotation);

    setTimeout(() => {
      const final = ((newRotation % 360) + 360) % 360;
      const localAngle = (POINTER_ANGLE - final + 360) % 360;
      const landed = Math.floor(localAngle / segment) % prompts.length;

      const box = document.querySelector(".challenge-box");
      if (box) {
        box.classList.remove("flip");
        void box.offsetWidth;
        box.classList.add("flip");
      }

      setSelectedIndex(landed);
      setStage("challenge");
      setSpinning(false);
      stopSpinSound();
    }, 4000);
  };

  return (
    <div className="chaotic-bg">
      <HomeButton />

      {/* Back button - moved to top-left */}
      <Link to="/AdventureSelection" className="back-button-wheel">
        ← BACK
      </Link>

      <div className="chaotic-overlay" />
      <div className="chaotic-content">
        <h1 className="chaotic-title">CREATIVE ADVENTURE</h1>

        <div className="chaotic-layout">
          {/* Wheel */}
          <div className="wheel-container">
            <svg
              className="wheel"
              viewBox="0 0 500 500"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? "transform 4s ease-out" : "none",
              }}
            >
              <defs>
                <radialGradient id="rimGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="70%" stopColor="#2d1b64" />
                  <stop offset="100%" stopColor="#6c5ce7" />
                </radialGradient>
              </defs>

              <g transform="translate(250,250)">
                <circle
                  r="225"
                  fill="url(#rimGradient)"
                  stroke="#74b9ff"
                  strokeWidth="6"
                />

                {prompts.map((p, i) => {
                  const start = i * segment;
                  const end = (i + 1) * segment;
                  const largeArc = end - start > 180 ? 1 : 0;
                  const radius = 249;

                  const x1 = radius * Math.cos((Math.PI * start) / 180);
                  const y1 = radius * Math.sin((Math.PI * start) / 180);
                  const x2 = radius * Math.cos((Math.PI * end) / 180);
                  const y2 = radius * Math.sin((Math.PI * end) / 180);
                  const centerAngle = start + segment / 2;

                  return (
                    <g key={i}>
                      <path
                        d={`M0 0 L${x1} ${y1} A${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={colors[i % colors.length]}
                        stroke="#fff"
                        strokeWidth="1"
                      />
                      <text
                        x={radius * 0.60}
                        y="0"
                        transform={`rotate(${centerAngle})`}
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        fill="white"
                        fontSize="13"
                      >
                        {p.title}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>

            <div className="wheel-pointer"></div>

            {stage === "idle" && (
              <button
                className="btn btn-purple"
                onClick={spinWheel}
                disabled={spinning}
              >
                SPIN THE WHEEL!
              </button>
            )}
          </div>

          {/* Info Box */}
          <div className="chaotic-info">
            <h2 className="info-title">ABOUT CREATIVE ADVENTURES</h2>
            <p className="info-desc">
              DIY chaos meets fall vibes. From album covers to Hogwarts banners — unleash your inner Pinterest board.
            </p>

            <h3 className="info-subtitle">YOUR FALL CHALLENGE</h3>
            <div className="divider"></div>

            <div className="challenge-box flip" key={selectedIndex}>
              {selectedIndex === null
                ? "SPIN THE WHEEL TO GET YOUR CHALLENGE!"
                : prompts[selectedIndex].challenge}
            </div>

            <div className="challenge-buttons">
              {stage === "challenge" && (
                <>
                  <button
                    className="btn btn-green"
                    onClick={() => setStage("accepted")}
                  >
                    ACCEPT CHALLENGE
                  </button>
                  <button
                    className="btn btn-blue"
                    onClick={spinWheel}
                    disabled={spinning}
                  >
                    SPIN AGAIN
                  </button>
                </>
              )}

              {stage === "accepted" && (
                <>
                  <button
                    className="btn btn-lightgreen"
                    onClick={() =>
                      navigate("/victory", {
                        state: { task: prompts[selectedIndex].challenge, adventureType: "creative" }
                      })
                    }
                  >
                    I DID IT! 📸
                  </button>
                  <button
                    className="btn btn-blue"
                    onClick={spinWheel}
                    disabled={spinning}
                  >
                    SPIN AGAIN
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeWheel;
