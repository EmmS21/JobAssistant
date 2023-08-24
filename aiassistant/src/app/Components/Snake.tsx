import "../styling/spinner.css";
import React, { useState, useEffect } from "react";
import Modal from "./Modal";

const cellSize = 40;
const horizontalCells = Math.floor((window.innerWidth - 20) / cellSize);
const verticalCells = Math.floor((window.innerHeight - 20) / cellSize);

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 2, y: 2, letter: "" }]);
  const [dot, setDot] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState("RIGHT");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(200);
  const [bomb, setBomb] = useState<{ x: number; y: number } | null>(null);
  const [animation, setAnimation] = useState("colorChange");
  const [showModal, setShowModal] = useState(true); // Add this state

  const generateNewDotPosition = () => {
    let newDotPosition = {
      x: Math.floor(Math.random() * horizontalCells),
      y: Math.floor(Math.random() * verticalCells),
    };

    while (
      snake.some(
        (segment) =>
          segment.x === newDotPosition.x && segment.y === newDotPosition.y
      )
    ) {
      newDotPosition = {
        x: Math.floor(Math.random() * horizontalCells),
        y: Math.floor(Math.random() * verticalCells),
      };
    }

    return newDotPosition;
  };

  const generateNewBombPosition = () => {
    let newBombPosition = {
      x: Math.floor(Math.random() * horizontalCells),
      y: Math.floor(Math.random() * verticalCells),
    };

    while (
      snake.some(
        (segment) =>
          segment.x === newBombPosition.x && segment.y === newBombPosition.y
      ) ||
      (dot.x === newBombPosition.x && dot.y === newBombPosition.y)
    ) {
      newBombPosition = {
        x: Math.floor(Math.random() * horizontalCells),
        y: Math.floor(Math.random() * verticalCells),
      };
    }

    return newBombPosition;
  };

  const checkCollisionWithBomb = () => {
    let head = snake[0];
    if (bomb && head.x === bomb.x && head.y === bomb.y) {
      setGameOver(true);
    }
  };

  const moveSnake = () => {
    let newSnake = [...snake];
    let head = { ...newSnake[0] };

    switch (direction) {
      case "UP":
        head.y -= 1;
        break;
      case "DOWN":
        head.y += 1;
        break;
      case "LEFT":
        head.x -= 1;
        break;
      case "RIGHT":
        head.x += 1;
        break;
      default:
        break;
    }

    newSnake = [head, ...newSnake.slice(0, -1)];
    setSnake(newSnake);
  };

  const checkSelfCollision = () => {
    let head = snake[0];
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        setGameOver(true);
        return;
      }
    }
  };

  const checkCollision = () => {
    let head = snake[0];
    if (head.x === dot.x && head.y === dot.y) {
      setDot(generateNewDotPosition());
      if (Math.random() < 0.8) setBomb(generateNewBombPosition());
      setSnake([...snake, {}]);
      setScore(score + 1);
      setSpeed((prevSpeed) => Math.max(prevSpeed - 50, 50));
    }
    checkCollisionWithBomb();
  };

  const checkBoundaries = () => {
    let head = snake[0];
    if (
      head.x < 0 ||
      head.x >= horizontalCells ||
      head.y < 0 ||
      head.y >= verticalCells
    ) {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    const gameArea = document.querySelector(".game-area"); // Using the class instead of the style for selection
    if (gameArea) {
      const explosions = gameArea.querySelectorAll(".explosion");
      explosions.forEach((exp) => gameArea.removeChild(exp));

      const clouds = gameArea.querySelectorAll(".mushroom-cloud");
      clouds.forEach((cloud) => gameArea.removeChild(cloud));
    }

    setSnake([{ x: 2, y: 2 }]);
    setDot(generateNewDotPosition());
    setDirection("RIGHT");
    setScore(0);
    setGameOver(false);
    setSpeed(200);
  };

  useEffect(() => {
    const animations = ["colorChange", "bounce", "incrementDots"];
    let current = 0;
    const interval = setInterval(() => {
      current = (current + 1) % animations.length;
      setAnimation(animations[current]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.keyCode) {
        case 37:
          if (direction !== "RIGHT") setDirection("LEFT");
          e.preventDefault();
          break;
        case 38:
          if (direction !== "DOWN") setDirection("UP");
          e.preventDefault();
          break;
        case 39:
          if (direction !== "LEFT") setDirection("RIGHT");
          e.preventDefault();
          break;
        case 40:
          if (direction !== "UP") setDirection("DOWN");
          e.preventDefault();
          break;
        case 13:
          resetGame();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    const gameInterval = setInterval(() => {
      if (gameOver) return;

      moveSnake();
      checkBoundaries();
      checkCollision();
      if (snake.length > 1) checkSelfCollision();
    }, speed);

    return () => {
      clearInterval(gameInterval);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [snake, direction, speed]);

  if (gameOver) {
    return (
      <div>
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h1 style={{ animation: "flashing 1s infinite" }}>
            Final Score: {score}
          </h1>
          <button onClick={resetGame}>Restart</button>
        </div>

        <div className="please-wait">
          Please wait<span className={`loading-dots ${animation}`}></span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Score: {score}</h2>
      <Modal show={showModal} onClose={() => setShowModal(false)} />
      <div
        style={{
          position: "relative",
          width: `${horizontalCells * cellSize}px`,
          height: `${verticalCells * cellSize}px`,
          border: "10px solid white",
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: `${segment.y * cellSize}px`,
              left: `${segment.x * cellSize}px`,
              width: "20px",
              height: "20px",
              backgroundColor: "green",
            }}
          ></div>
        ))}
        <div
          style={{
            position: "absolute",
            top: `${dot.y * cellSize}px`,
            left: `${dot.x * cellSize}px`,
            width: "20px",
            height: "20px",
            backgroundColor: "blue",
          }}
        ></div>
        {bomb && (
          <div
            style={{
              position: "absolute",
              top: `${bomb.y * cellSize}px`,
              left: `${bomb.x * cellSize}px`,
              width: "20px",
              height: "20px",
              backgroundColor: "red",
              borderRadius: "50%",
              border: "1px solid black",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-5px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "4px",
                height: "15px",
                backgroundColor: "grey",
              }}
            >
              <div
                className="flame"
                style={{
                  position: "absolute",
                  top: "-14px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "8px",
                  height: "8px",
                  backgroundColor: "red",
                  borderRadius: "50%",
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
      <div className="please-wait">
        Please wait<span className={`loading-dots ${animation}`}></span>
      </div>
    </div>
  );
};

export default SnakeGame;
