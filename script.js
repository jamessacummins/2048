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

var currentTileArray = [16];

for(i = 0; i < 16; i++){
    currentTileArray[i] = -1;
};

injectTiles();
assignFirstTwoTiles();

window.setInterval(paintTiles, 100);


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
    currentTileArray[firstIndex] = 2;
    currentTileArray[secondIndex] = 2;
}



function paintTiles(){
    var tilesContainer = document.querySelector("#tiles-container");
    while (tilesContainer.firstChild) {
        tilesContainer.removeChild(tilesContainer.firstChild);
    }
    var tile = takeTemplateIdReturnFirstChildNode("#tile-template");

    for(i = 0; i < 16; i++){
        var tile = takeTemplateIdReturnFirstChildNode("#tile-template");
        tile.id = i;
        if(currentTileArray[i] != -1){
            tile.firstElementChild.textContent = currentTileArray[i];
            tile.classList.add(classNameList[currentTileArray[i]])
        };
        tilesContainer.appendChild(tile);
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
    return document.querySelector(id).content.firstElementChild.cloneNode(true);
};

document.addEventListener("keydown",increaseBestScore,null);
document.addEventListener("keydown",increaseCurrentScore,null);


