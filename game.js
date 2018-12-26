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

// Declaration of the width and height of the player
const HEIGHT_PLAYER = 10;
const WIDTH_PLAYER = canvas.width/2;

// Declaration of the coordinates and the speed of the player
let initialPlayerYpos = 400;
let playerXpos = 240;
let playerSpeed = -30;
let playerCollision = true;

// Declaration of the coordinates and the speed of the ball
let circleXPos = 200;
let circleYPos = 275;
let circleRadius = 10;
let circleSpeedX = 25;
let circleSpeedY = 25;

// Declaration of the variables of the blocks
let numberBlockCollision = 3;
let blockWidth = 60;
let blockHeight = 20;
let firstBlockCoordX = LEFT;
let firstBlockCoordY = TOP + 10;
let allBlocks = [
                    [{x:75*0,y:22.91*1},{x:75*0,y:22.91*2},{x:75*0,y:22.91*3}],
                    [{x:75*1,y:22.91*1},{x:75*1,y:22.91*2},{x:75*1,y:22.91*3}],
                    [{x:75*2,y:22.91*1},{x:75*2,y:22.91*2},{x:75*2,y:22.91*3}],
                    [{x:75*3,y:22.91*1},{x:75*3,y:22.91*2},{x:75*3,y:22.91*3}],
                    [{x:75*4,y:22.91*1},{x:75*4,y:22.91*2},{x:75*4,y:22.91*3}],
                    [{x:75*5,y:22.91*1},{x:75*5,y:22.91*2},{x:75*5,y:22.91*3}],
                    [{x:75*6,y:22.91*1},{x:75*6,y:22.91*2},{x:75*6,y:22.91*3}],
                    [{x:75*7,y:22.91*1},{x:75*7,y:22.91*2},{x:75*7,y:22.91*3}],
                ];

// Main Game loop, with an interval of time implemented with a setTimeout function
function main() {
    startingCount = 0;
	setTimeout(function onTick(timeInterval) {
    clearCanvas(LEFT,TOP,canvas.width,canvas.height);
    drawAllGameElements();
    checkAllCollision();
    moveCircle(circleSpeedX, circleSpeedY);
    // Call main again
    main();
    }, timeInterval)
  }

// Display the menu on the canvas, pressing X will start the game
function menu() {
    setColors(BLACK,WHITE);
    drawRect(LEFT,TOP,canvas.width,canvas.height);
    drawRect(canvas.width/4, canvas.height/5, 350,200);
    write('Press X','for starting Breakout');
}

// Function used for writing messages on the screen menu
function write(text1,text2) {
    if( typeof(text2) == 'undefined' ){
		text2 = null;
	}
    context.font = '40px serif';
    setColors(BLACK, BLACK);
    context.fillText(text1, canvas.width/4, canvas.height/2);
    context.font = '30px serif';
    context.fillText(text2, canvas.width/4, canvas.height/1.6);
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
    // Draw all the blocks, vertically first and then horizontally
    for (var x = 0; x < allBlocks.length; x++){
        for (var y = 0; y < allBlocks[0].length; y++){
            // Check how often the block has collide with the ball 
            // and change the drawing colors accordingly, then draw the block
            switch (numberBlockCollision) {
                case 3:
                    setColors(BLACK,GREEN);
                    drawRect(allBlocks[x][y].x,allBlocks[x][y].y,blockWidth,blockHeight);
                    break;
                default:
                    setColors(BLACK,BLACK);
                    drawRect(allBlocks[x][y].x,allBlocks[x][y].y,blockWidth,blockHeight);
                    break;
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
    if (circleXPos === 0) {
        circleSpeedX = -circleSpeedX;
    }
    if (circleXPos === canvas.width) {
        circleSpeedX = -circleSpeedX;
    }
    if (circleYPos < 0) {
        circleSpeedY = 5;
    }
    if (circleYPos > canvas.height) {
        circleSpeedY = -5;
    }
}

// Check if the ball hit the cursor
function checkPlayerCollision() {
    if (playerXpos < circleXPos + circleRadius &&
        playerXpos + WIDTH_PLAYER > circleXPos &&
        initialPlayerYpos < circleYPos + circleRadius &&
        HEIGHT_PLAYER + initialPlayerYpos > circleYPos && playerCollision === true){
            circleSpeedY = -5;
            circleSpeedX = -5;
            playerCollision = false;
        }
        else if (playerXpos < circleXPos + circleRadius &&
        playerXpos + WIDTH_PLAYER > circleXPos &&
        initialPlayerYpos < circleYPos + circleRadius &&
        HEIGHT_PLAYER + initialPlayerYpos > circleYPos && playerCollision === false){
            circleSpeedY = -5;
            circleSpeedX = 5;
            playerCollision = true;
        }
    }
    
// Check if the ball hit on of the blocks
function checkBlockCollision() {
    for (var x = 0; x < allBlocks.length; x++){
        for (var y = 0; y < allBlocks[x].length; y++){
            if (allBlocks[x][y].x < circleXPos + circleRadius &&
            allBlocks[x][y].x + blockWidth > circleXPos &&
            allBlocks[x][y].y < circleYPos + circleRadius &&
            blockHeight + y > circleYPos && numberBlockCollision > 0){
                circleSpeedY = 10;
                circleSpeedX = 5;
                allBlocks[x][y].y = -30;
                allBlocks[x][y].x = -300;
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

// Creating keyboard events with the Char codes of the keyboard
document.onkeydown = function(e) {
    switch (e.keyCode) {
        // Pressing X for starting the game
        case 88:
            // Check if the game is  not already started before starting it
            if (startingCount === 1) {
            clearCanvas(TOP, LEFT,canvas.width,canvas.height);
            main();
            }
            break;
        // Pressing L
        case 76:
            console.log(allBlocks);
            break;
        // Pressing S
        case 83:
            numberBlockCollision -= 1;
            break;

    // Keyboard keys for changing the direction of the player

        //Left arrow
        case 37:
            if (playerXpos > 0) {
            movePlayer(165);
            }
            else {
                movePlayer(0);
            }
            break;
        //Up arrow
        case 38:
            break;
        //Right arrow
        case 39:
            if (playerXpos <= canvas.width - WIDTH_PLAYER) {
            movePlayer(-165);
            }
            else {
                movePlayer(0);
            }
            break;
        //Down arrow
        case 40:
    }
};

// Launch the game
main()
