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
		for(var i = 0; i < amount; i++){
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
		for(var i = 0; i < amount; i++){
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
	this.addRandomEnemies();

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
};

backGround.prototype.addRandomEnemies = function(){
	if(util.randRange(0,10) > 9.9){
		var enemyType = Math.floor(util.randRange(0,1.999));
		var enemies = ["enemy1","enemy2"]
		console.log(enemyType)
		this.triggerCalls[enemies[enemyType]](util.randRange(200,400),1);
	}
}
 
backGround.prototype.render = function(ctx) {

	this.sprite.drawWrappedCentredAt(
		ctx, this.cx, this.cy, this.rotation);
	this.sprite.drawWrappedCentredAt(
		ctx, this.cx + this.sprite.width, this.cy, this.rotation);
	
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,g_canvas.width,32);
	ctx.fillRect(0,526,g_canvas.width,78);
};

