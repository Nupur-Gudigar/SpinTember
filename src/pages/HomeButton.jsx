import React from "react";
import { Link } from "react-router-dom";
import "./HomeButton.css";

const HomeButton = () => {
  return (
    <>
      {/* Left side navigation */}
      <div className="left-nav">
        <Link to="/">
          <button className="nav-btn">🏠</button>
        </Link>
      </div>
      
      {/* Right side navigation */}
      <div className="right-nav">
        <Link to="/BoardOfHonor">
          <button className="nav-btn">PHOTO WALL</button>
        </Link>
      </div>
    </>
  );
};

export default HomeButton;
