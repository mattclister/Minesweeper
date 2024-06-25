// Values

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

// GET START ELEMENTS

let allGridButtons;
let gameSpace = document.getElementById("game-space");
let startBtn = document.getElementById("btn-start");
let difficultySettings = document.getElementsByName("dificulty");
let difficulty = [...difficultySettings].filter(
  (option) => option.checked === true
)[0].value;
let size = difficultyGridSettings[difficulty]["gridSize"];
let modifier = difficultyGridSettings[difficulty]["modifier"];
let modifierTotal = 0;

// FUNCTIONS

const updateSettings = function () {
  difficultySettings = document.getElementsByName("dificulty");
  difficulty = [...difficultySettings].filter(
    (option) => option.checked === true
  )[0].value;
  size = difficultyGridSettings[difficulty]["gridSize"];
  modifier = difficultyGridSettings[difficulty]["modifier"];
};

// Generates the visable game table and values table

const generateGameTable = function () {
  updateSettings();
  gameValuesTable = [];
  let outputGrid = "<table>";
  for (let row = 0; row < size; row++) {
    let outputRow = "<tr>";
    gameValuesTable.push([]);
    visibilityTable.push([]);
    for (let col = 0; col < size; col++) {
      outputRow += `<td><button onclick="pickSquare(this)" class="game-button"id="${col},${row}"></button></td>`;
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
  console.log(visibilityTable)
  allGridButtons = Array.from(document.getElementsByClassName("game-button"));
};

// Generate Mines

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

const calculateNumber = function (x, y) {
  let check_row;
  let check_col;
  let count_of_mines_nearby = 0;

  if (gameValuesTable != []) {
    for (let ord = 0; ord < 8; ord++) {
      check_row = x + relative_coordinates_to_check[ord][1];
      check_col = y + relative_coordinates_to_check[ord][2];

      if (
        check_row >= 0 &&
        check_col >= 0 &&
        check_row < size &&
        check_col < size &&
        gameValuesTable[check_row][check_col] === "#"
      ) {
        count_of_mines_nearby += 1;
      }
    }
  }
  return gameValuesTable[x][y] === "#" ? "#" : count_of_mines_nearby;
};

const generateMineCounts = function () {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      gameValuesTable[row][col] = calculateNumber(row, col);
    }
  }
};

// Infinately checking square in loop

const revealsquare = function (x, y) {
  if ( x >= 0 && y >= 0 && x < size && y < size && visibilityTable[x][y] == 0) {
  const square = document.getElementById(`${x},${y}`);
  if (square.hasAttribute("class: white")) {
    square.classList.add("white");
    console.log(square)
    square.innerText = gameValuesTable[x][y]
    if(gameValuesTable[x][y] == 0 ){
      revealsquare(x-1,y-1)
      revealsquare(x-1,y)
      revealsquare(x-1,1)
      revealsquare(x,y-1)
      revealsquare(x,y+1)
      revealsquare(x+1,y-1)
      revealsquare(x+1,y)
      revealsquare(x+1,y+1)
    };
  };
  };
};

const pickSquare = function (item) {
  let position = item.id.split(",");
  console.log(`Position: ${position}`);
  if (gameValuesTable[position[0]][position[1]] === "#") {
    console.log("Mine FOUND");
    alert("You Have LOST!");
    gameSpace.innerHTML = [];
    visibilityTable = [];
  } else if (gameValuesTable[position[0]][position[1]] >= 1 && visibilityTable[position[0]][position[1]] == 0) {
    item.innerText = gameValuesTable[position[0]][position[1]];
    item.classList.add("white");
    visibilityTable[position[0]][position[1]] = 1
  } else if (gameValuesTable[position[0]][position[1]] == 0 && visibilityTable[position[0]][position[1]] == 0) {
    revealsquare(position[0], position[1]);
  }
};

// Events
startBtn.addEventListener("click", generateGameTable);
