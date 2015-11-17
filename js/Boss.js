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
function Boss(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Set normal drawing scale
    this._scale = 1;
};

Boss.prototype = new Entity();

// Initial, inheritable, default values
Boss.prototype.rotation = 0;
Boss.prototype.cx = 200;
Boss.prototype.velX = -1;
Boss.prototype.velY = 0;
Boss.prototype.numSubSteps = 1;
Boss.prototype.lives = 2;
Boss.prototype.lifeTime = 0;
Boss.prototype.shootingSpeed = 5;

Boss.prototype.update = function (du) {
    this.lifeTime += du;
    // Unregister and check for death
    spatialManager.unregister(this);
    if( this._isDeadNow ) {
        return entityManager.KILL_ME_NOW;
    }

    // Handle firing
    this.maybeFireBullet(du);
    spatialManager.register(this);
};

Boss.prototype.delay = 100 / NOMINAL_UPDATE_INTERVAL;
Boss.prototype.elapsedDelay = 0;

Boss.prototype.takeBulletHit = function(damage) {

    var currentLives = this.lives;
    this.lives -= damage;
    var damageDealt = currentLives - Math.max(this.lives, 0);

    if(this.lives <= 0) {
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

    return damageDealt;
};

Boss.prototype.maybeFireBullet = function (du) {
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

Boss.prototype.getRadius = function () {
    return 20;
};

Boss.prototype.render = function (ctx) {

    this.sprite[this.spriteIndex].drawCentredAt(
       ctx, this.cx, this.cy, this.rotation
    );
};
