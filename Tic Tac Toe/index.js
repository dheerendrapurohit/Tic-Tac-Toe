// Factory for creating players
const Player = (name, marker) => {
    return { name, marker };
  };
  
  // Gameboard Module (IIFE to ensure only one instance)
  const Gameboard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];
  
    // Render the board to the DOM
    const render = () => {
      const gameboardDiv = document.getElementById("gameboard");
      gameboardDiv.innerHTML = ""; // Clear previous board
  
      board.forEach((mark, index) => {
        const square = document.createElement("div");
        square.classList.add("square");
        square.dataset.index = index;
        square.textContent = mark;
  
        square.addEventListener("click", Game.handleMove);
        gameboardDiv.appendChild(square);
      });
    };
  
    const resetBoard = () => {
      board.fill("");
    };
  
    const updateBoard = (index, marker) => {
      board[index] = marker;
    };
  
    const getBoard = () => board;
  
    return {
      render,
      resetBoard,
      updateBoard,
      getBoard,
    };
  })();
  
  // Game Module to control the flow of the game
  const Game = (() => {
    let player1, player2;
    let currentPlayer;
    let gameOver = false;
  
    // Initialize game with player names
    const startGame = (player1Name, player2Name) => {
      player1 = Player(player1Name, "X");
      player2 = Player(player2Name, "O");
      currentPlayer = player1;
      Gameboard.resetBoard();
      Gameboard.render();
      gameOver = false;
      document.getElementById("gameStatus").textContent = `${currentPlayer.name}'s turn`;
    };
  
    // Check if there's a win or tie
    const checkWinner = () => {
      const board = Gameboard.getBoard();
      const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]              // Diagonals
      ];
  
      for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a];
        }
      }
  
      if (board.every(square => square !== "")) {
        return "tie";
      }
  
      return null;
    };
  
    const handleMove = (event) => {
      const index = event.target.dataset.index;
  
      if (Gameboard.getBoard()[index] !== "" || gameOver) return;
  
      Gameboard.updateBoard(index, currentPlayer.marker);
      Gameboard.render();
  
      const result = checkWinner();
      if (result) {
        endGame(result);
      } else {
        switchPlayer();
      }
    };
  
    const switchPlayer = () => {
      currentPlayer = currentPlayer === player1 ? player2 : player1;
      document.getElementById("gameStatus").textContent = `${currentPlayer.name}'s turn`;
    };
  
    const endGame = (result) => {
      gameOver = true;
      const status = document.getElementById("gameStatus");
      if (result === "tie") {
        status.textContent = "It's a tie!";
      } else {
        status.textContent = `${currentPlayer.name} wins!`;
      }
      document.getElementById("restartGame").style.display = "block";
    };
  
    const restartGame = () => {
      document.getElementById("restartGame").style.display = "none";
      document.getElementById("gameStatus").textContent = "";
      startGame(player1.name, player2.name);
    };
  
    return {
      startGame,
      handleMove,
      restartGame,
    };
  })();
  
  // Event Listeners
  document.getElementById("startGame").addEventListener("click", () => {
    const player1Name = document.getElementById("player1Name").value || "Player 1";
    const player2Name = document.getElementById("player2Name").value || "Player 2";
    Game.startGame(player1Name, player2Name);
  });
  
  document.getElementById("restartGame").addEventListener("click", Game.restartGame);
  