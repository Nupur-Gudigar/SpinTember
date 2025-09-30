import React from "react";
import "./AdventureSelection.css";
import { Link } from "react-router-dom";

const adventureTypes = [
  { label: "CHAOTIC ADVENTURE", type: "Chaotic" },
  { label: "COZY ADVENTURE", type: "Cozy" },
  { label: "ACADEMIC ADVENTURE", type: "Academic" },
  { label: "CREATIVE ADVENTURE", type: "Creative" },
];

const AdventureSelection = () => {
  return (
    <div className="adventure-bg">
      <div className="adventure-overlay" />
      
      {/* ✅ Back button - moved to top */}
      <Link to="/" className="back-button">
        ← BACK
      </Link>
      
      <div className="adventure-content">
        <h1 className="adventure-title">CHOOSE YOUR ADVENTURE TYPE</h1>
        
        <div className="adventure-buttons">
          {adventureTypes.map((item, idx) => (
            <Link
              key={item.label}
              to="/LoadingScreen"
              state={{ adventure: item.type }}
              className={`adventure-btn zigzag-${idx % 2 === 0 ? "left" : "right"}`}
            >
              <span className="adventure-label">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdventureSelection;
