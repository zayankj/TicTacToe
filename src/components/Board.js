import React from "react";
import "./Board.css"; // Import the CSS file for styling

function Board({ squares, onClick, winningLine }) {
  return (
    <div className="board">
      {squares.map((square, index) => (
        <button
          key={index}
          className={`square ${winningLine.includes(index) ? "highlight" : ""}`}
          onClick={() => onClick(index)}
        >
          {square}
        </button>
      ))}
    </div>
  );
}

export default Board;
