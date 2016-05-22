var socket = io();

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var tankWidth = 50; // placeholder until image loads
var tankHeight = 50; // placeholder until image loads
var ready = 'b';
const radius = 5;

var rightkeydown = false;
var leftkeydown = false;
var upkeydown = false;
var downkeydown = false;
var spacekeydown = false;

function sendData(){
	var data = [rightkeydown, leftkeydown, upkeydown, downkeydown, spacekeydown];
	socket.emit('user_input_state', data);
	console.log("trying to send user input");
}

window.onkeydown = function(e){
	var key=e.keyCode ? e.keyCode : e.which;
	if (key===65) leftkeydown = true;
	if (key===68) rightkeydown = true;
	if (key===87) upkeydown = true;
	if (key===83) downkeydown = true;
	if (key===32) spacekeydown = true;
	sendData();
}

window.onkeyup = function(e){
	var key=e.keyCode ? e.keyCode : e.which;
	if (key===65) leftkeydown = false;
	if (key===68) rightkeydown = false;
	if (key===87) upkeydown = false;
	if (key===83) downkeydown = false;
	if (key===32) spacekeydown = false;
	sendData();
}

var images = [];
// Image factory
var createImage = function(src) {
  var img   = new Image();
  img.src   = src;
  img.onload = function() {
  	ready += 'a';
  }
  images.push(img)
}

// Make the image array
var images = [];
createImage("/TankImages/TankTextureRed.jpg");
createImage("/TankImages/TankTextureBlue.jpg");
createImage("/TankImages/TankTextureGreen.jpg");
var lastImage = new Image();
lastImage.onload = function() {
	width = this.width;
	height = this.height;
	ready += 'a';
}
lastImage.src = "/TankImages/TankTextureYellow.jpg";
images.push(lastImage);

function drawPlayer(x, y, width, height, degrees, player) {

    // first save the untranslated/unrotated context
    ctx.save();

    ctx.beginPath();
    // move the rotation point to the center of the rect
    ctx.translate(x + width / 2, y + height / 2);
    // rotate the rect
    ctx.rotate(degrees);

    // draw the rect on the transformed context
    // Note: after transforming [0,0] is visually [x,y]
    //       so the rect needs to be offset accordingly when drawn

    ctx.drawImage(images[player], -width / 2, -height / 2);

    // restore the context to its untranslated/unrotated state
    ctx.restore();

}

function drawBullet(bullet) {
	var x = bullet.xPos;
	var y = bullet.yPos;
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI);
	ctx.fillStyle = 'black';
	ctx.fill();
}

socket.on('all_data', function(data){
	if(data.stage === "LOBBY"){
		document.getElementById("beforeGame").style.display = "block";
		document.getElementById("duringGame").style.display = "none";
		if (data.countdown === 21) {
			document.getElementById("beforeGame").innerHTML('The Game will start when at least two people join.')
		} else {
			document.getElementById("beforeGame").innerHTML("The game will start in " +data.countdown +" seconds.")
		}

	}else if(data.stage === "GAME" && ready === "baaaa"){
		document.getElementById("beforeGame").style.display = "none";
		document.getElementById("duringGame").style.display = "block";
		ctx.clearRect(0, 0, c.width, c.height);

		for(var i = 0; i < data.tanks.length; i++){
			drawPlayer(data.tanks[i].xPos, data.tanks[i].yPos, width, height, data.tanks[i].rotation, i);
			for (var i = 0; i < data.tanks[i].bullets.length; i++) {
				drawBullet(data.tanks.bullets[i]);
			}
		}
		// console.log(data.tanks);
	}

});
