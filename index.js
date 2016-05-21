const FRAMES_PER_SECOND = 30;

const TANK_LENGTH = 75;
const TANK_WIDTH = 50;

const TANK_SPEED = 5; //Unit: pixels/second
const BULLET_SPEED = 5; //Unit: pixels/second

var walls = [];
var tanks = [];

function updateFrame {
	for (tankIt = 0; tankIt < tanks.length; tankIt++) {

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