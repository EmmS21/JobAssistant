import React, { useEffect } from "react";
import "../styling/modal.css";

interface ModalProps {
  show: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ show, onClose }) => {
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [onClose, show]);

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        Welcome to the Snake Game!
        <br />
        Use these controls to play
        <br />
        <br />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="button" style={{ background: "transparent" }}>
            ↑
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div
              className="button"
              style={{ background: "transparent", marginRight: "10px" }}
            >
              ←
            </div>
            <div
              className="button"
              style={{ background: "transparent", marginLeft: "10px" }}
            >
              →
            </div>
          </div>
          <div className="button" style={{ background: "transparent" }}>
            ↓
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
