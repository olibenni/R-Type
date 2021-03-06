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
function Missile(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Make a noise when I am created (i.e. fired)
    if(!MUTE) this.fireSound.play();
    
	this.vel = this.vel || 2;
	this.enemy = this.getEnemy();
}

Missile.prototype = new Entity();

// HACKED-IN AUDIO (no preloading)
Missile.prototype.fireSound = new Audio(
    "sounds/Lazer1.ogg");
Missile.prototype.zappedSound = new Audio(
    "sounds/bulletZapped.ogg");
    
// Initial, inheritable, default values
Missile.prototype.rotation = 0;
Missile.prototype.velX = 2;
Missile.prototype.velY = 0;


Missile.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death
    spatialManager.unregister(this);
    if( this._isDeadNow ) {
        return entityManager.KILL_ME_NOW;
    }
	this.getEnemy();
    if (this.cx > g_canvas.width+50) return entityManager.KILL_ME_NOW;

	if(this.vel+3 > this.velX){
		this.velX *= 1.09;
	}else {
		this.velX = this.vel+3;
		if(this.enemy == -1){
			this.velY = 0;
		}else{
			this.getYVel();
		}
	}
    this.cx += this.velX * du;
    this.cy += this.velY * du;
    
    // TODO? NO, ACTUALLY, I JUST DID THIS BIT FOR YOU! :-)
    //
    // Handle collisions
    //
    var hitEntity = this.findHitEntity();
    if (hitEntity) {
        var canTakeHit = hitEntity.takeBulletHit;
        if (canTakeHit) {
			canTakeHit.call(hitEntity, this.vel); 
			return entityManager.KILL_ME_NOW;
		}
    }
    
    // TODO: YOUR STUFF HERE! --- (Re-)Register
    spatialManager.register(this);

};

Missile.prototype.getYVel = function(){
	if(this.cy - this.enemy.cy > this.getRadius()){
		this.velY = -this.vel;
	}else if(this.cy - this.enemy.cy < -this.getRadius()){
		this.velY = this.vel;
	}else{
		this.velY = 0;
	}
}

Missile.prototype.getEnemy = function(){
	this.enemy = entityManager.getOneEnemy(this.cx);
}

Missile.prototype.wallCollision = function () {
	this.kill();
    entityManager.createExplosion({
        cx    : this.cx, 
        cy    : this.cy,
        scale : this.scale,
        sprites : g_sprites.deathExplosion
    });
};

Missile.prototype.getRadius = function () {
    return this.vel*1.2;
};


Missile.prototype.render = function (ctx) {

    g_sprites.missile.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );

    ctx.globalAlpha = 1;
};
