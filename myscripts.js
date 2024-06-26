// Dictionaries and Constants

const difficultyGridSettings = {
  easy: { gridSize: 6, modifier: 0.05 },
  medium: { gridSize: 10, modifier: 0.05 },
  hard: { gridSize: 14, modifier: 0.05 },
};

let gameValuesTable = [];
let visibilityTable = [];

const relative_coordinates_to_check = [
  ["NW", -1, -1],
  ["N", -1, 0],
  ["NE", -1, 1],
  ["W", 0, -1],
  ["E", 0, 1],
  ["SW", 1, -1],
  ["S", 1, 0],
  ["SE", 1, 1],
];

// Get start elements from layout

let allGridButtons;
let gameButtons = document.getElementsByClassName("game-button");
let gameSpace = document.getElementById("game-space");
let flagBtn = document.getElementById("plant-flag");
let startBtn = document.getElementById("btn-start");
let difficultySettings = document.getElementsByName("dificulty");
let difficulty = [...difficultySettings].filter(
  (option) => option.checked === true
)[0].value;
let size = difficultyGridSettings[difficulty]["gridSize"];
let modifier = difficultyGridSettings[difficulty]["modifier"];
let modifierTotal = 0;
let flag = false;

// ---------------------- FUNCTIONS ----------------------

// Updates changes to settings in settings variables. Should trigger whenever a setting is changed.
const updateSettings = function () {
  difficultySettings = document.getElementsByName("dificulty");
  difficulty = [...difficultySettings].filter(
    (option) => option.checked === true
  )[0].value;
  size = difficultyGridSettings[difficulty]["gridSize"];
  modifier = difficultyGridSettings[difficulty]["modifier"];
  gameValuesTable = [];
  visibilityTable = [];
};

// Generates the visable game table and the seperate values table, and visibility table.
// Game table is html table made of buttons. Values table is array holding mine counts for each "cell", visibity table is array showing if cell has been "revealed" by player.
const generateGameTable = function () {
  updateSettings();
  gameValuesTable = [];
  let outputGrid = "<table>";
  for (let row = 0; row < size; row++) {
    let outputRow = "<tr>";
    gameValuesTable.push([]);
    visibilityTable.push([]);
    for (let col = 0; col < size; col++) {
      outputRow += `<td><button onclick="pickSquare(this)" class="game-button"id="${row},${col}"></button></td>`;
      gameValuesTable[row].push([0]);
      visibilityTable[row].push(0);
    }
    outputRow += "</tr>";
    outputGrid += outputRow + "</tr>";
  }
  outputGrid += "</table>";
  gameSpace.innerHTML = outputGrid;
  generateGameMines();
  generateMineCounts();
  console.log(gameValuesTable);
  console.log(visibilityTable);
  allGridButtons = Array.from(document.getElementsByClassName("game-button"));
};

// Generate Mines. Once game and value table is created. Populates value table with mines, based on random number and difficulty modifier.
const generateMines = function () {
  let calc = Math.floor((Math.random() + modifierTotal) * 10);
  if (calc >= 9.8) {
    modifierTotal = 0;
    return "#";
  } else {
    modifierTotal = modifierTotal + modifier;
  }
};

const generateGameMines = function () {
  for (let row = 0; row < gameValuesTable.length; row++) {
    for (let col = 0; col < gameValuesTable.length; col++) {
      gameValuesTable[row][col] = generateMines();
    }
  }
};

// Check if a row and col combinations is valid, and within the given table.
const validCell = function (check_row, check_col) {
  return (
    check_row >= 0 && check_col >= 0 && check_row < size && check_col < size
  );
};

// Count Mines for each cell. After the value table has been populated with mines. For each other cell, count how many mines are next to it.
const calculateNumber = function (row, col) {
  let check_row;
  let check_col;
  let count_of_mines_nearby = 0;

  if (gameValuesTable != []) {
    for (let ord = 0; ord < 8; ord++) {
      check_row = row + relative_coordinates_to_check[ord][1];
      check_col = col + relative_coordinates_to_check[ord][2];

      if (
        validCell(check_row, check_col) &&
        gameValuesTable[check_row][check_col] === "#"
      ) {
        count_of_mines_nearby += 1;
      }
    }
  }
  return gameValuesTable[row][col] === "#" ? "#" : count_of_mines_nearby;
};

// Runs the above "Count Mines function" for all cells in the values grid.
const generateMineCounts = function () {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      gameValuesTable[row][col] = calculateNumber(row, col);
    }
  }
};

// The function that runs when a "cell" is clicked. <-- Fix This

const pickSquare = function (item) {
  let itemRow = item.id.split(",")[0];
  let itemCol = item.id.split(",")[1];
  console.log(`Row: ${itemRow} Col: ${itemCol}`);
  if (flag && item.innerText != "F") {item.innerText = "F"
  } else if (flag && item.innerText == "F") {item.innerText = ""}
  else if (gameValuesTable[itemRow][itemCol] == "#") {
    alert("MINE FOUND You have lost")
    gameValuesTable = []
    visibilityTable = []
    gameSpace.innerHTML = []
  } else if (gameValuesTable[itemRow][itemCol] == 0) {
    for (let ord = 0; ord < 8; ord++) {
      let check_row =
        Number(itemRow) + Number(relative_coordinates_to_check[ord][1]);
      let check_col =
        Number(itemCol) + Number(relative_coordinates_to_check[ord][2]);
      console.log(`Getting ID Row ${check_row},${check_col}`);
      if (
        validCell(check_row, check_col) &&
        visibilityTable[check_row][check_col] != 1
      ) {
        pickSquare(document.getElementById(`${check_row},${check_col}`));
      } else {
        visibilityTable[itemRow][itemCol] = 1;
        item.innerText = gameValuesTable[itemRow][itemCol];
        item.classList.add("white");
      }
      visibilityTable[itemRow][itemCol] = 1;
    }
  } else {
      visibilityTable[itemRow][itemCol] = 1;
      item.innerText = gameValuesTable[itemRow][itemCol];
        item.classList.add("white");
  }
};

// Plant Flag
const plantFlag = function() {
  if (flag) {flag = false;
    flagBtn.innerText = "Flag"
    flagBtn.classList.remove("blue")
  } else {flag = true
    flagBtn.innerText = "Select"
    flagBtn.classList.add("blue")
};
};

// Events
startBtn.addEventListener("click", generateGameTable);
flagBtn.addEventListener("click", plantFlag);