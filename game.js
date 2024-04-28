import * as h from "./helpers.js";
import { Player } from "./player.js";

const BOARD = document.getElementById("board");
const STATUS = document.getElementById("game-status");
const RESET = document.getElementById("reset-btn");
const SWITCH = document.getElementById("switch-mode");

function celebrate(winner) {
  STATUS.textContent = winner + " won the game!";
}

function gameTie() {
  STATUS.textContent = "Game ended in a tie.";
}
function makeRandomMove(player) {
  const availableMoves = h.getMoves(gameBoard);
  const randomIndex = Math.floor(Math.random() * availableMoves.length);

  const randomMove = availableMoves[randomIndex];
  const [row, col] = randomMove;

  gameBoard = h.makeMove(gameBoard, randomMove);

  const cell = document.querySelector(`.cell[data-index="${row},${col}"]`);
  cell.textContent = player.symbol;

  STATUS.textContent = "Play as O";
}

function reset() {
  gameOver = false;
  gameBoard = h.initial_state();
  Array.from(BOARD.children).forEach((cell) => {
    cell.textContent = h.EMPTY;
  });

  if (player1.isAi) makeRandomMove(player1);
  else STATUS.textContent = "Play as " + h.X;
}

function getPlayers() {
  const curSymbol = h.player(gameBoard);

  if (curSymbol === h.X) {
    return { current: player1, next: player2 };
  }
  return { current: player2, next: player1 };
}

function evaluateGameEndState() {
  let winner = h.checkTerminate(gameBoard);
  if (winner) {
    gameOver = true;

    if (winner === h.T) gameTie();
    else celebrate(winner);

    return true;
  }
  return false;
}

function handleAiMove(player) {
  if (gameOver) {
    return;
  }

  const maximizingPlyer = player.symbol === h.X ? true : false;

  let tempBoard = gameBoard.map((row) => [...row]);
  const {
    move: [row, col],
  } = h.minimax(tempBoard, maximizingPlyer);
  gameBoard = h.makeMove(gameBoard, [row, col]);

  const cell = document.querySelector(`.cell[data-index="${row},${col}"]`);
  cell.textContent = player.symbol;
}

function handleEvent(event, i, j) {
  if (gameOver || event.target.textContent) {
    return;
  }

  let move = [i, j];

  let { current: currentUser, next: nextUser } = getPlayers();

  gameBoard = h.makeMove(gameBoard, move);
  event.target.textContent = currentUser.symbol;

  STATUS.textContent = "Play as " + nextUser.symbol;

  evaluateGameEndState();

  if (nextUser.isAi) {
    STATUS.textContent = "Computer thinking...";
    setTimeout(() => {
      handleAiMove(nextUser);
      if (!evaluateGameEndState())
        STATUS.textContent = "Play as " + currentUser.symbol;
    }, 1000);
  }
}

let gameOver = false;
let gameBoard = h.initial_state();
let playingAi = false;

let player1 = new Player("player1", h.X, false);
let player2 = new Player("player2", h.O, false);

for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-index", `${i},${j}`);
    cell.addEventListener("click", (event) => {
      handleEvent(event, i, j);
    });
    BOARD.appendChild(cell);
  }
}

SWITCH.textContent = "Play AI";
STATUS.textContent = "Play as X";

RESET.addEventListener("click", () => {
  reset();
});

SWITCH.addEventListener("click", () => {
  playingAi = !playingAi;

  if (!playingAi) {
    player1.isAi = false;
    player2.isAi = false;
  }

  reset();

  if (playingAi) {
    SWITCH.textContent = "Play Human";
    const humanSymbol = prompt("Enter your symbol: ").toUpperCase();

    if (humanSymbol === h.X) {
      player2.isAi = true;
      return;
    } else {
      player1.isAi = true;
      makeRandomMove(player1);
      return;
    }
  }

  SWITCH.textContent = "Play AI";
});
