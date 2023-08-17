import React, { useState } from "react";
import "../styling/introduction.css";
import { CHARACTERS } from "../constants/introduction";

type IntroductionComponentProps = {
  onStart: () => void;
};

export default function IntroductionComponent({
  onStart,
}: IntroductionComponentProps) {
  return (
    <div className="matrix-container">
      <div className="matrix-text">{CHARACTERS}</div>
      <button className="start-button" onClick={onStart}>
        Start
      </button>
    </div>
  );
}
