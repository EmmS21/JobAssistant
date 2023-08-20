import "../styling/spinner.css";
import React from "react";
import PacmanLoader from "react-spinners/PacmanLoader";

function Spinner() {
  return (
    <div>
      <PacmanLoader
        color={"grey"}
        size={window.innerWidth <= 480 ? 30 : 50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <div className="please-wait">
        Please wait<span className="loading-dots"></span>
      </div>
    </div>
  );
}

export default Spinner;
