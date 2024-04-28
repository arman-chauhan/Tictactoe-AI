const X = "X";
const O = "O";
const T = "Tie";
const EMPTY = null;

function initial_state() {
  return [
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
  ];
}

function player(board) {
  let Xcount = 0;
  let Ocount = 0;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === X) Xcount++;
      else if (board[i][j] === O) Ocount++;
    }
  }

  if (Ocount < Xcount) {
    return O;
  }

  return X;
}

function getMoves(board) {
  let moves = [];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === EMPTY) {
        moves.push([i, j]);
      }
    }
  }

  return moves;
}

function moveExists(moves, move) {
  return moves.some(([row, col]) => row === move[0] && col === move[1]);
}

function makeMove(board, move) {
  let moves = getMoves(board);

  if (!moveExists) {
    throw "Invalid move";
  }

  let temp = board.map((row) => [...row]);

  const [row, col] = move;

  temp[row][col] = player(board);

  return temp;
}

function checkWinner(board) {
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] === board[i][1] &&
      board[i][1] === board[i][2] &&
      board[i][0] !== EMPTY
    ) {
      return board[i][0];
    }
  }

  for (let i = 0; i < 3; i++) {
    if (
      board[0][i] === board[1][i] &&
      board[1][i] === board[2][i] &&
      board[0][i] !== EMPTY
    ) {
      return board[0][i];
    }
  }

  if (
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2] &&
    board[0][0] !== EMPTY
  ) {
    return board[0][0];
  }
  if (
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0] &&
    board[0][2] !== EMPTY
  ) {
    return board[0][2];
  }

  return null;
}

function checkTerminate(board) {
  const winner = checkWinner(board);

  if (winner) {
    return winner;
  }

  for (const row of board) {
    if (row.includes(EMPTY)) {
      return false;
    }
  }

  return T;
}

function heuristic(board) {
  const winner = checkWinner(board);
  if (winner === X) {
    return 1;
  } else if (winner === O) {
    return -1;
  }
  return 0;
}

let nodeCount = 0;
function minimax(board, maximizingPlayer) {
  console.log(nodeCount);
  if (checkTerminate(board)) {
    return { value: heuristic(board), move: null };
  }

  if (maximizingPlayer) {
    let value = -Infinity;
    let bestMove = null;

    const actions = getMoves(board);

    for (let action of actions) {
      const result = makeMove(board, action);
      const { value: minVal } = minimax(result, false);
      nodeCount++;

      if (minVal > value) {
        value = minVal;
        bestMove = action;
      }
    }

    return { value: value, move: bestMove };
  } else {
    let value = Infinity;
    let bestMove = null;

    const actions = getMoves(board);

    for (let action of actions) {
      const result = makeMove(board, action);
      const { value: maxVal } = minimax(result, true);
      nodeCount++;

      if (maxVal < value) {
        value = maxVal;
        bestMove = action;
      }
    }

    return { value: value, move: bestMove };
  }
}

window.nodeCount = nodeCount;

export {
  X,
  O,
  T,
  EMPTY,
  initial_state,
  player,
  getMoves,
  makeMove,
  checkWinner,
  checkTerminate,
  minimax,
};
