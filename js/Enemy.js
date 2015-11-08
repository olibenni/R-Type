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

Enemy.prototype.update = function (du) {
    
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

    spatialManager.register(this);
};

Enemy.prototype.computeSubStep = function (du) {

    var nextX = this.cx + this.velX * du;
    var nextY = this.cy; 
    this.cx = nextX;
};

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

    this.sprite.scale = origScale;
};
