// ======
// ENEMYBULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function EnemyBullet(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
};

EnemyBullet.prototype = new Entity();

// Initial, inheritable, default values
EnemyBullet.prototype.rotation = 0;
EnemyBullet.prototype.cx = 200;
EnemyBullet.prototype.cy = 200;
EnemyBullet.prototype.velX = 1;
EnemyBullet.prototype.velY = 1;

// Convert times from milliseconds to "nominal" time units.
EnemyBullet.prototype.lifeSpan = 3000 / NOMINAL_UPDATE_INTERVAL;

EnemyBullet.prototype.update = function (du) {

    spatialManager.unregister(this);
    if( this._isDeadNow ) {
        return entityManager.KILL_ME_NOW;
    }

    this.lifeSpan -= du;
    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    //
    // Handle collisions
    //
    var hitEntity = this.findHitEntity();
    if (hitEntity) {
        var canTakeHit = hitEntity.takeEnemyBullet;
        if (canTakeHit) {
			canTakeHit.call(hitEntity); 
			return entityManager.KILL_ME_NOW;
		}
    }

    spatialManager.register(this);

};

EnemyBullet.prototype.getRadius = function () {
    return 4;
};


EnemyBullet.prototype.render = function (ctx) {

    var fadeThresh = Bullet.prototype.lifeSpan / 3;

    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }

    g_sprites.bullet.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );

    ctx.globalAlpha = 1;
};
