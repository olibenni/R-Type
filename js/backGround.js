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

backGround.prototype.tilesTop = [
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1],
	[1,1,1,1,0,0,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,1,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
];

backGround.prototype.tilesBottom = [
	[1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

backGround.prototype.tileWidth = 64*1.6;
backGround.prototype.tileHeight = 23*1.6;
backGround.prototype.tilePadding = 0;
backGround.prototype.tileOffSetLeft = 0;
backGround.prototype.tileOffSetTop = 32;
backGround.prototype.tileOffSetBot = 380;

backGround.prototype.drawTilesTop = function(ctx) {
	for(var i = 0; i < this.tilesTop.length; i++) {
		for(var j = 0; j < this.tilesTop[i].length; j++) {
			if(this.tilesTop[i][j] == 1) {
				var tilesX = (j * (this.tileWidth + this.tilePadding)) + this.tileOffSetLeft;
				var tilesY = (i * (this.tileHeight + this.tilePadding)) + this.tileOffSetTop;
				g_sprites.wall.drawCentredAt(ctx, tilesX + this.tileWidth/2, tilesY + this.tileHeight/2, 0);
			}
		}
	}
};

backGround.prototype.drawTilesBottom = function(ctx) {
	for(var i = 0; i < this.tilesBottom.length; i++) {
		for(var j = 0; j < this.tilesBottom[i].length; j++) {
			if(this.tilesBottom[i][j] == 1) {
				var tilesX = (j * (this.tileWidth + this.tilePadding)) + this.tileOffSetLeft;
				var tilesY = (i * (this.tileHeight + this.tilePadding)) + this.tileOffSetBot;
				g_sprites.wall.drawCentredAt(ctx, tilesX + this.tileWidth/2, tilesY + this.tileHeight/2, Math.PI);				
			}
		}
	}
};

/*
backGround.prototype.collides = function() {
	for(var i = 0; i < this.tiles.length; i++) {
		for(var j = 0; j < this.tiles[i].length; j++) {
			var tilesX = (j * (tileWidth + tilePadding)) + this.tileOffSetLeft;
			var tilesY = (i * (tileHeight + tilePadding)) + tileOffSetTop;
			if()
				
			}
		}
	}	
};
*/

backGround.prototype.update = function(du) {
	// move the background backward
	if(this.tilesTop[0].length * this.tileWidth + this.tileOffSetLeft > g_canvas.width ||
		this.tilesBottom[0].length * this.tileWidth + this.tileOffSetLeft > g_canvas.width) {
		this.tileOffSetLeft -= this.speed;
		//this.cx -= this.speed;		
	}
	/*
	if(this.cx <= 0) {
		this.cx = g_canvas.width;
	}*/
};
 
backGround.prototype.render = function(ctx) {
	/*
	this.sprite.drawWrappedCentredAt(
	ctx, this.cx, this.cy, this.rotation);
	*/
	this.drawTilesTop(ctx);
	this.drawTilesBottom(ctx);
	
};