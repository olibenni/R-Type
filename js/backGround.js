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
	enemy1 : function(y,amount){
		for(var i = 0; i < 6; i++){
			entityManager.generateEnemy({
				cx : g_canvas.width+i*20,
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
				cx : g_canvas.width+i*30,
				cyStart : y,
				sprite : g_sprites.enemy2,
				scale : 1
			});
		}
	}
};

backGround.prototype.curTrigger = 0;
backGround.prototype.triggerIndex = 0;
//triggers : Distance in game, triggerCall, y, number of enemies
backGround.prototype.triggers = [
	// [250,1,200,6],
	// [350,2,300,6],
	// [500,1,200,6],
	// [600,2,300,6]
	{dist: 250, enemyType: "enemy1", y: 200, amount: 6},
	{dist: 400, enemyType: "enemy2", y: 300, amount: 6},
	{dist: 550, enemyType: "enemy1", y: 200, amount: 6},
	{dist: 700, enemyType: "enemy2", y: 300, amount: 6}
];

backGround.prototype.getSpeed = function() {
	return this.speed;
};

backGround.prototype.update = function(du) {
	// move the background backward
	
	this.checkTrigger();

	this.distance += this.speed * du;
	
	this.cx -= this.speed * du;
	if(this.cx <= 0) {
		this.cx = g_canvas.width;
	}
};

backGround.prototype.checkTrigger = function() {
	var info = this.triggers[this.triggerIndex];
	if(info){
		if(info.dist <= this.distance){
			this.triggerCalls[info.enemyType](info.y, info.amount);
			this.triggerIndex++;
		}
	}
	
	// if(this.triggers[this.curTrigger][0] == this.distance){
	// 	var thisTrigger = this.triggers[this.curTrigger]
	// 	if(thisTrigger[1] == 1){
	// 		this.triggerCalls.enemy(thisTrigger[2],thisTrigger[3]);
	// 	}
	// 	else if(thisTrigger[1]== 2){
	// 		this.triggerCalls.enemy2(thisTrigger[2],thisTrigger[3]);
	// 	}
		
	// 	if(this.curTrigger < this.triggers.length-1)
	// 	this.curTrigger += 1
	// }
};
 
backGround.prototype.render = function(ctx) {

	this.sprite.drawWrappedCentredAt(
		ctx, this.cx, this.cy, this.rotation);
	this.sprite.drawWrappedCentredAt(
		ctx, this.cx + this.sprite.width, this.cy, this.rotation);
	
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,g_canvas.width,32);
	ctx.fillRect(0,526,g_canvas.width,78);

};

