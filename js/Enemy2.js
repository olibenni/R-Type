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
function Enemy2(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
	
	this.cy = this.cyStart;
    
    // Set normal drawing scale
    this._scale = 1;
};

Enemy2.prototype = new Entity();

// Initial, inheritable, default values
Enemy2.prototype.rotation = 0;
Enemy2.prototype.cx = 200;
Enemy2.prototype.velX = -1;
Enemy2.prototype.velY = 0;
Enemy2.prototype.numSubSteps = 1;
Enemy2.prototype.lives = 2;
Enemy2.prototype.lifeTime = 0;
Enemy2.prototype.shootingSpeed = 5;

Enemy2.prototype.deadSound = new Audio (
	"sounds/Blast2.ogg");

Enemy2.prototype.update = function (du) {
    this.lifeTime += du;
    this.computeVelChanges(du);
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

Enemy2.prototype.wallCollision = function () {
	this._isDeadNow = true;
	this.deadSound.play();
    entityManager.createBigExplosion({
        cx    : this.cx, 
        cy    : this.cy,
        scale : this.scale*2,
        sprites : g_sprites.bigDeathExplosion
    });
};

Enemy2.prototype.delay = 100 / NOMINAL_UPDATE_INTERVAL;
Enemy2.prototype.elapsedDelay = 0;

Enemy2.prototype.computeVelChanges = function(du) {
	
}

Enemy2.prototype.computeSubStep = function (du) {
	var values = Math.cos((this.cx % 100-50)/50*Math.PI)
	var values2 = Math.sin((this.cx % 100-50)/50*Math.PI*-1);
    var nextX = this.cx + this.velX * du;
    var nextY = this.cyStart + values * 20; 
    this.cx = nextX;
    this.cy = nextY;
	this.rotation = (((values2-1)/4)-0.75)*Math.PI
};

Enemy2.prototype.outOfBounds = function() {
    if(this.cx <= 0) this.kill();
}

Enemy2.prototype.takeBulletHit = function(damage) {

    var currentLives = this.lives;
    this.lives -= damage;
    var damageDealt = currentLives - Math.max(this.lives, 0);

    if(this.lives <= 0) {
		Score.addScore(20);
		this.deadSound.play();
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
		this.deadSound.play();
        entityManager.createExplosion({
            cx    : this.cx, 
            cy    : this.cy,
            scale : this.scale,
            sprites : g_sprites.deathExplosion
        });
    }

    return damageDealt;
};

Enemy2.prototype.maybeFireBullet = function (du) {
    if(Math.random() * 10 > 9.9) {
        var dX = +Math.cos(this.rotation);
        var dY = +Math.sin(this.rotation);
        var launchDist = this.getRadius() * 2;
        
        var relVel = this.shootingSpeed;
        var relVelX = dX * relVel;
        var relVelY = dY * relVel;
		
        entityManager.fireEnemyBullet(
           this.cx - launchDist, this.cy +dY*this.getRadius()*2,
           relVelX, relVelY,
           this.rotation
        );
    }
};

Enemy2.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Enemy2.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    this.sprite.scale = this._scale;

    this.sprite.drawCentredAt(
       ctx, this.cx, this.cy, this.rotation
    );

    this.sprite.scale = origScale;
};
