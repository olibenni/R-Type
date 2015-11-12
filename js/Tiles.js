function Tiles(descr) {
	this.setup(descr);
	
	this.sprite = this.sprite || g_sprites.wall;
	this.scale = this.scale || 1;
};

Tiles.prototype = new Entity();

Tiles.prototype.speed = 0.5;
Tiles.prototype.cx = 0;
Tiles.prototype.cy = 0;
Tiles.prototype.rotation = 0;

Tiles.prototype.tilesTop = [
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1],
	[1,1,1,1,0,0,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,1,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
];

Tiles.prototype.tilesBottom = [
	[1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

Tiles.prototype.tileWidth = 64*1.6;
Tiles.prototype.tileHeight = 23*1.6;
Tiles.prototype.tilePadding = 0;
Tiles.prototype.tileOffSetLeft = 0;
Tiles.prototype.tileOffSetTop = 32;
Tiles.prototype.tileOffSetBot = 380;
Tiles.prototype.tilesX = 0;
Tiles.prototype.tilesY = 0;

Tiles.prototype.drawTilesTop = function(ctx) {
	for(var i = 0; i < this.tilesTop.length; i++) {
		for(var j = 0; j < this.tilesTop[i].length; j++) {
			if(this.tilesTop[i][j] == 1) {
				this.tilesX = (j * (this.tileWidth + this.tilePadding)) + this.tileOffSetLeft;
				this.tilesY = (i * (this.tileHeight + this.tilePadding)) + this.tileOffSetTop;
				g_sprites.wall.drawCentredAt(ctx, this.tilesX + this.tileWidth/2, this.tilesY + this.tileHeight/2, 0);
			}
		}
	}
};

Tiles.prototype.drawTilesBottom = function(ctx) {
	for(var i = 0; i < this.tilesBottom.length; i++) {
		for(var j = 0; j < this.tilesBottom[i].length; j++) {
			if(this.tilesBottom[i][j] == 1) {
				this.tilesX = (j * (this.tileWidth + this.tilePadding)) + this.tileOffSetLeft;
				this.tilesY = (i * (this.tileHeight + this.tilePadding)) + this.tileOffSetBot;
				g_sprites.wall.drawCentredAt(ctx, this.tilesX + this.tileWidth/2, this.tilesY + this.tileHeight/2, Math.PI);				
			}
		}
	}
};
/*
Tiles.prototype.collides = function(nextX, nextY, radius) {
	for(var i = 0; i < this.tilesTop.length; i++) {
		for(var j = 0; j < this.tilesTop[i].length; j++) {
			var tilesX = (j * (this.tileWidth + this.tilePadding)) + this.tileOffSetLeft;
			var tilesY = (i * (this.tileHeight + this.tilePadding)) + this.tileOffSetTop;
			if(this.nextX > tilesX && this.nextX < tilesX+this.tileWidth &&
			nextY > tilesY && nextY < tilesY+this.tileHeight) {
				return true;				
			}
			return false;
		}
	}	
};
*/
Tiles.prototype.getPos = function() {
	for(var i = 0; i < this.tilesTop.length; i++) {
		for(var j = 0; j < this.tilesTop[i].length; j++) {
			if(this.tilesTop[i][j] == 1) {
				this.tilesX = (j * (this.tileWidth + this.tilePadding)) + this.tileOffSetLeft;
				this.tilesY = (i * (this.tileHeight + this.tilePadding)) + this.tileOffSetTop;
				return {
					posX: this.tilesX, 
					posY: this.tilesY,
					width: this.tileWidth,
					height: this.tileHeight
				};
			}					
		}
	}
};

Tiles.prototype.update = function(du) {

	var top = this.tilesTop[0].length * this.tileWidth + this.tileOffSetLeft > g_canvas.width;
	var bot = this.tilesBottom[0].length * this.tileWidth + this.tileOffSetLeft > g_canvas.width;
	if( top || bot ) {
		this.tileOffSetLeft -= this.speed;		
	}
	/*
	var colli = this.collides(this.tileWidth, this.tileHeight, this.getRadius());
	if(colli) {
		return entityManager.KILL_ME_NOW;
	}*/
	spatialManager.register(this);
};
 
Tiles.prototype.render = function(ctx) {
	
	this.drawTilesTop(ctx);
	this.drawTilesBottom(ctx);
	
};