import "../styling/spinner.css";
import React, { useEffect, useState } from "react";
import PacmanLoader from "react-spinners/PacmanLoader";

export interface SpinnerProps {
  onPlayButtonClick: () => void;
  isLoading: boolean;
}

function Spinner({ onPlayButtonClick }: SpinnerProps) {
  const [animation, setAnimation] = useState("colorChange");
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const animations = ["colorChange", "bounce", "incrementDots"];
    let current = 0;
    const interval = setInterval(() => {
      current = (current + 1) % animations.length;
      setAnimation(animations[current]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <div className="spinner-container">
      <button
        className={`play-button ${hovered ? "hovered" : ""}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onPlayButtonClick}
        data-testid="playbutton"
      >
        {hovered ? (
          "Play Game"
        ) : (
          <PacmanLoader
            color={"grey"}
            size={window.innerWidth <= 480 ? 30 : 50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        )}
      </button>
      <div className="please-wait">
        Please wait<span className={`loading-dots ${animation}`}></span>
      </div>
    </div>
  );
}

export default Spinner;
