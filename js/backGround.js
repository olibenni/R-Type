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

backGround.prototype.sound1 = new Audio (
	"sounds/MusicLoop1.ogg");
backGround.prototype.sound2 = new Audio (
	"sounds/MusicLoop2.ogg");

backGround.prototype.playSounds = function () {
	this.sound1.volume = 0.2;
	if(!MUTE) this.sound1.play();
};

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
	},

	enemy3 : function(y,amount){
		for(var i = 0; i < amount; i++){
			entityManager.generateEnemy3({
				cx : g_canvas.width+i*40,
				cyStart : y,
				sprite : g_sprites.enemy3,
				scale : 1
			});
		}
	},

	boss : function(y, amount){
		entityManager.generateBoss({
			cx : g_canvas.width,
			cy : y,
			sprite : g_sprites.boss,
			width : g_sprites.boss[0].width
		});
	}
};

backGround.prototype.curTrigger = 0;
backGround.prototype.triggerIndex = 0;
//triggers : Distance in game, triggerCall, y, number of enemies
backGround.prototype.triggers = [
	{dist: 150,  enemyType: "enemy1", y: 200, amount: 6},
	{dist: 350,  enemyType: "enemy1", y: 200, amount: 3},
	{dist: 350,  enemyType: "enemy1", y: 250, amount: 3},
	{dist: 750,  enemyType: "enemy2", y: 300, amount: 6},
	{dist: 1400,  enemyType: "enemy1", y: 200, amount: 6},
	{dist: 1500,  enemyType: "enemy2", y: 300, amount: 6},
	{dist: 2200,  enemyType: "enemy2", y: 200, amount: 6},
	{dist: 2200,  enemyType: "enemy2", y: 400, amount: 6},
	{dist: 2450,  enemyType: "enemy3", y: 600, amount: 1},
	{dist: 2750,  enemyType: "enemy1", y: 175, amount: 9},
	{dist: 1600, enemyType: "boss",   y: 300, amount: 1}
];

backGround.prototype.getSpeed = function() {
	return this.speed;
};

backGround.prototype.update = function(du) {
	// move the background backward
	this.playSounds();

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
	if(util.randRange(0,10) > 11){
		var enemyType = Math.floor(util.randRange(0,1.999));
		var enemies = ["enemy1","enemy2","enemy3"]
		console.log(enemyType)
		this.triggerCalls[enemies[enemyType]](util.randRange(200,400),1);
	}
};

backGround.prototype.reset = function(){
	this.distance = 0;
	this.triggerIndex = 0;
	this.curTrigger = 0;
}
 
backGround.prototype.render = function(ctx) {

	this.sprite.drawWrappedCentredAt(
		ctx, this.cx, this.cy, this.rotation);

	ctx.fillStyle = "black";
	ctx.fillRect(0,0,g_canvas.width,32);
	ctx.fillRect(0,526,g_canvas.width,78);
	
	ctx.font = '12px sans-serif';
	ctx.fillStyle = 'white';
	ctx.fillText("Press M to mute", 20, g_canvas.height-50);
};

