document.addEventListener("DOMContentLoaded", () => {
    const boardElement = document.getElementById("board");
    const statusElement = document.getElementById("status");
    const twoPlayerButton = document.getElementById("twoPlayer");
    const singlePlayerButton = document.getElementById("singlePlayer");
    const difficultySelect = document.getElementById("difficulty");
  
    const resultModal = document.getElementById("resultModal");
    const resultMessage = document.getElementById("resultMessage");
    const closeModal = document.querySelector(".close");
    const playAgainButton = document.getElementById("playAgain");
  
    let board = Array(9).fill(null);
    let xIsNext = true;
    let isSinglePlayer = false;
    let difficulty = 'easy';
    let gameOver = false;
  
    twoPlayerButton.addEventListener("click", () => {
      isSinglePlayer = false;
      difficultySelect.classList.add("hidden");
      resetGame();
    });
  
    singlePlayerButton.addEventListener("click", () => {
      isSinglePlayer = true;
      difficultySelect.classList.remove("hidden");
      resetGame();
    });
  
    difficultySelect.addEventListener("change", (event) => {
      difficulty = event.target.value;
    });
  
    boardElement.addEventListener("click", (event) => {
      if (gameOver) return;
      const index = Array.from(boardElement.children).indexOf(event.target);
      if (board[index] || index === -1) return;
      handleMove(index);
      if (isSinglePlayer && !gameOver && !xIsNext) {
        setTimeout(() => makeAIMove(), 500);
      }
    });
  
    closeModal.addEventListener("click", () => {
      resultModal.style.display = "none";
    });
  
    playAgainButton.addEventListener("click", () => {
      resultModal.style.display = "none";
      resetGame();
    });
  
    window.onclick = (event) => {
      if (event.target == resultModal) {
        resultModal.style.display = "none";
      }
    };
  
    function handleMove(index) {
      board[index] = xIsNext ? 'X' : 'O';
      xIsNext = !xIsNext;
      renderBoard();
      checkWinner();
    }
  
    function makeAIMove() {
      let move;
      if (difficulty === 'easy') {
        move = getRandomMove();
      } else if (difficulty === 'medium') {
        move = getMediumMove();
      } else {
        move = getHardMove();
      }
      handleMove(move);
    }
  
    function getRandomMove() {
      const emptyIndices = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
      return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }
  
    function getMediumMove() {
      // For simplicity, this is just a random move
      return getRandomMove();
    }
  
    function getHardMove() {
      // Minimax algorithm implementation
      return minimax(board, 'O').index;
    }
  
    function minimax(newBoard, player) {
      const availSpots = newBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
  
      if (checkWin(newBoard, 'X')) {
        return { score: -10 };
      } else if (checkWin(newBoard, 'O')) {
        return { score: 10 };
      } else if (availSpots.length === 0) {
        return { score: 0 };
      }
  
      const moves = [];
      for (let i = 0; i < availSpots.length; i++) {
        const move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;
  
        if (player === 'O') {
          const result = minimax(newBoard, 'X');
          move.score = result.score;
        } else {
          const result = minimax(newBoard, 'O');
          move.score = result.score;
        }
  
        newBoard[availSpots[i]] = null;
        moves.push(move);
      }
  
      let bestMove;
      if (player === 'O') {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
          if (moves[i].score > bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
          if (moves[i].score < bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      }
  
      return moves[bestMove];
    }
  
    function renderBoard() {
      boardElement.innerHTML = '';
      board.forEach((square, index) => {
        const squareElement = document.createElement("div");
        squareElement.className = 'square';
        squareElement.textContent = square;
        boardElement.appendChild(squareElement);
      });
      statusElement.textContent = gameOver ? '' : `Next player: ${xIsNext ? 'X' : 'O'}`;
    }
  
    function checkWinner() {
      const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];
      for (let line of lines) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          gameOver = true;
          if (isSinglePlayer) {
            if (board[a] === 'X') {
              resultMessage.textContent = 'You won!';
            } else {
              resultMessage.textContent = 'You lost. Better luck next time!';
            }
          } else {
            resultMessage.textContent = `Winner: ${board[a]}`;
          }
          resultModal.style.display = "block";
          return;
        }
      }
      if (board.every(square => square !== null)) {
        resultMessage.textContent = 'Draw';
        resultModal.style.display = "block";
        gameOver = true;
      }
    }
  
    function checkWin(board, player) {
      const winLines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];
      for (let line of winLines) {
        const [a, b, c] = line;
        if (board[a] === player && board[b] === player && board[c] === player) {
          return true;
        }
      }
      return false;
    }
  
    function resetGame() {
      board = Array(9).fill(null);
      xIsNext = true;
      gameOver = false;
      renderBoard();
      statusElement.textContent = `Next player: X`;
    }
  
    resetGame();
  });
  