function backGround(descr) {
	this.setup(descr);
	
	this.sprite = this.sprite || g_sprites.starField;
	this.scale = this.scale || 1;
};

backGround.prototype = new Entity();

backGround.prototype.speed = 1.5;
backGround.prototype.cx = 0;
backGround.prototype.cy = 0;
backGround.prototype.rotation = 0;

backGround.prototype.tiles = [
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1],
	[1,1,1,1,0,0,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,1,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[],
	[],
	[],
	[],
	[1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

var tileWidth = 100;
var tileHeight = 50;
var tilePadding = 0;
backGround.prototype.tileOffSetLeft = 0;
var tileOffSetTop = 0;

backGround.prototype.drawTiles = function(ctx) {
		for(var i = 0; i < this.tiles.length; i++) {
			for(var j = 0; j < this.tiles[i].length; j++) {
				if(this.tiles[i][j] == 1) {
					var tilesX = (j * (tileWidth + tilePadding)) + this.tileOffSetLeft;
					var tilesY = (i * (tileHeight + tilePadding)) + tileOffSetTop;
					ctx.beginPath();
					ctx.strokeStyle = 'White';
					ctx.rect(tilesX, tilesY, tileWidth, tileHeight);
					ctx.fillStyle = 'red';
					ctx.stroke();
					ctx.fill();
					ctx.closePath();
				}
			}
		}
};
/*
backGround.prototype.collides = function(nextX, nextY, width, height) {
	for(var i = 0; i < this.tiles.length; i++) {
		for(var j = 0; j < this.tiles[i].length; j++) {
			var tilesX = (j * (tileWidth + tilePadding)) + this.tileOffSetLeft;
			var tilesY = (i * (tileHeight + tilePadding)) + tileOffSetTop;
			if()
		}
	}	
};
*/
backGround.prototype.update = function(du) {
	// move the background backward

	if(this.tiles[0].length * tileWidth + this.tileOffSetLeft > g_canvas.width) {
		//console.log(this.tiles[0].length * tileWidth - this.tileOffSetLeft);
		this.tileOffSetLeft -= this.speed;
		this.cx -= this.speed;		
	}
	

	if(this.cx <= 0) {
		this.cx = g_canvas.width;
	}
};
 
backGround.prototype.render = function(ctx) {
	this.sprite.drawWrappedCentredAt(
	ctx, this.cx, this.cy, this.rotation);
	
	this.drawTiles(ctx);
};