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
function Laser(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);


    this.fireSound.play();
    
/*
    // Diagnostics to check inheritance stuff
    this._bulletProperty = true;
    console.dir(this);
*/

}

Laser.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Laser.prototype.fireSound = new Audio(
    "sounds/bulletFire.ogg");
Laser.prototype.zappedSound = new Audio(
    "sounds/bulletZapped.ogg");
    
// Initial, inheritable, default values
Laser.prototype.rotation = 0;
Laser.prototype.cx = 200;
Laser.prototype.cy = 200;
Laser.prototype.velX = 1;
Laser.prototype.velY = 1;

// Convert times from milliseconds to "nominal" time units.
Laser.prototype.lifeSpan = 3000 / NOMINAL_UPDATE_INTERVAL;

Laser.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death
    spatialManager.unregister(this);
    if( this._isDeadNow ) {
        return entityManager.KILL_ME_NOW;
    }


    this.lifeSpan -= du;
    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;

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
        if (canTakeHit) canTakeHit.call(hitEntity); 
        return entityManager.KILL_ME_NOW;
    }
    
    // TODO: YOUR STUFF HERE! --- (Re-)Register
    spatialManager.register(this);

};

Laser.prototype.getRadius = function () {
    return 4;
};

Laser.prototype.takeBulletHit = function () {
    this.kill();
    
    // Make a noise when I am zapped by another bullet
    this.zappedSound.play();
};

Laser.prototype.render = function (ctx) {

    var fadeThresh = Laser.prototype.lifeSpan / 3;

    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }

    g_sprites.laser.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );

    ctx.globalAlpha = 1;
};
