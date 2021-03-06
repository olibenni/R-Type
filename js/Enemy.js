// ==========
// Enemy STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Enemy(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Set normal drawing scale
    this._scale = 1;
};

Enemy.prototype = new Entity();

// Initial, inheritable, default values
Enemy.prototype.rotation = 0;
Enemy.prototype.cx = 200;
Enemy.prototype.cy = 200;
Enemy.prototype.velX = -1.5;
Enemy.prototype.velY = 0;
Enemy.prototype.numSubSteps = 1;
Enemy.prototype.lives = 1;
Enemy.prototype.lifeTime = 0;
Enemy.prototype.spriteIndex = 0;

Enemy.prototype.deadSound = new Audio (
	"sounds/Blast1.ogg");
Enemy.prototype.fireSound = new Audio (
	"sounds/Lazer1.ogg");

Enemy.prototype.playSounds = function () {
		this.fireSound.volume = 0.1;
		if(!MUTE)this.fireSound.play();
};

Enemy.prototype.update = function (du) {
    this.lifeTime += du;
    this.computeVelChanges(du);
    this.computeSprite(du);
    // Unregister and check for death
    spatialManager.unregister(this);
    if( this._isDeadNow ) {
        return entityManager.KILL_ME_NOW;
    }

    // Perform movement substeps
    var steps = this.numSubSteps;
    var dStep = du / steps;
    for (var i = 0; i < steps; ++i) {
        this.computeSubStep(dStep);
    }

    // Handle firing
    this.maybeFireBullet(du);
    this.outOfBounds();
    spatialManager.register(this);
};

Enemy.prototype.wallCollision = function () {
	this._isDeadNow = true;
	if(!MUTE) this.deadSound.play();
	entityManager.createBigExplosion({
         cx    : this.cx, 
         cy    : this.cy,
         scale : this.scale*2,
         sprites : g_sprites.bigDeathExplosion
    });
};

Enemy.prototype.delay = 100 / NOMINAL_UPDATE_INTERVAL;
Enemy.prototype.elapsedDelay = 0;
Enemy.prototype.computeSprite = function(du) {
    this.elapsedDelay += du;
    if(this.elapsedDelay >= this.delay) {
        this.elapsedDelay = 0;
        this.spriteIndex = (this.spriteIndex + 1) % this.sprites.length;
    }
}
Enemy.prototype.dirChangeDelay = 200;
Enemy.prototype.elapsedDirChangeDelay = 0;
Enemy.prototype.computeVelChanges = function(du) {
    if(this.lifeTime % 200 < 100){
        this.velY = 1;
    }else{
        this.velY = -1;
    }
}

Enemy.prototype.computeSubStep = function (du) {

    var nextX = this.cx + this.velX * du;
    var nextY = this.cy + this.velY * du; 
    this.cx = nextX;
    this.cy = nextY;
};

Enemy.prototype.outOfBounds = function() {
    if(this.cx <= 0) this.kill();
}

Enemy.prototype.takeBulletHit = function(damage) {

    var currentLives = this.lives;
    this.lives -= damage;
    var damageDealt = currentLives - Math.max(this.lives, 0);
    
    if(this.lives <= 0) {
		Score.addScore(10);
		if(!MUTE) this.deadSound.play();
        this.kill();
        entityManager.createBigExplosion({
            cx    : this.cx, 
            cy    : this.cy,
            scale : this.scale*2,
            sprites : g_sprites.bigDeathExplosion
        });
		if(util.spawnPowerUp()){
			entityManager.generatePowerUp({
				cx : this.cx,
				cy : this.cy,
				sprite : g_sprites.powerup
			});
		}
    } else {
		if(!MUTE) this.deadSound.play();
        entityManager.createExplosion({
            cx    : this.cx, 
            cy    : this.cy,
            scale : this.scale,
            sprites : g_sprites.deathExplosion
        });
    }
    return damageDealt;
};

Enemy.prototype.maybeFireBullet = function (du) {
    if(Math.random() * 10 > 9.9) {
        var launchDist = this.getRadius() * 2;
        
        var relVel = this.launchVel;
        var relVelX = -4;
        var relVelY = 0;
		
		this.playSounds();
		
        entityManager.fireEnemyBullet(
           this.cx - launchDist, this.cy,
           relVelX, relVelY,
           Math.PI
        );
    }
};

Enemy.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Enemy.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    this.sprite.scale = this._scale;

    this.sprites[this.spriteIndex].drawCentredAt(
       ctx, this.cx, this.cy, this.rotation
    );

    this.sprite.scale = origScale;
};
