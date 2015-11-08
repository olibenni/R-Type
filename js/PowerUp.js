// ====
// ROCK
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function PowerUp(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
      
    // Default sprite and scale, if not otherwise specified
    this.sprite = this.sprite || g_sprites.powerUp;
    this.scale  = this.scale  || 1;
	this.rotation = this.rotation || 0;
	this.xVel = this.speed || 0
	this.type = this.type || "PowerUp";
	this.choosePower();


/*
    // Diagnostics to check inheritance stuff
    this._rockProperty = true;
    console.dir(this);
*/

};

PowerUp.prototype = new Entity();

PowerUp.prototype.allPowers = ["Blue","Speed","Red","Missiles"]

PowerUp.prototype.choosePower = function(){
	var num = Math.floor(util.randRange(0,1.99));
	this.power = this.allPowers[num];
}

PowerUp.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death
    spatialManager.unregister(this);
	 if( this._isDeadNow ) {
        return entityManager.KILL_ME_NOW;
    }

    this.cx += this.xVel
    // TODO: YOUR STUFF HERE! --- (Re-)Register
    spatialManager.register(this);
};

PowerUp.prototype.getRadius = function () {
    return this.scale * (this.sprite.width / 2) * 0.9;
};


PowerUp.prototype.getPower = function () {
	this.kill();
	return this.power;
};


PowerUp.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this.scale;
    this.sprite.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};
