import React, { useState, useEffect } from "react";
import Board from "./components/Board";
import "./App.css"; // Import the CSS file

function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [isBotEnabled, setIsBotEnabled] = useState(false);
  const [gameMode, setGameMode] = useState(null);

  const handleClick = (index) => {
    if (
      squares[index] ||
      calculateWinner(squares) ||
      (gameMode === "bot" && !isXNext)
    )
      return;

    const newSquares = squares.slice();
    newSquares[index] = isXNext ? "X" : "O";
    setSquares(newSquares);
    setIsXNext(!isXNext);
  };

  const result = calculateWinner(squares);
  const winner = result ? result.winner : null;
  const winningLine = result ? result.winningLine : [];

  const status = winner
    ? `Winner: ${winner}`
    : `Player: ${isXNext ? "X" : "O"}'s Turn`;

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
  };

  useEffect(() => {
    if (!isXNext && isBotEnabled && !calculateWinner(squares)) {
      setTimeout(() => {
        const botMove = calculateBotMove(squares);
        if (botMove !== null) {
          const newSquares = squares.slice();
          newSquares[botMove] = "O";
          setSquares(newSquares);
          setIsXNext(true);
        }
      }, 1000);
    }
  }, [isXNext, isBotEnabled, squares]);

  const chooseGameMode = (mode) => {
    setGameMode(mode);
    setIsBotEnabled(mode === "bot");
    resetGame();
  };

  const returnToGameModeSelection = () => {
    setGameMode(null);
    resetGame();
  };

  return (
    <div className="game-container">
      {gameMode === null ? (
        <div className="mode-selection">
          <h1 className="title">Select Game Mode</h1>
          <button onClick={() => chooseGameMode("bot")} className="mode-button">
            Play with Bot
          </button>
          <button
            onClick={() => chooseGameMode("friend")}
            className="mode-button"
          >
            Play with Friend
          </button>
        </div>
      ) : (
        <div className="game-board">
          <h1 className="title">Tic Tac Toe</h1>
          <div className="status">{status}</div>
          <Board
            squares={squares}
            onClick={handleClick}
            winningLine={winningLine}
          />

          <button className="reset-button" onClick={resetGame}>
            Reset Game
          </button>
          <button className="back-button" onClick={returnToGameModeSelection}>
            Change Game Mode
          </button>
        </div>
      )}
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningLine: line }; // Return winner and winning line
    }
  }
  return null;
}

const calculateBotMove = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Check for a winning move
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] === "O" && squares[b] === "O" && squares[c] === null) {
      return c;
    }
    if (squares[a] === "O" && squares[c] === "O" && squares[b] === null) {
      return b;
    }
    if (squares[b] === "O" && squares[c] === "O" && squares[a] === null) {
      return a;
    }
  }

  // Block opponent's winning move
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] === "X" && squares[b] === "X" && squares[c] === null) {
      return c;
    }
    if (squares[a] === "X" && squares[c] === "X" && squares[b] === null) {
      return b;
    }
    if (squares[b] === "X" && squares[c] === "X" && squares[a] === null) {
      return a;
    }
  }

  // Take center if available
  if (squares[4] === null) {
    return 4;
  }

  // Take one of the corners if available
  const corners = [0, 2, 6, 8];
  for (let corner of corners) {
    if (squares[corner] === null) {
      return corner;
    }
  }

  // Fallback to a random empty square
  const emptySquares = squares
    .map((value, index) => (value === null ? index : null))
    .filter((value) => value !== null);

  return emptySquares.length > 0
    ? emptySquares[Math.floor(Math.random() * emptySquares.length)]
    : null;
};

export default App;
