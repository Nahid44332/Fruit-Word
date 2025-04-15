const words = ["APPLE", "BANANA", "MANGO", "ORANGE", "PINEAPPLE", "GRAPES", "WATERMELON", "KIWI", "CHERRY", "PAPAYA"];
const gridSize = 10;
let timer;
let timeLeft = 60;
let score = 0;
let selectedCells = [];
let foundWords = [];

const board = document.getElementById("game-board");
const wordList = document.getElementById("word-list");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");

function generateGrid() {
  board.innerHTML = "";
  const grid = Array(gridSize * gridSize).fill("");

  words.forEach(word => {
    let placed = false;
    while (!placed) {
      const direction = Math.random() < 0.5 ? "H" : "V";
      const start = Math.floor(Math.random() * gridSize * gridSize);
      const row = Math.floor(start / gridSize);
      const col = start % gridSize;
      let fits = true;

      for (let i = 0; i < word.length; i++) {
        const r = direction === "H" ? row : row + i;
        const c = direction === "H" ? col + i : col;
        if (r >= gridSize || c >= gridSize || grid[r * gridSize + c] !== "") {
          fits = false;
          break;
        }
      }

      if (fits) {
        for (let i = 0; i < word.length; i++) {
          const r = direction === "H" ? row : row + i;
          const c = direction === "H" ? col + i : col;
          grid[r * gridSize + c] = word[i];
        }
        placed = true;
      }
    }
  });

  for (let i = 0; i < grid.length; i++) {
    if (grid[i] === "") {
      grid[i] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
    const cell = document.createElement("div");
    cell.textContent = grid[i];
    cell.dataset.index = i;
    cell.addEventListener("click", () => selectCell(cell));
    board.appendChild(cell);
  }
}

function populateWordList() {
  wordList.innerHTML = "";
  words.forEach(word => {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.textContent = word;
    wordList.appendChild(li);
  });
}

function selectCell(cell) {
  if (cell.classList.contains("found")) return;
  cell.classList.toggle("selected");
  const idx = selectedCells.indexOf(cell);
  if (idx > -1) {
    selectedCells.splice(idx, 1);
  } else {
    selectedCells.push(cell);
  }
  checkSelection();
}

function checkSelection() {
  const selectedWord = selectedCells.map(cell => cell.textContent).join("");
  const reversed = selectedWord.split("").reverse().join("");
  if (words.includes(selectedWord) || words.includes(reversed)) {
    selectedCells.forEach(cell => {
      cell.classList.remove("selected");
      cell.classList.add("found");
    });
    foundWords.push(selectedWord);
    updateScore();
    updateWordList(selectedWord);
    selectedCells = [];
    if (foundWords.length === words.length) {
      endGame();
    }
  }
}

function updateScore() {
  score += 10;
  scoreDisplay.textContent = score;
}

function updateWordList(word) {
  const listItem = [...wordList.children].find(item => item.textContent === word);
  if (listItem) {
    listItem.classList.add("list-group-item-success");
    listItem.textContent = `${word} - Found!`;
  }
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(timer);
  document.getElementById("final-time").textContent = 60 - timeLeft;
  document.getElementById("final-score").textContent = score;
  new bootstrap.Modal(document.getElementById("victoryModal")).show();
}

function resetGame() {
  timeLeft = 60;
  score = 0;
  foundWords = [];
  selectedCells = [];
  timerDisplay.textContent = timeLeft;
  scoreDisplay.textContent = score;
  generateGrid();
  populateWordList();
  clearInterval(timer);
  startTimer();
}

document.getElementById("hint-btn").addEventListener("click", () => {
  const remaining = words.filter(w => !foundWords.includes(w));
  const hint = remaining[Math.floor(Math.random() * remaining.length)];
  alert("Hint: Look for the fruit starting with " + hint[0]);
});

document.getElementById("reset-btn").addEventListener("click", resetGame);

window.onload = () => {
  generateGrid();
  populateWordList();
  startTimer();
};
