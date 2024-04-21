import * as h from "./helpers.js";

const BOARD = document.getElementById("board");
const STATUS = document.getElementById("game-status");
const RESET = document.getElementById("reset-btn");
const PLAY_AI = document.getElementById("play-ai");

let gameOver = false;
let gameBoard = h.initial_state();
let currentPlayer = h.player(gameBoard);
let playingAi = false;

function celebrate(winner) {
  STATUS.textContent = currentPlayer + " won the game!";
}
function gameTie() {
  STATUS.textContent = "Game ended in a tie.";
}

function handleEvent(event, row, col) {
  if (event.target.textContent || gameOver) {
    return;
  }

  let move = [row, col];

  currentPlayer = h.player(gameBoard);
  event.target.textContent = currentPlayer;

  let nextPlayer = currentPlayer === h.X ? h.O : h.X;
  STATUS.textContent = "Play as " + nextPlayer;

  gameBoard = h.makeMove(gameBoard, move);

  let winner = h.checkTerminate(gameBoard);

  if (winner) {
    gameOver = true;

    if (winner === h.T) gameTie();
    else celebrate(winner);
  }
}

function reset() {
  gameOver = false;
  gameBoard = h.initial_state();
  currentPlayer = h.player(gameBoard);

  let cells = BOARD.children;
  Array.from(cells).forEach((cell) => (cell.textContent = h.EMPTY));
}

STATUS.textContent = "Play as X";

for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", (event) => {
      handleEvent(event, i, j);
    });
    BOARD.appendChild(cell);
  }
}

RESET.addEventListener("click", () => {
  reset();
});

PLAY_AI.addEventListener("click", () => {
  playingAi = true;
});
