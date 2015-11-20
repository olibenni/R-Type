// ======
// BULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function LaserBullet(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Make a noise when I am created (i.e. fired)
    if(!MUTE) this.fireSound.play();
    
/*
    // Diagnostics to check inheritance stuff
    this._bulletProperty = true;
    console.dir(this);
*/

}

LaserBullet.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
LaserBullet.prototype.fireSound = new Audio(
    "sounds/Lazer1.ogg");
LaserBullet.prototype.zappedSound = new Audio(
    "sounds/bulletZapped.ogg");
    
// Initial, inheritable, default values
LaserBullet.prototype.rotation = 0;
LaserBullet.prototype.cx = 200;
LaserBullet.prototype.cy = 200;
LaserBullet.prototype.velX = 1;
LaserBullet.prototype.velY = 1;

// Convert times from milliseconds to "nominal" time units.
LaserBullet.prototype.lifeSpan = 3000 / NOMINAL_UPDATE_INTERVAL;

LaserBullet.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death
    spatialManager.unregister(this);
    if( this._isDeadNow ) {
        return entityManager.KILL_ME_NOW;
    }


    this.lifeSpan -= du;
    if (this.cx > g_canvas.width+50) return entityManager.KILL_ME_NOW;

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    //this.rotation += 1 * du;
    //this.rotation = util.wrapRange(this.rotation,
                                   //0, consts.FULL_CIRCLE);

    //this.wrapPosition();
    
    // TODO? NO, ACTUALLY, I JUST DID THIS BIT FOR YOU! :-)
    //
    // Handle collisions
    //
    var hitEntity = this.findHitEntity();
    if (hitEntity) {
        var canTakeHit = hitEntity.takeBulletHit;
        if (canTakeHit) {
			canTakeHit.call(hitEntity, 1); 
			return entityManager.KILL_ME_NOW;
		}
    }
    
    // TODO: YOUR STUFF HERE! --- (Re-)Register
    spatialManager.register(this);

};

LaserBullet.prototype.wallCollision = function () {
	this._isDeadNow = true;
    entityManager.createExplosion({
        cx    : this.cx, 
        cy    : this.cy,
        scale : this.scale,
        sprites : g_sprites.bulletExplosion
    });
};

LaserBullet.prototype.getRadius = function () {
    return 4;
};


LaserBullet.prototype.render = function (ctx) {

    var fadeThresh = this.lifeSpan / 3;

    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }

    g_sprites.bullet.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );

    ctx.globalAlpha = 1;
};
