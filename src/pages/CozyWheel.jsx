

import React, { useState, useRef } from "react";
import "./CozyWheel.css";
import { Link, useNavigate } from "react-router-dom";
import HomeButton from "./HomeButton";
import useSpinSound from "../hooks/useSpinSound"; // ✅ import spin sound hook

const prompts = [
  {
    title: "Stranger Things Fort",
    challenge: "Build a Stranger Things blanket fort hideout, read like Eleven on a fall night.",
  },
  {
    title: "Bake Off Snack Board",
    challenge: "Assemble a 5-item Great British Bake Off worthy fall snack board.",
  },
  {
    title: "Cottagecore Vibes",
    challenge: "Channel cottage-core vibes: socks + blanket + leaves.",
  },
  {
    title: "Second Breakfast",
    challenge: "Make a second breakfast treat straight out of Lord of the Rings.",
  },
  {
    title: "Cozy Game Night",
    challenge: "Set up a board game and snap your 'cozy game night' mood.",
  },
  {
    title: "Book You’ve Ignored",
    challenge: "Curl up with the book you’ve been pretending to read all month.",
  },
  {
    title: "Spa Night",
    challenge: "Have a cozy Spa-night: face mask, bathrobe, tea, and candles.",
  },
  {
    title: "Fall OOTD",
    challenge: "OOTD challenge: fall-core sweater fit check.",
  },
  {
    title: "Tumblr Journal",
    challenge: "Treat your journal like Tumblr 2012: moody fall entry.",
  },
  {
    title: "Owl Letter",
    challenge: "Pen a Hogwarts-style owl letter — sepia vibes to your friend.",
  },
  {
    title: "AC Terrarium",
    challenge: "Build a cozy tiny Animal Crossing fall theme terrarium.",
  },
  {
    title: "Fall Shoebox",
    challenge: "Fill a shoebox with notes, polaroids, and 2025 fall vibes.",
  },
];

const FULL_TURNS = 5;
const POINTER_ANGLE = 270; // pointer at 12 o'clock

const CozyWheel = () => {
  const [rotation, setRotation] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [stage, setStage] = useState("idle");

  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const { playSpinSound, stopSpinSound } = useSpinSound();

  const segment = 360 / prompts.length;
  const colors = [
    "#0d1b4c", "#253a7f", "#3b5ba9", // blues
    "#4b0082", "#6a0dad", "#8a2be2", "#9370db", "#b19cd9", // purples
    "#f4a6a6" // pink
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
        <h1 className="chaotic-title">COZY ADVENTURE</h1>

        <div className="chaotic-layout">
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

          <div className="chaotic-info">
            <h2 className="info-title">ABOUT COZY ADVENTURES</h2>
            <p className="info-desc">
                Blankets, snacks, and Hobbit breakfasts. Chill vibes only — fall comfort turned into mini adventures.
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
                        state: { task: prompts[selectedIndex].challenge, adventureType: "cozy" }
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

export default CozyWheel;
