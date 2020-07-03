// Colors constants declaration

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

let lives = 3;

// Create the canvas window, where the game will be played.
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let startingCount = 1;
let timeInterval = 10;

// Create game state variables
let game_over = false;
let game_is_paused = false;
let restart = false;
let score = 0;

// Declaration of the width and height of the player
const HEIGHT_PLAYER = canvas.height/40;
const WIDTH_PLAYER = canvas.width/5;

// Declaration of the coordinates and the speed of the player
const initialPlayerYpos = 550;
let playerYPos = initialPlayerYpos;
const initialPlayerXpos = 240;
let playerXPos = initialPlayerXpos;
let playerSpeed = -20;
let playerCollision = true;
let playerCenter = playerXPos + WIDTH_PLAYER/2;
let playerLeft = playerCenter - 50;
let playerRight = playerCenter +50;
let speed = 10;

let arrowLeft = false;
let arrowRight = false;

// Declaration of the coordinates and the speed of the ball
let circleXPos = initialPlayerXpos;
let circleYPos = initialPlayerYpos;
let circleRadius = 8;
let circleSpeedX = 4;
let circleSpeedY = 4;
let circleSpeed = 4;

let actualCircleSpeedX = circleSpeedX;
let actualCircleSpeedY = circleSpeedY;

// Declaration of the variables of the blocks
let blockColumns = 17;
let blockRows = 6
let blockGap = 30
let blockWidth = 30;
let blockHeight = 20;
let blockOffsetTop = 50;
let blockOffsetLeft = 0;

let blocks = [];
let nb_blocks = blockRows* blockColumns;
let interval = 1;
// Main Game loop, with an interval of time implemented with a setTimeout function
function main() {
    startingCount = 0;
    clearCanvas(LEFT,TOP,canvas.width,canvas.height);
    drawAllGameElements();
    checkAllCollision();
    movePlayer();
    moveCircle(circleSpeedX, circleSpeedY);
    display_game_informations();
    pausing_game();
    if (!game_over) {
    	requestAnimationFrame(main);
    	}
    reset_game();
  }

function pausing_game() {
    if (game_is_paused == true) {
        write("PAUSE",60,canvas.width/3,canvas.height/2);
    }
}
function reset_game() {
    if (game_over) {
        if (restart) {
                document.location.reload();
                clearInterval(interval);
        }
    }
}

