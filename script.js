console.log(document.getElementsByTagName("h1"));

var bestScore = document.getElementById("best-score");
var currentScore = document.getElementById("current-score");

function increaseBestScore(){
    bestScore.innerHTML = Number(bestScore.innerHTML) +1;
}
function increaseCurrentScore(){
    currentScore.innerHTML = Number(currentScore.innerHTML) +1;
}

function startNewGame(){

}

document.addEventListener("keydown",increaseBestScore,null);
document.addEventListener("keydown",increaseCurrentScore,null);