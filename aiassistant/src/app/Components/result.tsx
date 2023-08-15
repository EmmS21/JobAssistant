import React from "react";
import "../styling/response.css";

const ResultBox = ({ response, currCount }) => {
  const sections = response.split("\n\n").filter(Boolean);
  const numberPattern = /(\d+)\s+out\s+of\s+(\d+)/;
  const match = response.match(numberPattern);

  return (
    <div className="response-container">
      <div className="request-count-box">
        You have made {currCount} requests out of 20 today
      </div>
      <div className="response-div">
        {match && (
          <div className="circle-container">
            <div>
              <strong>Your Score </strong>
            </div>
            :<div className="circle">{match[1]}</div>
            <div className="circle">{match[2]}</div>
          </div>
        )}

        {sections.map(
          (
            section:
              | string
              | number
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.PromiseLikeOfReactNode
              | null
              | undefined,
            index: React.Key | null | undefined
          ) => {
            const parts = section.split(":");
            if (parts.length < 2) return <p key={index}>{section}</p>;
            return (
              <div key={index}>
                <h2>{parts[0]}</h2>
                <p>{parts.slice(1).join(":").trim()}</p>
              </div>
            );
          }
        )}
      </div>
      <div className="back-button">&#8592;</div>
    </div>
  );
};

export default ResultBox;
