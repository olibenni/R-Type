// ======
// FetusBullet
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function FetusBullet(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
};

FetusBullet.prototype = new Entity();

// Initial, inheritable, default values
FetusBullet.prototype.rotation = 0;
FetusBullet.prototype.cx = 200;
FetusBullet.prototype.cy = 200;
FetusBullet.prototype.velX = 1;
FetusBullet.prototype.velY = 1;
FetusBullet.prototype.lifeTime = 0;

FetusBullet.prototype.update = function (du) {
    this.lifeTime += du;
    if(this.lifeTime > 200 / NOMINAL_UPDATE_INTERVAL){
        if(this.randomTrajectory){
            this.velY = Math.random() * (-16) + 8;
        }else{
            this.velY += this.trajectory;
        }
    }
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

FetusBullet.prototype.outOfBounds = function() {
    if(this.cx <= 0) this.kill();
};

FetusBullet.prototype.wallCollision = function () {
    this._isDeadNow = true;
    entityManager.createExplosion({
        cx    : this.cx, 
        cy    : this.cy,
        scale : this.scale,
        sprites : g_sprites.deathExplosion
    });
};


FetusBullet.prototype.getRadius = function () {
    return 10;
};


FetusBullet.prototype.render = function (ctx) {
    g_sprites.fetusBullet.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};
