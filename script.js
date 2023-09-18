const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];
  const getBoard = () => board;
  const setBoard = (index, value) => (board[index] = value);
  const resetBoard = () => (board = ["", "", "", "", "", "", "", "", ""]);
  return { getBoard, setBoard, resetBoard };
})();
const Player = (name, symbol) => {
  const getName = () => name;
  const getSymbol = () => symbol;
  return { getName, getSymbol };
};
const Game = (() => {
  let turn = Math.floor(Math.random() * 2);
  const getTurn = () => turn;
  const setTurn = () => (turn = turn === 0 ? 1 : 0);
  const checkWin = () => {
    const board = Gameboard.getBoard();
    const winConditions = [
      [0, 1, 2], // top row
      [3, 4, 5], // middle row
      [6, 7, 8], // bottom row
      [0, 3, 6], // left column
      [1, 4, 7], // middle column
      [2, 5, 8], // right column
      [0, 4, 8], // left diagonal
      [2, 4, 6], // right diagonal
    ];
    for (let i = 0; i < winConditions.length; i++) {
      const [a, b, c] = winConditions[i];
      if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
        return true;
      }
    }
    return false;
  };
  const checkDraw = () => {
    const board = Gameboard.getBoard();
    return board.every((value) => value !== "");
  };
  const resetGame = () => {
    Gameboard.resetBoard();
    turn = Math.floor(Math.random() * 2);
  };
  const playTurn = (index) => {
    const board = Gameboard.getBoard();
    if (board[index] !== "") {
      return false;
    }
    const symbol = turn === 0 ? "X" : "O";
    Gameboard.setBoard(index, symbol);
    setTurn();
    return true;
  };
  return { getTurn, checkWin, checkDraw, resetGame, playTurn };
})();
const displayController = (() => {
  const board = document.querySelector(".board");
  const cells = document.querySelectorAll(".cell");
  const turnDisplay = document.querySelector(".turn");
  const startButton = document.querySelector("#start");
  const resetButton = document.querySelector("#reset");
  startButton.addEventListener("click", () => {
    const player1Name = document.querySelector("#player1").value;
    const player2Name = document.querySelector("#player2").value;
    if (player1Name === "" || player2Name === "") {
      alert("Please enter player names");
      return;
    }
    let player1 = Player(player1Name, "X");
    let player2 = Player(player2Name, "O");
    let currentPlayer = Game.getTurn() === 0 ? player1 : player2;
    turnDisplay.textContent = `${currentPlayer.getName()}'s turn`;
    startButton.setAttribute("disabled", true);
    resetButton.removeAttribute("disabled");
    cells.forEach((cell) => {
      cell.addEventListener(
        "click",
        (e) => {
          const index = Number(e.target.getAttribute("id"));
          if (!Game.checkWin() && !Game.checkDraw()) {
            if (Game.playTurn(index)) {
              render();
              if (Game.checkWin()) {
                turnDisplay.textContent = `${currentPlayer.getName()} wins!`;
                startButton.removeAttribute("disabled");
              } else if (Game.checkDraw()) {
                turnDisplay.textContent = "It's a draw!";
                startButton.removeAttribute("disabled");
              } else {
                currentPlayer = Game.getTurn() === 0 ? player1 : player2;
                turnDisplay.textContent = `${currentPlayer.getName()}'s turn`;
              }
            }
          }
        },
        { once: true }
      );
    });
  });
  resetButton.addEventListener("click", () => {
    Game.resetGame();
    render();
    startButton.removeAttribute("disabled");
    resetButton.setAttribute("disabled", true);
  });
  const render = () => {
    const board = Gameboard.getBoard();
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };
  return { render };
})();
displayController.render();
