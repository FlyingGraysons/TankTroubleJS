var socket = io();

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

var rightkeydown = false;
var leftkeydown = false;
var upkeydown = false;
var downkeydown = false;
var spacekeydown = false;

function sendData(){
	var data = [rightkeydown, leftkeydown, upkeydown, downkeydown, spacekeydown];
	socket.emit('user_input_state', data);
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

socket.on('all_data', function(data){
	if(data.stage == "LOBBY"){
		//display lobby
	}else if(data.stage == "GAME"){
		//display game
	}
	
});