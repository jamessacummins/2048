var bestScore = document.getElementById("best-score");
var currentScore = document.getElementById("current-score");
var classNameList = {
    2:"_2-tile",
    4:"_4-tile",
    8:"_8-tile",
    16:"_16-tile",
    32:"_32-tile",
    64:"_64-tile",
    128:"super-tile",
    256:"super-tile",
    512:"super-tile",
    1024:"super-tile",
    2048:"super-tile",
};

var currentTurn = 0;

var allTileArrays = [];

var currentTileArray = [16];

for(i = 0; i < 16; i++){
    currentTileArray[i] = -1;
};

injectTiles();
assignFirstTwoTiles();
paintTiles();
document.addEventListener("keydown", (e) =>{
    updateTiles(e);
});

//window.setInterval(paintTiles, 500);


function injectTiles(){

    var tilesContainer = document.querySelector("#tiles-container");
    var tile = takeTemplateIdReturnFirstChildNode("#tile-template");

    for(i = 0; i < 16; i++){
        var tile = takeTemplateIdReturnFirstChildNode("#tile-template");
        tile.id = i;
        tilesContainer.appendChild(tile);
    }
    
}

function assignFirstTwoTiles(){
    firstIndex = getRandomNumberCeiling16();
    secondIndex = getRandomNumberCeiling16();
    while(firstIndex == secondIndex){
        secondIndex = getRandomNumberCeiling16();
    };
    currentTileArray[4] = 2;
    currentTileArray[7] = 2;
}
function generateTile(){
    // get index
    // check if index has a -1
    // if index has a -1 assign it to two and break

    var index = getRandomNumberCeiling16();
    while(true){
        if(currentTileArray[index] == -1){
            currentTileArray[index] = 2;
            break;
        }
        index = getRandomNumberCeiling16();
    };
}



function paintTiles(){
    var tilesContainer = document.querySelector("#tiles-container");
    for(i = 0; i < 16; i++){
        var tile = tilesContainer.children[i];
        if(currentTileArray[i] != -1){
            if(!tile.firstElementChild) tile.appendChild(takeTemplateIdReturnFirstChildNode("#tile-template").children[0]);
            tile.firstElementChild.textContent = currentTileArray[i];
            Object.values(classNameList).forEach((value) => { tile.classList.remove(value)});
            tile.classList.add(classNameList[currentTileArray[i]])
        } else {
            Object.values(classNameList).forEach((value) => { tile.classList.remove(value)});
            tile.textContent = "";
        }
    }
}


function getRandomNumberCeiling16(){
    return Math.floor(Math.random() * 16);
};

function increaseBestScore(){
    bestScore.innerHTML = Number(bestScore.innerHTML) +1;
}
function increaseCurrentScore(){
    currentScore.innerHTML = Number(currentScore.innerHTML) +1;
}

function startNewGame(){
    console.log("started!")
}

function takeTemplateIdReturnFirstChildNode(id){
    var node = document.querySelector(id).content.firstElementChild.cloneNode(true);
    return node;
};

function updateTiles(e){
    console.log("ran");
    
    if(e.key == "ArrowDown"){
        for(i = 0; i < 12; i++){
            mergeAIntoB(i, i+4);
        }
        generateTile();
        paintTiles();
    };
    
    if(e.key == "ArrowUp"){
        for(i = 15; i  > 3; i--){
            mergeAIntoB(i, i-4);
        }
        generateTile();
        paintTiles();
    };
    
    if(e.key == "ArrowLeft"){
        for(i = 3; i > 0; i--){
            mergeAIntoB(i, i-1);
        }
        for(i = 7; i > 4; i--){
            mergeAIntoB(i, i-1);
        }
        for(i = 11; i > 8; i--){
            mergeAIntoB(i, i-1);
        }
        for(i = 15; i > 12; i--){
            mergeAIntoB(i, i-1);
        }
        generateTile();
        paintTiles();
    };
    if(e.key == "ArrowRight"){
        for(i = 0; i < 3; i++){
            mergeAIntoB(i, i+1);
        }
        for(i = 4; i < 7; i++){
            mergeAIntoB(i, i+1);
        }
        for(i = 8; i < 11; i++){
            mergeAIntoB(i, i+1);
        }
        for(i = 12; i < 15; i++){
            mergeAIntoB(i, i+1);
        }
        generateTile();
        paintTiles();
    };

}

function mergeAIntoB(indexA, indexB){
    console.log(indexA, indexB);
    if(currentTileArray[indexA] == -1){
        return;
    }
    if(currentTileArray[indexB] == -1){
        currentTileArray[indexB] = currentTileArray[indexA];
        currentTileArray[indexA] = -1;
        return;
    }
    if(currentTileArray[indexA] == currentTileArray[indexB]){
        currentTileArray[indexB] = currentTileArray[indexA] * 2;
        currentTileArray[indexA] = -1;
        return;
    };
    return;
}


