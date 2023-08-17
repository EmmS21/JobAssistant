import React, { useState } from "react";
import "../styling/introduction.css";
import { CHARACTERS } from "../constants/introduction";

export default function IntroductionComponent({ onStart }) {
  return (
    <div className="matrix-container">
      <div className="matrix-text">{CHARACTERS}</div>
      <button className="start-button" onClick={onStart}>
        Start
      </button>
    </div>
  );
}
