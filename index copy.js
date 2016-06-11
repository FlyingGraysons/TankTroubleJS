const FRAMES_PER_SECOND = 30;

const TANK_LENGTH = 75;
const TANK_WIDTH = 50;

//Unit: pixels/second
const TANK_FORWARD_SPEED = 5;
const TANK_BACKWARD_SPEED = (2/3) * TANK_FORWARD_SPEED;
const TANK_ROTATION_SPEED = 5;
const BULLET_SPEED = 5;

var walls = [];
var tanks = [];

function updateFrame (isUpPressed, isDownPressed, isLeftPressed, isRightPressed) {
	for (tankIt = 0; tankIt < tanks.length; tankIt++) {
		if (isUpPressed) {
			tanks[tankIt].xPos += (Math.cos(tanks[tankIt].rotation) * TANK_FORWARD_SPEED);
			tanks[tankIt].yPos += (Math.sin(tanks[tankIt].rotation) * TANK_FORWARD_SPEED);
		}
		if (isDownPressed) {
			tanks[tankIt].xPos -= (Math.cos(tanks[tankIt].rotation) * TANK_BACKWARD_SPEED);
			tanks[tankIt].yPos -= (Math.sin(tanks[tankIt].rotation) * TANK_BACKWARD_SPEED);
		}
	}
}

function makeTank (startX, startY, startRotation) {
	var tank = {
		var xPos = startX;
		var yPos = startY;
		var rotation = startRotation;
		var bullets = [];
	}
	tanks.push(tank);
}

function makeBullet (tank) {
	var bullet = {
		var xPos = tank.xPos; //Make it the front of the tank, not the middle, where bullets come from
		var yPos = tank.yPos;
		var rotation;
	}
}