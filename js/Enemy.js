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
Enemy.prototype.velX = -2;
Enemy.prototype.velY = 0;
Enemy.prototype.numSubSteps = 1;
Enemy.prototype.lives = 3;
Enemy.prototype.spriteIndex = 0;
Enemy.prototype.lifeTime = 0;

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

Enemy.prototype.delay = 100 / NOMINAL_UPDATE_INTERVAL;
Enemy.prototype.elapsedDelay = 0;
Enemy.prototype.computeSprite = function(du) {
    this.elapsedDelay += du;
    if(this.elapsedDelay >= this.delay) {
        this.elapsedDelay = 0;
        this.spriteIndex = (this.spriteIndex + 1) % this.sprites.length;
    }
}
Enemy.prototype.computeVelChanges = function(du) {
    if(this.lifeTime < 100) {
        this.velY = 1;
    } else if(this.lifeTime < 150) {
        this.velY = -1;
    } else if(this.lifeTime < 200) {
        this.velY = 1;
    } else if(this.lifeTime < 300) {
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

Enemy.prototype.moveUp = function() {
    this.spriteIndex = 4;
};

Enemy.prototype.moveDown = function() {
    this.spriteIndex = 0;
};

Enemy.prototype.takeBulletHit = function() {
    if(--this.lives <= 0) {
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
        entityManager.createExplosion({
            cx    : this.cx, 
            cy    : this.cy,
            scale : this.scale,
            sprites : g_sprites.deathExplosion
        });
    }
};

Enemy.prototype.maybeFireBullet = function (du) {
    if(Math.random() * 10 > 9.9) {
        var launchDist = this.getRadius() * 2;
        
        var relVel = this.launchVel;
        var relVelX = -4;
        var relVelY = 0;

        entityManager.fireBullet(
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

    // g_animatedSprites.enemy1.cycleAnimationAt(ctx, this.cx, this.cy);

    this.sprite.scale = origScale;
};
