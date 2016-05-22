// Setup basic express server
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;

// Serve folder
app.use(express.static(__dirname + '/public'));

// Listening function
http.listen(port, function () {
	console.log('Server listening at port %d', port);
});


const FRAMES_PER_SECOND = 30;

const TANK_LENGTH = 75;
const TANK_WIDTH = 50;

//Unit: pixels/second
const TANK_FORWARD_SPEED = 5;
const TANK_BACKWARD_SPEED = (2/3) * TANK_FORWARD_SPEED;
const TANK_ROTATION_SPEED = Math.PI * -.01;
const BULLET_SPEED = 5;

var walls = [];
var tanks = [];
var stage = "LOBBY";

Array.prototype.clean = function(deleteValue) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == deleteValue) {
			this.splice(i, 1);
			i--;
		}
	}
	return this;
};

/*function checkCollision(tank, bullet) {
	currentBullet = ...;
}

function goThroughForCollisions() {
	for (tankIter1 = 0; tankIter1 < tanks.length; tankIter1++) {
		var currentTank = tanks[tankIter1];
		for (tankIter2 = 0; tankIter2 < tanks.length; tankIter2++) {
			for (bulletIter = 0; bulletIter < tanks.length; bulletIter++) {
				var currentBullet = tanks[tankIter2].bullets[bulletIter];

			}
		}
	}
}*/

function updateFrame(){
	//Each argument should be an array of booleans, one for each tank
	if(stage == "LOBBY"){ //game hasn't started yet

	}else if(stage == "GAME"){
		for (tankIter = 0; tankIter < tanks.length; tankIter++) {
			if(typeof tanks[tankIter] !== 'undefined'){
				// console.log("Tank " + tankIter + "'s xPos: " + tanks[tankIter].xPos + " and yPos: " + tanks[tankIter].yPos);
				// console.log(tanks[tankIter].keypresses);
				if (tanks[tankIter].keypresses.isUpPressed) {
					tanks[tankIter].xPos += (Math.cos(tanks[tankIter].rotation) * TANK_FORWARD_SPEED);
					tanks[tankIter].yPos += (Math.sin(tanks[tankIter].rotation) * TANK_FORWARD_SPEED);
				}
				if (tanks[tankIter].keypresses.isDownPressed) {
					tanks[tankIter].xPos -= (Math.cos(tanks[tankIter].rotation) * TANK_BACKWARD_SPEED);
					tanks[tankIter].yPos -= (Math.sin(tanks[tankIter].rotation) * TANK_BACKWARD_SPEED);
				}
				if (tanks[tankIter].keypresses.isLeftPressed) {
					tanks[tankIter].rotate(true);
				}
				if (tanks[tankIter].keypresses.isRightPressed) {
					tanks[tankIter].rotate(false);
				}
				if (tanks[tankIter].keypresses.isSpacePressed) {
					if (tanks[tankIter].bullets.length < 5) tanks[tankIter].makeBullet();
				}
				for (var i = 0; i < tanks[tankIter].bullets.length; i++) {
					tanks[tankIter].bullets[i].time++
					if (tanks[tankIter].bullets[i].time > FRAMES_PER_SECOND*4) {
						delete tanks[tankIter].bullets[i];
					} else {
						tanks[tankIter].bullets[i].xPos += (Math.cos(tanks[tankIter].bullets[i].rotation) * BULLET_SPEED);
						tanks[tankIter].bullets[i].yPos += (Math.sin(tanks[tankIter].bullets[i].rotation) * BULLET_SPEED);
						for (var j = 0; j < tanks.length; j++) {
							if ((typeof tanks[j] !== "undefined") && (tanks[j].xPos == tanks[tankIter].bullets[i].xPos) && (tanks[j].yPos == tanks[tankIter].bullets[i].yPos))
								delete tanks[j];
						}
					}
				}
				tanks[tankIter].bullets.clean(undefined);

			}
		}
		tanks.clean(undefined);
	}

	var game_data = {
		tanks: tanks,
		walls: walls,
		stage: stage
	};
	io.sockets.emit('all_data', game_data);
}

function makeTank(startX, startY, startRotation, mySocketId) { //Create a tank, and then push it into the tank array
	var tank = {
		xPos:startX,
		yPos:startY,
		rotation:startRotation,
		socket_id:mySocketId,
		bullets:[],
		keypresses:{isLeftPressed:false, isRightPressed:false, isDownPressed:false, isUpPressed:false},
		rotate:function(rotateLeft) { //rotateLeft is a boolean. If it's true, then the tank will rotate left, otherwise right
			this.rotation += (rotateLeft ? TANK_ROTATION_SPEED : -TANK_ROTATION_SPEED)
		},
		makeBullet: function() {
			var bullet = {
				xPos:tank.xPos, // TO DO: Make it the front of the tank, not the middle, where bullets come from
				yPos:tank.yPos,
				rotation:tank.rotation,
				time: 0
			}
			this.bullets.push(bullet);
		}
	}
	tanks.push(tank);
}

function getTankById(current_socket_id){
	for(var i = 0; i < tanks.length; i++){
		if(typeof tanks[i] !== 'undefined'){
			if(tanks[i].socket_id === current_socket_id){
				return i;
			}
		}
	}
	throw "This person: '" + current_socket_id + "' does not have a tank"
}

io.on('connection', function(socket){
	var current_socket_id = socket.id;
	console.log("connected: " + current_socket_id);
	makeTank(0, 0, 0, current_socket_id); // for testing purposes

	socket.on('disconnect', function(){
		console.log("disconnected: " + current_socket_id);
		delete tanks[getTankById(current_socket_id)];
	});

	socket.on('register_form', function(data){
		if(stage === "LOBBY"){
			console.log("registered: " + current_socket_id);
			// makeTank(0, 0, 0, current_socket_id);
			stage = "GAME";
		}
	});

	socket.on('user_input_state', function(data){
		if(stage === "GAME"){
			try {
				var index = getTankById(current_socket_id)
				tanks[index].keypresses.isRightPressed = data[0];
				tanks[index].keypresses.isLeftPressed = data[1];
				tanks[index].keypresses.isUpPressed = data[2];
				tanks[index].keypresses.isDownPressed = data[3];
				tanks[index].keypresses.isSpacePressed = data[4];
				// console.log(data);
			} catch (e) {
				console.log(e);
			}

		}
	});

});

setInterval(function(){updateFrame();}, 1000/FRAMES_PER_SECOND);
