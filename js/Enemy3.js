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
function Enemy3(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Set normal drawing scale
    this._scale = 1;
};

Enemy3.prototype = new Entity();

// Initial, inheritable, default values
Enemy3.prototype.rotation = 0;
Enemy3.prototype.cx = 200;
Enemy3.prototype.cy = 475;
Enemy3.prototype.velX = 0;
Enemy3.prototype.velY = 0;
Enemy3.prototype.numSubSteps = 1;
Enemy3.prototype.lives = 2;
Enemy3.prototype.spriteIndex = 0;
Enemy3.prototype.lifeTime = 0;

Enemy3.prototype.deadSound = new Audio (
	"sounds/Blast1.ogg");
Enemy3.prototype.fireSound = new Audio (
	"sounds/Lazer1.ogg");

Enemy3.prototype.playSounds = function () {
		this.fireSound.volume = 0.1;
		if(!MUTE)this.fireSound.play();
};

Enemy3.prototype.update = function (du) {
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

Enemy3.prototype.wallCollision = function () {
    this._isDeadNow = true;
    if(!MUTE) this.deadSound.play();
    entityManager.createBigExplosion({
        cx    : this.cx, 
        cy    : this.cy,
        scale : this.scale*2,
        sprites : g_sprites.bigDeathExplosion
    });
};

Enemy3.prototype.delay = 30;
Enemy3.prototype.elapsedDelay = 0;
Enemy3.prototype.computeSprite = function(du) {
    this.elapsedDelay += du;
    if(this.elapsedDelay >= this.delay) {
        this.elapsedDelay = 0;
        this.spriteIndex = (this.spriteIndex + 1) % this.sprite.length;
    }
}
Enemy3.prototype.dirChangeDelay = 200;
Enemy3.prototype.elapsedDirChangeDelay = 0;

Enemy3.prototype.computeVelChanges = function(du) {
    if(this.lifeTime > 0){
        this.velX = -0.9;
    } else {
        this.velX = 3;
    }
}

Enemy3.prototype.computeSubStep = function (du) {

    var nextX = this.cx + this.velX * du;
    var nextY = this.cy + this.velY * du; 
    this.cx = nextX;
    this.cy = nextY;
};

Enemy3.prototype.outOfBounds = function() {
    if(this.cx <= 0) this.kill();
}


Enemy3.prototype.takeBulletHit = function(damage) {

    var currentLives = this.lives;
    this.lives -= damage;
    var damageDealt = currentLives - Math.max(this.lives, 0);
    
    if(this.lives <= 0) {
		Score.addScore(40);
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

Enemy3.prototype.maybeFireBullet = function (du) {
    if(this.spriteIndex === 6) {
        var launchDist = this.getRadius() * 2;
        
        var relVel = this.launchVel;
        var relVelX = -3;
        var relVelY = -3;
		
		this.playSounds();
		
        entityManager.fireEnemyBullet(
           this.cx - launchDist + 10, this.cy - launchDist + 10,
           relVelX, relVelY,
           Math.PI
        );
    }
};

Enemy3.prototype.getRadius = function () {
    return (this.sprite[this.spriteIndex].width / 2) * 0.9;
};

Enemy3.prototype.render = function (ctx) {

    this.sprite[this.spriteIndex].drawCentredAt(
       ctx, this.cx, this.cy, this.rotation
    );
};
