"use client";

import React, { useState } from "react";
import PacmanLoader from "react-spinners/PacmanLoader";

function Spinner() {
  return (
    <PacmanLoader
      color={"blue"}
      size={50}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
}

export default Spinner;
