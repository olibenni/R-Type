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

EnemyBullet.prototype.update = function (du) {

    spatialManager.unregister(this);
    if( this._isDeadNow ) {
        return entityManager.KILL_ME_NOW;
    }

    this.cx += this.velX * du;
    this.cy += this.velY * du;
    this.rotation += 0.5 * du;
    this.rotation = util.wrapRange(this.rotation,
                                   0, consts.FULL_CIRCLE);

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
    this.outOfBounds();
    spatialManager.register(this);

};

EnemyBullet.prototype.outOfBounds = function() {
    if(this.cx <= 0) this.kill();
};

EnemyBullet.prototype.wallCollision = function () {
	this._isDeadNow = true;
    entityManager.createExplosion({
        cx    : this.cx, 
        cy    : this.cy,
        scale : this.scale,
        sprites : g_sprites.deathExplosion
    });
};

EnemyBullet.prototype.getRadius = function () {
    return 4;
};


EnemyBullet.prototype.render = function (ctx) {

    var fadeThresh = Bullet.prototype.lifeSpan / 3;

    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }

    g_sprites.enemyBullet.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );

    ctx.globalAlpha = 1;
};
