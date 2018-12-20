// Colors constantes declaration
const TOP = 0;
const LEFT = 0;
const BLACK = "#000000";
const WHITE = "#FFFFFF";
const RED = "#FF0000";
const DARKRED = "#AA0000";
const GREEN = "#00FF00";
const BLUE = "#0000FF";

// Declaration of the width and height of the player
const HEIGHT_PLAYER = 10;
const WIDTH_PLAYER = 190;

// Create the canvas window, where the game will be played.
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let startingCount = 1;
let timeInterval = 10;

// Declaration of the coordinates and the speed of the player
let initialPlayerYpos = 400;
let playerXpos = 240;
let playerSpeed = -30;

// Declaration of the coordinates and the speed of the ball
let circleXPos = 100;
let circleYPos = 75;
let circleRadius = 10;
let circleSpeedX = 5;
let circleSpeedY = 5;

let numberBlockCollision = 3;
let blockWidth = 60;
let blockHeight = 20;

// Declaration of blocks
let block = [
    [
    {x: canvas.width/2.25, y: 50},
    {x: canvas.width/2.25, y: 70},
    {x: canvas.width/2.25, y: 90},
    {x: canvas.width/2.25, y: 110},
    {x: canvas.width/2.25, y: 130},
    {x: canvas.width/2.25, y: 150},
    ],
    [
    {x: canvas.width/1.85, y: 50},
    {x: canvas.width/1.85, y: 70},
    {x: canvas.width/1.85, y: 90},
    {x: canvas.width/1.85, y: 110},
    {x: canvas.width/1.85, y: 130},
    {x: canvas.width/1.85, y: 150},
    ],
    [
    {x: canvas.width/1.56, y: 50},
    {x: canvas.width/1.56, y: 70},
    {x: canvas.width/1.56, y: 90},
    {x: canvas.width/1.56, y: 110},
    {x: canvas.width/1.56, y: 130},
    {x: canvas.width/1.56, y: 150},
    ],
    [
    {x: canvas.width/1.35, y: 50},
    {x: canvas.width/1.35, y: 70},
    {x: canvas.width/1.35, y: 90},
    {x: canvas.width/1.35, y: 110},
    {x: canvas.width/1.35, y: 130},
    {x: canvas.width/1.35, y: 150},
    ],
    [
    {x: canvas.width/1.19, y: 50},
    {x: canvas.width/1.19, y: 70},
    {x: canvas.width/1.19, y: 90},
    {x: canvas.width/1.19, y: 110},
    {x: canvas.width/1.19, y: 130},
    {x: canvas.width/1.19, y: 150},
    ],
    [
    {x: canvas.width/2.90, y: 50},
    {x: canvas.width/2.90, y: 70},
    {x: canvas.width/2.90, y: 90},
    {x: canvas.width/2.90, y: 110},
    {x: canvas.width/2.90, y: 130},
    {x: canvas.width/2.90, y: 150},
    ],
    [
    {x: canvas.width/4.09, y: 50},
    {x: canvas.width/4.09, y: 70},
    {x: canvas.width/4.09, y: 90},
    {x: canvas.width/4.09, y: 110},
    {x: canvas.width/4.09, y: 130},
    {x: canvas.width/4.09, y: 150},
    ]
];

// Main Game loop, with an interval of time implemented with a setTimeout function
function main() {
	setTimeout(function onTick(timeInterval) {
    //Drawing the canvas window
    clearCanvas(LEFT,TOP,canvas.width,canvas.height);
    checkAllCollision();
    changeBlockColors();
    drawAllBlock();
    startingCount = 0;
    drawRect(playerXpos,initialPlayerYpos,WIDTH_PLAYER,HEIGHT_PLAYER);
    drawCircle(circleXPos,circleYPos,circleRadius,0,2*Math.PI);
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
function drawRect(coordX,coordY,width,height){
    // fillRect() draw a full rectangle and strokeRect() draw a border
    context.fillRect(coordX,coordY,width,height);
    context.strokeRect(coordX,coordY,width,height);
    }

function drawCircle(xPos,yPos,radius,startingAngle,endingAngle) {
    setColors(BLUE,BLUE);
    context.beginPath();
    context.arc(xPos,yPos,radius,startingAngle,endingAngle);
    context.fill();
}

function drawSingleBlock(singleBlock) {
    setColors(BLACK,GREEN);
    // Do the coloring every 20 pixels
    drawRect(singleBlock.x, singleBlock.y, blockWidth, blockHeight)
    }

function drawAllBlock() {
    let i = 0;
    while (i < 7) {
    block[i].forEach(drawSingleBlock);
    i+=1;
    }
}
////////// END DRAWING FUNCTIONS  //////////

////////// COLLISION FUNCTIONS  //////////
function checkAllCollision() {
    checkWallCollision();
    checkBlockCollision();
    checkPlayerCollision();
}

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

function checkPlayerCollision() {
    if (playerXpos < circleXPos + circleRadius &&
        playerXpos + WIDTH_PLAYER > circleXPos &&
        initialPlayerYpos < circleYPos + circleRadius &&
        HEIGHT_PLAYER + initialPlayerYpos > circleYPos){
            circleSpeedY = 10;
            circleSpeedX = 5;
        }
    }

function checkBlockCollision() {

    for (let y = 0; y < 7; y++) {
        if (block[y].x < circleXPos + circleRadius &&
        block[y].x + blockWidth > circleXPos &&
        block[y].y < circleYPos + circleRadius &&
        blockHeight + block[y].y > circleYPos){
            circleSpeedY = 10;
            circleSpeedX = 5;
            numberBlockCollision -= 1;
            console.log(numberBlockCollision);
            }
        }
    }
////////// END COLLISION FUNCTIONS  //////////

function movePlayer(speed) {
    playerXpos = playerXpos - speed;
}

function moveCircle(speedX, speedY) {
    circleXPos += speedX;
    circleYPos += speedY;
}

function changeBlockColors() {
    if (numberBlockCollision === 3) {
        setColors(BLACK,GREEN);
    }
    else if (numberBlockCollision === 2) {
        setColors(BLACK,RED);
    }
    else if (numberBlockCollision === 1) {
        setColors(BLACK,DARKRED)
    }
    else if (numberBlockCollision <= 0) {
        setColors(WHITE,WHITE)
    }
}

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
            break;
        // Pressing S
        case 83:
            numberBlockCollision -= 1;
            break;

    // Keyboard keys for changing the direction of the snake

        //Left arrow
        case 37:
            movePlayer(35);
            break;
        //Up arrow
        case 38:
            break;
        //Right arrow
        case 39:
            movePlayer(-35);
            break;
        //Down arrow
        case 40:
    }
};

// Main game loop
main()
