import React from "react";
import "../styling/response.css";

interface ResultBoxProps {
  response: string;
  currCount: number;
  moveBack: () => void;
}

const ResultBox: React.FC<ResultBoxProps> = ({
  response,
  currCount,
  moveBack,
}) => {
  const sections = response.split("\n\n").filter(Boolean);
  const numberPattern = /(\d+)\s*\/\s*(\d+)/;
  const match = response.match(numberPattern);

  return (
    <div className="response-container">
      <div className="request-count-box">
        You have made {currCount} requests out of 10 today
      </div>
      <div className="response-div">
        {match && (
          <div className="circle-container">
            <div>
              <strong>Your Score </strong>
            </div>
            <div className="circle">{match[1]}</div>
            <div>out of</div>
            <div className="circle">{match[2]}</div>
          </div>
        )}

        {sections.map(
          (section: string, index: React.Key | null | undefined) => {
            const parts = section.split(":");
            if (parts.length < 2) return <p key={index}>{section}</p>;
            return (
              <div key={index}>
                <h2>{parts[0]}</h2>
                <p>{parts.slice(1).join(":").trim()}</p>
                <br />
              </div>
            );
          }
        )}
      </div>
      <div className="back-button" onClick={moveBack}>
        &#8592;
      </div>
    </div>
  );
};

export default ResultBox;
