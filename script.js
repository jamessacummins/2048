var bestScore = document.getElementById("best-score");
var currentScore = document.getElementById("current-score");
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

for (i = 0; i < 16; i++) {
    currentTileArray[i] = -1;
};

injectTiles();
//assignFirstTwoTiles();
currentTileArray = [16, 8, 4, 16, 32, 64, 128, 2048, 1024, 128, 16, 32, 4, 256, 2, -1]
paintTiles();
document.addEventListener("keydown", (e) => {
    updateTiles(e);
});

//window.setInterval(paintTiles, 500);


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
    currentTileArray[4] = 2;
    currentTileArray[7] = 2;
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



function paintTiles() {
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
}


function getRandomNumberCeiling16() {
    return Math.floor(Math.random() * 16);
};

function increaseBestScore() {
    bestScore.innerHTML = Number(bestScore.innerHTML) + 1;
}
function increaseCurrentScore() {
    currentScore.innerHTML = Number(currentScore.innerHTML) + 1;
}

function startNewGame() {
    console.log("started!")
}

function takeTemplateIdReturnFirstChildNode(id) {
    var node = document.querySelector(id).content.firstElementChild.cloneNode(true);
    return node;
};

function redraw() {

    if(currentTileArray.includes(-1)){
        generateTile();
    }

    if(hasMovesAvailable()){
        paintTiles();
    } else {
        paintTiles();
        gameOver();
    }

}


function hasMovesAvailable(){
    var hasMoves = false;
    for(i = 0; i < 16; i++){
        if(tileCanMerge(i)){
            hasMoves = true;
            break;
        }
    }
    return hasMoves;
};

function tileCanMerge(index){
    leftArray = [ 3, 7, 11, 15 ];
    rightArray = [ 0, 4, 8, 12 ];

    if(currentTileArray[index + 1] != undefined && currentTileArray[index] != -1 && ! leftArray.includes(index) && (currentTileArray[index] == currentTileArray[index + 1] || currentTileArray[index + 1] == -1)){
        console.log(index+ " right");
        return true;
    }
    if(currentTileArray[index - 1] != undefined && currentTileArray[index] != -1 && ! rightArray.includes(index)  && (currentTileArray[index] == currentTileArray[index - 1] || currentTileArray[index - 1] == -1)){
        console.log(index + " left");
        return true;
    }
    if(currentTileArray[index - 4] != undefined && currentTileArray[index] != -1  && (currentTileArray[index] == currentTileArray[index - 4] || currentTileArray[index - 4] == -1)){
        console.log(index + " up");
        return true;
    }
    if(currentTileArray[index + 4] != undefined && currentTileArray[index] != -1  && (currentTileArray[index] == currentTileArray[index + 4] || currentTileArray[index + 4] == -1)){
        console.log(index + " down");
        return true;
    }
    return false;
}

function gameOver(){
    console.log("game over");
}

const { SwipeEventListener } = window.SwipeEventListener;

const { swipeArea, updateOptions } = SwipeEventListener({
    swipeArea: document.querySelector('#game-container'),
});

swipeArea.addEventListener('swipeDown', () => {
    mergeDown();
    redraw();
});
swipeArea.addEventListener('swipeUp', () => {
    mergeUp();
    redraw();
});

swipeArea.addEventListener('swipeLeft', () => {
    mergeLeft();
    redraw();
});

swipeArea.addEventListener('swipeRight', () => {
    mergeRight();
    redraw();
});

document.querySelector("#game-container").addEventListener("touchstart", preventScroll);
document.querySelector("#game-container").addEventListener("touchmove", preventScroll);
document.querySelector("#game-container").addEventListener("touchend", preventScroll);
document.querySelector("#game-container").addEventListener("touchcancel", preventScroll);

function preventScroll(e){
    e.preventDefault();
    e.stopPropagation();
}

function updateTiles(e) {
    console.log("ran");

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
        currentTileArray[indexB] = currentTileArray[indexA] * 2;
        currentTileArray[indexA] = -1;
        return false;
    };
    return mergeSame;
}


