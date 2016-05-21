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

Array.prototype.clean = function(deleteValue) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == deleteValue) {
			this.splice(i, 1);
			i--;
		}
	}
	return this;
};

function updateFrame(){
	//Each argument should be an array of booleans, one for each tank
	if(stage == "LOBBY"){ //game hasn't started yet

	}else if(stage == "GAME"){
		for (tankIter = 0; tankIter < tanks.length; tankIter++) {
			if (tanks[tankIter].isUpPressed) {
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

			if (isSpacePressed[tankIter]) {
				if (tanks[tankIter].bullets.length < 5)
					tanks[tankIter].makeBullet)()
			}
			for (var i = 0; i < tanks[tankIter].bullets.length; i++) {
				tanks[tankIter].bullets[i].time++
				if (tanks[tankIter].bullets[i].time > FRAMES_PER_SECOND*4) {
					delete tanks[tankIter].bullets[i];
					continue;
				}
				tanks[tankIter].bullets[i].xPos += (Math.cos(tanks[tankIter].bullets[i]rotation) * BULLET_SPEED);
				tanks[tankIter].bullets[i].yPos += (Math.sin(tanks[tankIter].bullets[i]rotation) * BULLET_SPEED);
				for (var j = 0; j < tanks.length; j++) {
					if ( (typeof tanks[j] !== "undefined") && (tanks[j].xPos == tanks[tankIter].bullets[i].xPos) && (tanks[j].yPos == tanks[tankIter].bullets[i].yPos))
						delete tanks[j];
				}
			}
			tanks[tankIter].bullets.clean(undefined)
		}
		tanks.clean(undefined)
	}

	var game_data = [stage, walls, tanks];
	io.sockets.emit('all_data', game_data);
}

function makeTank(startX, startY, startRotation, mySocketId) { //Create a tank, and then push it into the tank array
	var tank = {
		xPos:startX,
		yPos:startY,
		rotation:startRotation,
		socketid:mySocketId,
		bullets:[],
		keypresses:{},
		rotate:function(rotateLeft) { //rotateLeft is a boolean. If it's true, then the tank will rotate left, otherwise right
			rotation += (rotateLeft ? TANK_ROTATION_SPEED : -TANK_ROTATION_SPEED)
		},
		makeBullet:function() {
			var bullet = {
				xPos:tank.xPos, // TO DO: Make it the front of the tank, not the middle, where bullets come from
				yPos:tank.yPos,
				rotation:tank.rotation,
				time: 0;
			}
			this.bullets.push(bullet);
		},
	}
	tanks.push(tank);
}

io.on('connection', function(socket){

});

window.setInterval(function(){updateFrame();}, FRAMES_PER_SECOND);
