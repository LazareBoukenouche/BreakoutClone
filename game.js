// Colors constantes declaration

const TOP = 0;
const LEFT = 0;
const BLACK = "#000000";
const WHITE = "#FFFFFF";
const RED = "#FF0000";
const GREEN = "#00FF00";
const BLUE = "#0000FF";
const YELLOW = "#FFFF00";
const YELLOWGREEN = "#AAFF00";
const REDORANGE = "#FFAA00";
const ORANGE = "#FF7000";
const COLORS = [RED,ORANGE,REDORANGE,YELLOW,YELLOWGREEN,GREEN];

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
  }

// how to play sound
// var music;
// music = new sound("/static/sound/music.mp3");
// music.play();
// music.stop();

// Create the canvas window, where the game will be played.
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let startingCount = 1;
let timeInterval = 10;

let game_over = false;

// Declaration of the width and height of the player
const HEIGHT_PLAYER = canvas.height/40;
var WIDTH_PLAYER = canvas.width/5;


// Declaration of the coordinates and the speed of the player
let initialPlayerYpos = 550;
let playerXPos = 240;
let playerSpeed = -20;
let playerCollision = true;
let playerCenter = playerXPos + WIDTH_PLAYER/2;
let playerLeft = playerCenter - 50;
let playerRight = playerCenter +50;
let speed = 10;

let arrowLeft = false;
let arrowRight = false;

// Declaration of the coordinates and the speed of the ball
let circleXPos = 200;
let circleYPos = 475;
let circleRadius = 8;
let circleSpeedX = 4;
let circleSpeedY = 4;
let circleSpeed = 4;

// Declaration of the variables of the blocks
let blockColumns = 17;
let blockRows = 6
let blockGap = 30
let blockWidth = 30;
let blockHeight = 20;
let blockOffsetTop = 50;
let blockOffsetLeft = 0;

var blocks = [];

var score = 0;
var nb_blocks = blockRows* blockColumns;
// Creating the coordinates of the blocks and putting them in a 2D array
for (let i = 0;i<blockColumns;i++) {
    blocks[i] = [];
    for (let j = 0;j< blockRows;j++) {
        blocks[i][j] = {x:0,y:0,touched:false,color:COLORS[0]};
    }
}

// Main Game loop, with an interval of time implemented with a setTimeout function
function main() {
    write('Score  : '+ score.toString(10),canvas.width/3,canvas.height/15);
    write('Briques  : '+ nb_blocks.toString(10),canvas.width/1.6,canvas.height/15);
    startingCount = 0;
	// setTimeout(function onTick(timeInterval) {
    clearCanvas(LEFT,TOP,canvas.width,canvas.height);
    checkAllCollision();
    drawAllGameElements();
    movePlayer();
    moveCircle(circleSpeedX, circleSpeedY);
    // Call main again
    // main();
    // }, timeInterval)
    if (!game_over) {
    	requestAnimationFrame(main);
    	}
  }

// Display the menu on the canvas, pressing X will start the game
function menu() {
    setColors(BLACK,WHITE);
    drawRect(LEFT,TOP,canvas.width,canvas.height);
    drawRect(canvas.width/4, canvas.height/5, 350,200);
    write('Click',canvas.width/3,canvas.height/2);
    write('for starting Breakout',canvas.width/3.7, canvas.height/1.6);
}

// Function used for writing messages on the screen menu
function write(text,x,y) {
    context.font = '30px serif';
    setColors(BLACK, BLACK);
    context.fillText(text, x, y);
}

// This function "clean" the canvas by drawing a white rectangle on the canvas.
function clearCanvas(Xpos,Ypos,width,height) {
    setColors(WHITE,WHITE);
    drawRect(Xpos,Ypos,width,height);
    }

// Define the colors used when drawing a shape, the two parameters as the border color and the full color
function setColors(colorBorder,colorFull){
    context.strokeStyle = colorBorder;
    context.fillStyle = colorFull;
    }

////////// DRAWING FUNCTIONS  //////////

// Draw the player cursor
function drawRect(coordX,coordY,width,height){
    // fillRect() draw a full rectangle and strokeRect() draw a border
    context.fillRect(coordX,coordY,width,height);
    context.strokeRect(coordX,coordY,width,height);
    }

// Draw the ball
function drawCircle(xPos,yPos,radius,startingAngle,endingAngle) {
    setColors(BLUE,BLUE);
    context.beginPath();
    context.arc(xPos,yPos,radius,startingAngle,endingAngle);
    context.fill();
}

// Draw all the blocks
function drawAllBlocks() {
    for (var i=0;i<blockColumns;i++) {
        for (var j=0;j<blockRows;j++) {
            context.fillStyle = COLORS[j]; // Math.floor(Math.random() * 6)
            blocks[i][j].color = context.fillStyle;
            var blockX = (i*(blockRows+blockGap))+ blockOffsetLeft;
            var blockY = (j*(blockColumns+10))+ blockOffsetTop;
            if (blocks[i][j].touched === false) {
                blocks[i][j].x = blockX;
                blocks[i][j].y = blockY;
                context.beginPath();
                context.rect(blockX, blockY, blockWidth, blockHeight);
                context.fill();
                context.closePath();
            }
        }
    }
}

