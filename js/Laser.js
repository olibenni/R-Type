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
    this.type = this.getType();
    this.damage = this.type*3;
    this.lives = this.damage;
    console.log(this.damage);
}

Laser.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Laser.prototype.fireSound = new Audio(
    "sounds/bulletFire.ogg");
Laser.prototype.zappedSound = new Audio(
    "sounds/bulletZapped.ogg");

Laser.prototype.getType = function() {
    // Checks if laser has been charges for 1,2,3 or more seconds
    if(this.charge < 1000 / NOMINAL_UPDATE_INTERVAL) {
        return 1;
    } 
    if(this.charge < 2000 / NOMINAL_UPDATE_INTERVAL) {
        return 2;
    }
    if(this.charge < 2500 / NOMINAL_UPDATE_INTERVAL) {
        return 3;
    }
    return 5;
}
    
// Initial, inheritable, default values
Laser.prototype.rotation = 0;
Laser.prototype.cx = 200;
Laser.prototype.cy = 200;
Laser.prototype.velX = 1;
Laser.prototype.velY = 1;

// Convert times from milliseconds to "nominal" time units.
Laser.prototype.lifeSpan = 3000 / NOMINAL_UPDATE_INTERVAL;

Laser.prototype.update = function (du) {

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
        var canTakeHit = hitEntity.takeBulletHit;
        if (canTakeHit) {
            var damageDealt = canTakeHit.call(hitEntity, this.damage);
            this.lives -= damageDealt;
            if(this.lives <= 0) return entityManager.KILL_ME_NOW;
        }
    }
    
    spatialManager.register(this);

};

Laser.prototype.getRadius = function () {
    return this.type * 2;
};


Laser.prototype.render = function (ctx) {

    var fadeThresh = Laser.prototype.lifeSpan / 3;

    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }

    // g_sprites.laser.drawCentredAt(
    //     ctx, this.cx, this.cy, this.rotation
    // );
    //g_animatedSprites.laser[this.type].cycleAnimationAt(ctx, this.cx, this.cy);
    g_animatedSprites.laser.cycleAnimationAt(ctx, this.cx, this.cy);

    ctx.globalAlpha = 1;
};
