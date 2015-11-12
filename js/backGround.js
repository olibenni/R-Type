function backGround(descr) {
	this.setup(descr);
	
	this.sprite = this.sprite || g_sprites.starField;
	this.scale = this.scale || 1;
};

backGround.prototype = new Entity();

backGround.prototype.speed = MAP_SPEED;
backGround.prototype.cx = 0;
backGround.prototype.cy = 0;
backGround.prototype.rotation = 0;
backGround.prototype.distance = 0;

backGround.prototype.triggerCalls = {
	enemy : function(y,amount){
		for(var i = 0; i < 6; i++){
			entityManager.generateEnemy({
				cx : 600+i*20,
				cy : y+i*20,
				sprite : g_sprites.enemy1[0],
				sprites : g_sprites.enemy1,
				scale : 1
			});
		}
	},
	
	enemy2 : function(y,amount){
		for(var i = 0; i < 6; i++){
			entityManager.generateEnemy2({
				cx : 600+i*30,
				cyStart : y,
				sprite : g_sprites.enemy2,
				scale : 1
			});
		}
	}
};

backGround.prototype.curTrigger = 0;
//triggers : Distance in game, triggerCall, y, number of enemies
backGround.prototype.triggers = [
	[250,1,200,6],
	[350,2,300,6],
	[500,1,200,6],
	[600,2,300,6]
];

backGround.prototype.getSpeed = function() {
	return this.speed;
};

backGround.prototype.update = function(du) {
	// move the background backward
	
	this.checkTrigger();

	this.distance++;
	
	this.cx -= this.speed;
	if(this.cx <= 0) {
		this.cx = g_canvas.width;
	}
};

backGround.prototype.checkTrigger = function() {
	
	if(this.triggers[this.curTrigger][0] == this.distance){
		var thisTrigger = this.triggers[this.curTrigger]
		if(thisTrigger[1] == 1){
			this.triggerCalls.enemy(thisTrigger[2],thisTrigger[3]);
		}
		else if(thisTrigger[1]== 2){
			this.triggerCalls.enemy2(thisTrigger[2],thisTrigger[3]);
		}
		
		if(this.curTrigger < this.triggers.length-1)
		this.curTrigger += 1
	}
};
 
backGround.prototype.render = function(ctx) {

	this.sprite.drawWrappedCentredAt(
	ctx, this.cx, this.cy, this.rotation);
	this.sprite.drawWrappedCentredAt(
		ctx, this.cx + this.sprite.width, this.cy, this.rotation);
	
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,g_canvas.width,32);
	ctx.fillRect(0,526,g_canvas.width,78);
	
	this.drawLaserCharge(ctx);
	
	this.drawLives(ctx);

};

backGround.prototype.drawLaserCharge = function(ctx){
		ctx.font = "20px sans-serif";
		ctx.fillStyle = "white";
		ctx.fillText("Charge", g_canvas.width/2-100,550);
		ctx.fillStyle = "blue";
		ctx.fillRect(g_canvas.width/2-30, 535, 120, 20);
		if(entityManager._ships[0]){
			var charged = entityManager._ships[0].getLaserCharge();
			if(charged < 30){charged = 0}
			if(charged > 150){charged = 150}
			ctx.fillStyle = "red";
			if(charged > 30){
				ctx.fillRect(g_canvas.width/2-30, 535, charged-30, 20);
			}
		}
};

backGround.prototype.drawLives = function(ctx){
	if(entityManager._ships[0]){
		var lives = entityManager._ships[0].getLives();
		for(var i = 0; i < lives; i++){
			g_sprites.ship[3].drawCentredAt(ctx, 20+i*40,15,0);
		}
	}
};