// Regroup all the drawing functions under this one
function drawAllGameElements() {
    drawAllBlocks();
    drawRect(playerXPos,initialPlayerYpos,WIDTH_PLAYER,HEIGHT_PLAYER);
    drawCircle(circleXPos,circleYPos,circleRadius,0,2*Math.PI);
}
////////// END DRAWING FUNCTIONS  //////////

////////// COLLISION FUNCTIONS  //////////

// Check if the ball hit a wall

function checkWallCollision() {
    // Si la balle touche le bord gauche
    if (circleXPos < 0) {
        circleXPos = 0
        circleSpeedX = -circleSpeedX;
    }
    // Si la balle touche le bord droit
    if (circleXPos - circleRadius > canvas.width) {
        circleXPos = canvas.width - circleRadius;
        circleSpeedX = -circleSpeedX;
    }
    // Si la balle touche le bord haut
    if (circleYPos < 0) {
        circleYPos = 0;
        circleSpeedY = - circleSpeedY;
    }
    // Si la balle touche le bord bas
    if (circleYPos > canvas.height - circleRadius) {
        circleYPos = canvas.height- circleRadius;
        circleSpeedX = 0;
        game_over = true;
    }
}

// Check if the ball hit the cursor
function checkPlayerCollision() {
    
    if (circleYPos > initialPlayerYpos && circleYPos < initialPlayerYpos + HEIGHT_PLAYER && circleXPos > playerXPos && circleXPos < playerXPos + WIDTH_PLAYER){
    
    let collidePoint = circleXPos - (playerXPos + WIDTH_PLAYER/2);
    collidePoint = collidePoint / (WIDTH_PLAYER/2);
    let angle = collidePoint * (Math.PI/3);
    circleSpeedX = circleSpeed * Math.sin(angle);
    circleSpeedY = - circleSpeed * Math.cos(angle);
        }
    }
    
// Check if the ball hit on of the blocks
function checkBlockCollision() {
    for (var c = 0; c < blockColumns; c++){
        for (var r = 0; r < blockRows; r++){
            if (blocks[c][r].touched === false) {
                if (circleYPos > blocks[c][r].y && circleYPos < blocks[c][r].y + blockHeight && circleXPos > blocks[c][r].x && circleXPos < blocks[c][r].x + blockWidth) {
                    let collidePoint = circleXPos - (playerXPos + WIDTH_PLAYER/2);
		    collidePoint = collidePoint / (WIDTH_PLAYER/2);
		    let angle = collidePoint * (Math.PI/3);
		    circleSpeedX = circleSpeed * Math.sin(angle);
		    circleSpeedY = - circleSpeedY;
                    blocks[c][r].touched = true;
                    score+=1;
                    nb_blocks-=1;
                    if(score === blockColumns*blockRows) {
                        alert("Gagné");
                    }
                }
            }
        }
    }
}


// Regroup all the collison functions under this one
function checkAllCollision() {
    checkWallCollision();
    checkBlockCollision();
    checkPlayerCollision();
}

////////// END COLLISION FUNCTIONS  //////////

////////// DEPLACEMENT FUNCTIONS  //////////
function movePlayer() {
    if (arrowRight && playerXPos + WIDTH_PLAYER < canvas.width) {
    	playerXPos += speed;
    }
    else if (arrowLeft && playerXPos > 0) {
    	playerXPos -= speed;
    }
}

function moveCircle(speedX, speedY) {
    circleXPos += speedX;
    circleYPos += speedY;
}
////////// END DEPLACEMENT FUNCTIONS  //////////

document.getElementById("canvas").addEventListener("click", function( event ) {
    main();
  }, {once : true});

// Creating keyboard events with the Char codes of the keyboard
document.onkeydown = function(e) {
    switch (e.keyCode) {
        // Pressing X for displaying infos
        case 88:
            if (game_over == true) {
                document.location.reload();
                clearInterval(interval);
            }
            // else {
            //     playerXpos = 0;
            //     WIDTH_PLAYER = canvas.width;
            //     // let data_display = document.querySelector(".data_display");
            //     // data_content = document.createTextNode(blocks[11][6].x);
            //     // data_display.appendChild(data_content);
            // }
            break;

    // Keyboard keys for changing the direction of the player
        //Left arrow
        case 37:
            arrowLeft = true;
            if (playerXPos < 0) {
                playerXPos = 0;
            }
            break;
        //Right arrow
        case 39:
            arrowRight = true;
            if (playerXPos +  WIDTH_PLAYER > canvas.width) {
                playerXPos = canvas.width - WIDTH_PLAYER;
            }
            break;
    }
};

document.onkeyup = function(e) {
    switch (e.keyCode) {
        //Left arrow
        case 37:
            arrowLeft = false;
            break;
        //Right arrow
        case 39:
            arrowRight = false;
            break;
    }
};

// Launch the game
menu()
