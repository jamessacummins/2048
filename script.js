var bestScoreHTML = document.getElementById("best-score");
var currentScoreHTML = document.getElementById("current-score");
var classNameList = {
    2: "_2-tile",
    4: "_4-tile",
    8: "_8-tile",
    16: "_16-tile",
    32: "_32-tile",
    64: "_64-tile",
    128: "super-tile",
    256: "super-tile",
    512: "super-tile",
    1024: "super-tile",
    2048: "super-tile",
};

var currentTurn = 0;

var allTileArrays = [];

var currentTileArray = [16];

var currentScore = 0;
var bestScore = 0;
var lock = false;
var won = false;

populateArray();
injectTiles();
assignFirstTwoTiles();
//currentTileArray = [16, 8, 4, 16, 32, 64, 128, 1024, 1024, 1024, 16, 32, 4, 256, 2, -1]
paintTilesAndScore();
document.addEventListener("keydown", (e) => {
    updateTiles(e);
});

//window.setInterval(paintTiles, 500);

function populateArray() {
    for (i = 0; i < 16; i++) {
        currentTileArray[i] = -1;
    };
}
function reset() {
    won = false;
    currentScore = 0;
    populateArray();
    assignFirstTwoTiles();
    if (document.querySelector("#game-over-container")) document.querySelector("#game-over-container").remove();
    if (document.querySelector("#win-container")) document.querySelector("#win-container").remove();
    paintTilesAndScore();
    lock = false;
}
function injectTiles() {

    var tilesContainer = document.querySelector("#tiles-container");
    var tile = takeTemplateIdReturnFirstChildNode("#tile-template");

    for (i = 0; i < 16; i++) {
        var tile = takeTemplateIdReturnFirstChildNode("#tile-template");
        tile.id = i;
        tilesContainer.appendChild(tile);
    }

}

function assignFirstTwoTiles() {
    firstIndex = getRandomNumberCeiling16();
    secondIndex = getRandomNumberCeiling16();
    while (firstIndex == secondIndex) {
        secondIndex = getRandomNumberCeiling16();
    };
    currentTileArray[firstIndex] = 2;
    currentTileArray[secondIndex] = 2;
}
function generateTile() {
    // get index
    // check if index has a -1
    // if index has a -1 assign it to two and break

    var index = getRandomNumberCeiling16();
    while (true) {
        if (currentTileArray[index] == -1) {
            currentTileArray[index] = 2;
            break;
        }
        index = getRandomNumberCeiling16();
    };
}



function paintTilesAndScore() {
    var tilesContainer = document.querySelector("#tiles-container");
    for (i = 0; i < 16; i++) {
        var tile = tilesContainer.children[i];
        if (currentTileArray[i] != -1) {
            if (!tile.firstElementChild) tile.appendChild(takeTemplateIdReturnFirstChildNode("#tile-template").children[0]);
            tile.firstElementChild.textContent = currentTileArray[i];
            Object.values(classNameList).forEach((value) => { tile.classList.remove(value) });
            tile.classList.add(classNameList[currentTileArray[i]])
        } else {
            Object.values(classNameList).forEach((value) => { tile.classList.remove(value) });
            tile.textContent = "";
        }
    }
    updateBestScore();
    updateCurrentScore();
}


function getRandomNumberCeiling16() {
    return Math.floor(Math.random() * 16);
};

function updateBestScore() {
    bestScoreHTML.innerHTML = bestScore;
}
function updateCurrentScore() {
    currentScoreHTML.innerHTML = currentScore;
}

function startNewGame() {
    console.log("started!")
}

function takeTemplateIdReturnFirstChildNode(id) {
    var node = document.querySelector(id).content.firstElementChild.cloneNode(true);
    return node;
};

function redraw() {
    if (hasWon()){
        handleWin();
    } else {
        if (currentTileArray.includes(-1)) {
            generateTile();
        }

        if (hasMovesAvailable()) {
            paintTilesAndScore();
        } else {
            paintTilesAndScore();
            gameOver();
        }
    }
}

function hasWon(){
    if(won == false && currentTileArray.includes(2048)) {
        won = true;
        return won;
    } 
    return false;
}

function handleWin(){
    paintTilesAndScore();
    lock = true;
    var wonGameTemplate = takeTemplateIdReturnFirstChildNode("#won-game-template");
    var gameParent = document.querySelector("#game-parent-container");
    gameParent.appendChild(wonGameTemplate);
}

function keepGoing(){
    lock = false;
    document.querySelector("#win-container").remove();
}


function hasMovesAvailable() {
    var hasMoves = false;
    for (i = 0; i < 16; i++) {
        if (tileCanMerge(i)) {
            hasMoves = true;
            break;
        }
    }
    return hasMoves;
};

function tileCanMerge(index) {
    leftArray = [3, 7, 11, 15];
    rightArray = [0, 4, 8, 12];

    if (currentTileArray[index + 1] != undefined && currentTileArray[index] != -1 && !leftArray.includes(index) && (currentTileArray[index] == currentTileArray[index + 1] || currentTileArray[index + 1] == -1)) {
        console.log(index + " right");
        return true;
    }
    if (currentTileArray[index - 1] != undefined && currentTileArray[index] != -1 && !rightArray.includes(index) && (currentTileArray[index] == currentTileArray[index - 1] || currentTileArray[index - 1] == -1)) {
        console.log(index + " left");
        return true;
    }
    if (currentTileArray[index - 4] != undefined && currentTileArray[index] != -1 && (currentTileArray[index] == currentTileArray[index - 4] || currentTileArray[index - 4] == -1)) {
        console.log(index + " up");
        return true;
    }
    if (currentTileArray[index + 4] != undefined && currentTileArray[index] != -1 && (currentTileArray[index] == currentTileArray[index + 4] || currentTileArray[index + 4] == -1)) {
        console.log(index + " down");
        return true;
    }
    return false;
}

