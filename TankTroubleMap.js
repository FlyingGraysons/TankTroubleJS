var MAP_ROWS = 8;
var MAP_COLUMNS = 8;
var map =[];
for (var i = 0; i < MAP_COLUMNS; i++){
	map[i] = [];
}
var changes = [[0, 1], [0, -1], [1, 0], [-1,0]];
var createWall = function(up, down, right, left, xPos, yPos){
	return {
		wall_up: up,
		wall_down: down,
		wall_left: right,
		wall_right: left,
		position: [xPos, yPos]
	}
}
//0 corresponds to up
//1 corresponds to down
//2 corresponds to right
//3 corresponds to left
var isReachable = function(tile, direction){
	var myX = tile.position[0]+changes[direction][0];
	var myY = tile.position[1]+changes[direction][1];
	if(myX >= 0 && myX < MAP_COLUMNS && myY >= 0 && myY < MAP_ROWS){
		if (direction == 0 && !tile.wall_up) return true;
		else if (direction == 1 && !tile.wall_down) return true;
		else if (direction == 2 && !tile.wall_right) return true;
		else if (direction == 3 && !tile.wall_left) return true;
	}
	return false;
}
/*var connected_wall = function(x, y, gameMap){
	if (map[y][x].wall_up){
		if (isReachable(map[y][x], 0)){
			gameMap[]
		}
		if (isReachable(map[y][x], 2)){
			
		}
		if (isReachable(map[y][x], 3)){
			
		}
	}
	if (map[y][x].down){
		
	}
	if (map[y][x].wall_right){
		
	}
	if (map[y][x].wall_left){
		
	}
}*/
var contains = function(list, element){
	for (var i = 0; i < list.length; i++){
		if (list[i].position[0] == element.position[0] && list[i].position[1] == element.position[1]) return true;
	
	}
	return false;
}
var floodFill = function(gameMap, tile, allTiles){
	for (var a = 0; a < 4; a++){
		if (isReachable(tile, a)){
			var next_tile = gameMap[tile.position[1]+changes[a][1]][tile.position[0]+changes[a][0]]
			if (contains(allTiles, next_tile)){
				allTiles.push_back(tile);
				allTiles = floodFill(gameMap, next_tile, allTiles);
			}
		}
	}
	return allTiles;
}
//var previous_item;
//map[0][0] = createWall(false, true, false, true, 0, 0);
//previous_item = map[0][0];
do {
	for (var y = 0; y < MAP_ROWS; y++){
		for (var x = 0; x < MAP_COLUMNS; x++){
			
			var r = false;
			var l = false;
			var d = false;
			var u = false;

			if (x==0) l = true;
			if (x==MAP_COLUMNS) r = true;
			if (y==0) d = true;
			if (y==MAP_ROWS) u = true;

			//if (previous_item.position[0] != x && previous_item.position[1] != y){
				var n = Math.round(Math.random()*7);
				if (n==0) u = true;
				n = Math.round(Math.random()*7);
				if (n==0) d = true;
				n = Math.round(Math.random()*7);
				if (n==0) r = true;
				n = Math.round(Math.random()*7);
				if (n==0) l = true;
				map[y][x] = createWall(u, d, r, l, x, y);
			//}
			//previous_item = map[y][x];


		}
	}
} while (floodFill(map, map[0][0], []).length == MAP_ROWS*MAP_COLUMNS);

console.log(map);