function sound(src) {
// how to play sound
// var music;
// music = new sound("/static/sound/music.mp3");
// music.play();
// music.stop();
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

// Creating the coordinates of the blocks and putting them in a 2D array
function create_blocks() {
    for (let i = 0;i<blockColumns;i++) {
        blocks[i] = [];
        for (let j = 0;j< blockRows;j++) {
            blocks[i][j] = {x:0,y:0,touched:false,color:COLORS[0]};
        }
    }
}

// Display the menu on the canvas, pressing X will start the game
function menu() {
    setColors(BLACK,WHITE);
    drawRect(LEFT,TOP,canvas.width,canvas.height);
    drawRect(canvas.width/4, canvas.height/5, 350,200);
    write('Press Space or Enter',30,canvas.width/3,canvas.height/2);
    write('to start the game',30,canvas.width/2, canvas.height/1.6);
}

// Function used for writing messages on the screen menu
function write(text,font_size,x,y) {
    context.font = font_size.toString(10)+'px serif';
    setColors(BLACK, BLACK);
    context.fillText(text, x, y);
}

function display_game_informations() {
    write('Score  : '+ score.toString(10),20,canvas.width - 100,canvas.height/15);
    write('Lives  : '+ lives,20,canvas.width - canvas.width+10 ,canvas.height/15);
    write('Pause  : Space or Enter ',20,canvas.width - canvas.width+160 ,canvas.height/15);
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

// Check if the ball hit a wall
function checkWallCollision() {
    // Si la balle touche le bord gauche
    if (circleXPos < 0) {
        circleXPos = 0
        circleSpeedX = -circleSpeedX;
        actualCircleSpeedX = circleSpeedX;
        actualCircleSpeedY = circleSpeedY;
    }
    // Si la balle touche le bord droit
    if (circleXPos - circleRadius > canvas.width) {
        circleXPos = canvas.width - circleRadius;
        circleSpeedX = -circleSpeedX;
        actualCircleSpeedX = circleSpeedX;
        actualCircleSpeedY = circleSpeedY;
    }
    // Si la balle touche le bord haut
    if (circleYPos < 0) {
        circleYPos = 0;
        circleSpeedY = - circleSpeedY;
        actualCircleSpeedX = circleSpeedX;
        actualCircleSpeedY = circleSpeedY;
    }
    // Si la balle touche le bord bas
    if (circleYPos > canvas.height - circleRadius) {
        game_over = true;
        restart = true;
    }
}

// Check if the ball hit the cursor
function checkPlayerCollision() {
    
    if (circleYPos > initialPlayerYpos && circleYPos < initialPlayerYpos + HEIGHT_PLAYER && circleXPos >
    playerXPos && circleXPos < playerXPos + WIDTH_PLAYER){
    
    let collidePoint = circleXPos - (playerXPos + WIDTH_PLAYER/2);
    collidePoint = collidePoint / (WIDTH_PLAYER/2);
    let angle = collidePoint * (Math.PI/3);
    circleSpeedX = circleSpeed * Math.sin(angle);
    circleSpeedY = - circleSpeed * Math.cos(angle);
    actualCircleSpeedX = circleSpeedX;
    actualCircleSpeedY = circleSpeedY;
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
                    actualCircleSpeedX = circleSpeedX;
                    actualCircleSpeedY = circleSpeedY;
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

// Regroup all the collisions functions under this one
function checkAllCollision() {
    checkWallCollision();
    checkBlockCollision();
    checkPlayerCollision();
}

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

document.getElementById("canvas").addEventListener("click", function( event ) {
    main();
  }, {once : true});

// Creating keyboard events with the Char codes of the keyboard
document.onkeydown = function(e) {
    switch (e.keyCode) {
        // Pressing X for resetting the game
        case 88:
            if (game_over == true) {
                document.location.reload();
                clearInterval(interval);
            }
            break;

    // Keyboard keys for changing the direction of the player
        //Left arrow
        case 37:
            if (game_is_paused === false) {
                arrowLeft = true;
            }

            if (playerXPos < 0) {
                playerXPos = 0;
            }
            break;
        //Right arrow
        case 39:
            if (game_is_paused === false) {
                arrowRight = true;
            }
            if (playerXPos +  WIDTH_PLAYER > canvas.width) {
                playerXPos = canvas.width - WIDTH_PLAYER;
            }
            break;
    }
};

document.onkeyup = function(e) {
    switch (e.keyCode) {
        // Press Enter for starting the game

        case 13:
            // If the game has not started, launch it
            if (startingCount != 0 && game_over == false) {
                main();
            }
            // If the game started and isn't stopped, stop it
            else if (startingCount === 0 && game_is_paused == false && game_over == false) {
                    circleSpeedX = 0;
                    circleSpeedY = 0;
                    game_is_paused = true;

            }
            else if (startingCount === 0 && game_is_paused == true && game_over == false){
                circleSpeedY = actualCircleSpeedY;
                circleSpeedX = actualCircleSpeedX;
                game_is_paused = false;
            }

            else if (game_over == false) {
             restart = true;
            }
            break;
        // Press Space for starting the game
        case 32:
             // If the game has not started, launch it
            if (startingCount != 0) {
                main();
            }
            // If the game started and isn't stopped, stop it
            else if (startingCount === 0 && game_is_paused == false) {
                    circleSpeedX = 0;
                    circleSpeedY = 0;
                    game_is_paused = true;

            }
            else if (startingCount === 0 && game_is_paused == true){
                circleSpeedY = actualCircleSpeedY;
                circleSpeedX = actualCircleSpeedX;
                game_is_paused = false;
            }
            break;
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
create_blocks();
main();
