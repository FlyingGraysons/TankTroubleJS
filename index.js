// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

// Serve folder
app.use(express.static(__dirname + '/public'));

// Listening function
server.listen(port, function () {
	console.log('Server listening at port %d', port);
});

//Server side

const FRAMES_PER_SECOND = 30;

const TANK_LENGTH = 75;
const TANK_WIDTH = 50;

//Unit: pixels/second
const TANK_FORWARD_SPEED = 5;
const TANK_BACKWARD_SPEED = (2/3) * TANK_FORWARD_SPEED;
const TANK_ROTATION_SPEED = Math.PI * .1;
const BULLET_SPEED = 5;

var walls = [];
var tanks = [];

function updateFrame(isUpPressed, isDownPressed, isLeftPressed, isRightPressed) { //Updates the frame, getting the arguments from the sockets
	//Each argument should be an array of booleans, one for each tank
	for (tankIter = 0; tankIter < tanks.length; tankIter++) {
		if (isUpPressed[tankIter]) {
			tanks[tankIter].xPos += (Math.cos(tanks[tankIter].rotation) * TANK_FORWARD_SPEED);
			tanks[tankIter].yPos += (Math.sin(tanks[tankIter].rotation) * TANK_FORWARD_SPEED);
		}
		if (isDownPressed[tankIter]) {
			tanks[tankIter].xPos -= (Math.cos(tanks[tankIter].rotation) * TANK_BACKWARD_SPEED);
			tanks[tankIter].yPos -= (Math.sin(tanks[tankIter].rotation) * TANK_BACKWARD_SPEED);
		}
		if (isLeftPressed[tankIter]) {
			tanks[tankIter].rotate(true);
		}
		if (isRightPressed[tankIter]) {
			tanks[tankIter].rotate(false);
		}
	}
}

function makeTank(startX, startY, startRotation) { //Create a tank, and then push it into the tank array
	var tank = {
		xPos:startX,
		yPos:startY,
		rotation:startRotation,
		bullets:[],
		rotate:function(rotateLeft) { //rotateLeft is a boolean. If it's true, then the tank will rotate left, otherwise right
			rotation += (rotateLeft ? TANK_ROTATION_SPEED : -TANK_ROTATION_SPEED)
		},
		makeBullet:function() {
			var bullet = {
				xPos:tank.xPos, // TO DO: Make it the front of the tank, not the middle, where bullets come from
				yPos:tank.yPos,
				rotation:tank.rotation,
			}
			bullets.push(bullet);
		},
	}
	tanks.push(tank);
}

window.setInterval(function(){updateFrame();}, FRAMES_PER_SECOND);
