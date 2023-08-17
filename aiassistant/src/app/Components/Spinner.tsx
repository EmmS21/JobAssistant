import React from "react";
import PacmanLoader from "react-spinners/PacmanLoader";

function Spinner() {
  return (
    <PacmanLoader
      color={"grey"}
      size={50}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
}

export default Spinner;
