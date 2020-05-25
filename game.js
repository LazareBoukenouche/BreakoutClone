// Colors constantes declaration
const TOP = 0;
const LEFT = 0;
const BLACK = "#000000";
const WHITE = "#FFFFFF";
const RED = "#FF0000";
const GREEN = "#00FF00";
const BLUE = "#0000FF";
const YELLOW = "#FFFF00";
const ORANGE = "#FF7000";

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
let playerXpos = 240;
let playerSpeed = -20;
let playerCollision = true;

// Declaration of the coordinates and the speed of the ball
let circleXPos = 200;
let circleYPos = 475;
let circleRadius = 8;
let circleSpeedX = 6;
let circleSpeedY = 6;

// Declaration of the variables of the blocks
let blockColumns = 12
let blockRows = 6
let blockGap = 40
let blockWidth = 40;
let blockHeight = 30;
let blockOffsetTop = 50;
let blockOffsetLeft = 30;

var blocks = [];

var score = 0;
var nb_blocks = blockRows* blockColumns;
// Creating the coordinates of the blocks and putting them in a 2D array
for (let i = 0;i<blockColumns;i++) {
    blocks[i] = [];
    for (let j = 0;j< blockRows;j++) {
        blocks[i][j] = {x:0,y:0,touched:false};
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
    moveCircle(circleSpeedX, circleSpeedY);
    // Call main again
    // main();
    // }, timeInterval)
    requestAnimationFrame(main);
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
            var blockX = (i*(blockRows+blockGap))+ blockOffsetLeft;
            var blockY = (j*(blockColumns+blockGap))+ blockOffsetTop;
            if (blocks[i][j].touched === false) {
                blocks[i][j].x = blockX;
                blocks[i][j].y = blockY;
                context.beginPath();
                context.rect(blockX, blockY, blockWidth, blockHeight);
                context.fillStyle = GREEN;
                context.fill();
                context.closePath();
            }
        }
    }
}

// Regroup all the drawing functions under this one
function drawAllGameElements() {
    drawAllBlocks();
    drawRect(playerXpos,initialPlayerYpos,WIDTH_PLAYER,HEIGHT_PLAYER);
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
    
    if (playerXpos < circleXPos + circleRadius &&
        playerXpos + WIDTH_PLAYER > circleXPos &&
        initialPlayerYpos < circleYPos + circleRadius &&
        HEIGHT_PLAYER + initialPlayerYpos > circleYPos && playerCollision === true){
            circleSpeedY = -circleSpeedY;
            circleSpeedX = -circleSpeedX;
            playerCollision = false;
            console.log(0);
        }
        else if (playerXpos < circleXPos + circleRadius &&
        playerXpos + WIDTH_PLAYER > circleXPos &&
        initialPlayerYpos < circleYPos + circleRadius &&
        HEIGHT_PLAYER + initialPlayerYpos > circleYPos && playerCollision === false){
            circleSpeedY = -circleSpeedY;
            circleSpeedX = circleSpeedX;
            playerCollision = true;
            console.log("touché");
        }
    }
    
// Check if the ball hit on of the blocks
function checkBlockCollision() {
    for (var c = 0; c < blockColumns; c++){
        for (var r = 0; r < blockRows; r++){
            if (blocks[c][r].touched === false) {
                if (circleXPos > blocks[c][r].x && circleXPos < blocks[c][r].x + blockWidth && circleYPos > blocks[c][r].y && circleYPos < blocks[c][r].y + blockHeight) {
                    circleSpeedX = - circleSpeedX;
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
function movePlayer(speed) {
    playerXpos = playerXpos - speed;
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
            else {
                playerXpos = 0;
                WIDTH_PLAYER = canvas.width;
                // let data_display = document.querySelector(".data_display");
                // data_content = document.createTextNode(blocks[11][6].x);
                // data_display.appendChild(data_content);
            }
            break;

    // Keyboard keys for changing the direction of the player
        //Left arrow
        case 37:
            movePlayer(30);
            if (playerXpos < 0) {
                playerXpos = 0;
            }
            else {
                movePlayer(0);
            }
            break;
        //Right arrow
        case 39:
            movePlayer(-30);
            if (playerXpos +  WIDTH_PLAYER > canvas.width) {
                playerXpos = canvas.width - WIDTH_PLAYER;
            }
            break;
    }
};

// Launch the game
menu()
