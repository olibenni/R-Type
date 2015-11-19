function Tiles(descr) {
	this.setup(descr);
	
	this.sprite = this.sprite || g_sprites.wall;
	this.scale = this.scale || 1;
};

Tiles.prototype = new Entity();

Tiles.prototype.speed = TILE_SPEED;
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

Tiles.prototype.collides = function(nextX, nextY, radius) {
	
	var rowLeft = Math.floor((nextX - radius)/this.tileWidth - this.tileOffSetLeft/this.tileWidth);
	var rowRight = Math.floor((nextX + radius)/this.tileWidth - this.tileOffSetLeft/this.tileWidth);
	var colUp = Math.floor((nextY - radius)/this.tileHeight - this.tileOffSetTop/this.tileHeight);
	var colDown = Math.floor((nextY + radius)/this.tileHeight - this.tileOffSetBot/this.tileHeight);
	if(nextY <= g_canvas.height/2) {
		if(this.tilesTop[colUp]){
			if(this.tilesTop[colUp][rowLeft]){
				if(this.tilesTop[colUp][rowLeft] == 1){
					return true;
				}
			}
			if(this.tilesTop[colUp][rowRight]){
				if(this.tilesTop[colUp][rowRight] == 1){
					return true;
				}
			}
		}
	} else {
		if(this.tilesBottom[colDown]) {
			if(this.tilesBottom[colDown][rowLeft]){
				if(this.tilesBottom[colDown][rowLeft] == 1) {
					return true;
				}
			}
			if(this.tilesBottom[colDown][rowRight]) {
				if(this.tilesBottom[colDown][rowRight] == 1) {
					return true;
				}
			}
		}
	}
	return false;
};

Tiles.prototype.getCollisionEntity = function() {
	var ships = entityManager._ships;
	var enemies = entityManager._enemies;
	var bullets = entityManager._bullets;
	for(var i = 0; i < ships.length; ++i) {
		var pos = ships[i].getPos();
		//console.log(ships[i]);
		if(this.collides(pos.posX, pos.posY, ships[i].getRadius())) {
			if(ships[i]._isWarping == false)
				ships[i].wallCollision();
		}
	}
	for(i = 0; i < enemies.length; ++i) {
		var pos = enemies[i].getPos();
		if(this.collides(pos.posX, pos.posY, enemies[i].getRadius())) {
			enemies[i].wallCollision();
		}
	}
	for(i = 0; i < bullets.length; ++i) {
		var pos = bullets[i].getPos();
		if(this.collides(pos.posX, pos.posY, bullets[i].getRadius())) {
			var canHitWall = bullets[i].wallCollision;
			if(canHitWall) canHitWall.call(bullets[i]);
		}
	}
};

Tiles.prototype.reset = function(){
	this.tileOffSetLeft = 0;
}

Tiles.prototype.update = function(du) {

	var top = this.tilesTop[0].length * this.tileWidth + this.tileOffSetLeft > g_canvas.width;
	var bot = this.tilesBottom[0].length * this.tileWidth + this.tileOffSetLeft > g_canvas.width;
	if( top || bot ) {
		this.tileOffSetLeft -= this.speed * du;		
	}

	this.getCollisionEntity();
};
 
Tiles.prototype.render = function(ctx) {
	
	this.drawTilesTop(ctx);
	this.drawTilesBottom(ctx);
	
};