function gameOver() {
    var gameOverTemplate = takeTemplateIdReturnFirstChildNode("#game-over-template");
    var gameParent = document.querySelector("#game-parent-container");
    gameParent.appendChild(gameOverTemplate);
    lock = true;
}

const { SwipeEventListener } = window.SwipeEventListener;

const { swipeArea, updateOptions } = SwipeEventListener({
    swipeArea: document.querySelector('#game-container'),
});

swipeArea.addEventListener('swipeDown', () => {
    if (!lock) {
        mergeDown();
        redraw();
    };
});
swipeArea.addEventListener('swipeUp', () => {
    if (!lock) {
        mergeUp();
        redraw();
    };
});

swipeArea.addEventListener('swipeLeft', () => {
    if (!lock) {
        mergeLeft();
        redraw();
    };
});

swipeArea.addEventListener('swipeRight', () => {
    if (!lock) {
        mergeRight();
        redraw();
    };
});

document.querySelector("#game-container").addEventListener("touchstart", preventScroll);
document.querySelector("#game-container").addEventListener("touchmove", preventScroll);
document.querySelector("#game-container").addEventListener("touchend", preventScroll);
document.querySelector("#game-container").addEventListener("touchcancel", preventScroll);

function preventScroll(e) {
    e.preventDefault();
    e.stopPropagation();
}

function updateTiles(e) {

    if (!lock) {
        if (e.key == "ArrowDown") {
            mergeDown();
            redraw();
        };
        if (e.key == "ArrowUp") {
            mergeUp();
            redraw();
        };
        if (e.key == "ArrowLeft") {
            mergeLeft();
            redraw();
        };
        if (e.key == "ArrowRight") {
            mergeRight();
            redraw();
        };
    };
}
function mergeDown() {
    for (index = 0; index < 4; index++) {
        var mergeSame = mergeAIntoB(index + 8, index + 12, true);
        mergeSame = mergeAIntoB(index + 4, index + 8, mergeSame);
        mergeSame = mergeAIntoB(index + 8, index + 12, mergeSame);
        mergeSame = mergeAIntoB(index + 0, index + 4, mergeSame);
        mergeSame = mergeAIntoB(index + 4, index + 8, mergeSame);
        mergeSame = mergeAIntoB(index + 8, index + 12, mergeSame);
    };
}
function mergeUp() {
    for (index = 12; index < 16; index++) {
        var mergeSame = mergeAIntoB(index - 8, index - 12, true);
        mergeSame = mergeAIntoB(index - 4, index - 8, mergeSame);
        mergeSame = mergeAIntoB(index - 8, index - 12, mergeSame);
        mergeSame = mergeAIntoB(index - 0, index - 4, mergeSame);
        mergeSame = mergeAIntoB(index - 4, index - 8, mergeSame);
        mergeSame = mergeAIntoB(index - 8, index - 12, mergeSame);
    };
}

function mergeLeft() {
    for (index = 3; index < 16; index += 4) {
        var mergeSame = mergeAIntoB(index - 2, index - 3, true);
        mergeSame = mergeAIntoB(index - 1, index - 2, mergeSame);
        mergeSame = mergeAIntoB(index - 2, index - 3, mergeSame);
        mergeSame = mergeAIntoB(index - 0, index - 1, mergeSame);
        mergeSame = mergeAIntoB(index - 1, index - 2, mergeSame);
        mergeSame = mergeAIntoB(index - 2, index - 3, mergeSame);
    };
}

function mergeRight() {
    for (index = 0; index < 13; index += 4) {
        var mergeSame = mergeAIntoB(index + 2, index + 3, true);
        mergeSame = mergeAIntoB(index + 1, index + 2, mergeSame);
        mergeSame = mergeAIntoB(index + 2, index + 3, mergeSame);
        mergeSame = mergeAIntoB(index + 0, index + 1, mergeSame);
        mergeSame = mergeAIntoB(index + 1, index + 2, mergeSame);
        mergeSame = mergeAIntoB(index + 2, index + 3, mergeSame);
    };
}

function mergeAIntoB(indexA, indexB, mergeSame) {
    if (currentTileArray[indexA] == -1) {
        return mergeSame;
    }
    if (currentTileArray[indexB] == -1) {
        currentTileArray[indexB] = currentTileArray[indexA];
        currentTileArray[indexA] = -1;
        return mergeSame;
    }
    if (currentTileArray[indexA] == currentTileArray[indexB] && mergeSame) {
        updateScore(indexA);
        currentTileArray[indexB] = currentTileArray[indexA] * 2;
        currentTileArray[indexA] = -1;
        return false;
    };
    return mergeSame;
}

function updateScore(index) {
    currentScore += (currentTileArray[index] + currentTileArray[index]);
    if (currentScore > bestScore) {
        bestScore = currentScore;
    }
}


