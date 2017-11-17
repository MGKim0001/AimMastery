//global variable
var canvas;
var canvasContext;
	
var ballX = 50;
var ballY = 50;
    
var ballSpeedX = 10;
var ballSpeedY = 4;
	
var cursorX = 50;
var cursorY = 50;
	
var BALL_SIZE = 20;
var CURSOR_SIZE = 25;
	
var score = 0;
	
function calculateMousePos(evt){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}
	
window.onload = function(){
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
        
    var fps = 30;
		
    setInterval(function(){    
		moveEverything();
		canvas.addEventListener("click",collsionDetect);
        drawEverything();
    },1000/fps);
		
	canvas.addEventListener('mousemove',
		function(evt){
			var mousePos = calculateMousePos(evt);
            cursorX = mousePos.x - (CURSOR_SIZE/2);
			cursorY = mousePos.y - (CURSOR_SIZE/2);
		});
}
	
function reset(){
	ballX = Math.floor(Math.random()*1280)+1;
    ballY = Math.floor(Math.random()*720)+1;
}
	
function collsionDetect(){
	var dx = ballX - cursorX;
	var dy = ballY - cursorY;
	var distance = Math.sqrt(dx*dx + dy*dy);
		
	if(distance < BALL_SIZE+CURSOR_SIZE){
		score++;
		reset();
	}
}
	
function moveEverything(){
	//move target randomly
	ballX = ballX + ballSpeedX;
	ballY = ballY + ballSpeedY;
		
    //bounce on the right wall
    if(ballX > canvas.width){
        ballSpeedX = -ballSpeedX;
    }
    //bounce on the left wall
    if(ballX < 0){    
        ballSpeedX = -ballSpeedX;
    }
    //bounce on the top wall
    if(ballY < 0){
        ballSpeedY = -ballSpeedY;
    }
    //bounce on the bottom wall
    if(ballY > canvas.height){
        ballSpeedY = -ballSpeedY;
    }
		
	console.log(ballX);
	console.log(ballY);
}
	
function drawEverything(){
    //canvas
	var img = new Image(1280,720);
	img.src = "../image/dust2.jpg";
	canvasContext.drawImage(img,0,0);
		
	//ball
    colorCircle(ballX,ballY,BALL_SIZE,'red');
		
	//mouse cursor
	colorCircle(cursorX,cursorY,CURSOR_SIZE,'blue');
		
	//print out score
	printScore();
}
	
function colorCircle(centerX,centerY,radius,drawColor){
    canvasContext.fillStyle=drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}
    
function printScore(){
	canvasContext.font="30px fantasy";
	const msg = "score: " + score;
	canvasContext.fillText(msg,100,100);
}