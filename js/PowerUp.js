
"use strict";


// A generic contructor which accepts an arbitrary descriptor object
function PowerUp(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
      
    // Default sprite and scale, if not otherwise specified
    this.sprite = this.sprite || g_sprites.powerUp;
    this.scale  = this.scale  || 1;
	this.rotation = this.rotation || 0;
	this.xVel = this.speed || MAP_SPEED;
	this.type = this.type || "PowerUp";
	this.choosePower();
};

PowerUp.prototype = new Entity();

PowerUp.prototype.allPowers = ["Blue","Speed","Red","Missile"];
PowerUp.prototype.powerColors = ["rgba(0, 0, 255, 0.3)", "rgba(64, 64, 64, 0.3)", "rgba(255, 0, 0, 0.3)", "rgba(255, 255, 0, 0.3)"];

PowerUp.prototype.choosePower = function(){
	var num = Math.floor(util.randRange(0,3.9999));
	this.power = this.allPowers[num];
	this.color = this.powerColors[num];
}

PowerUp.prototype.update = function (du) {

    spatialManager.unregister(this);
	 if( this._isDeadNow ) {
        return entityManager.KILL_ME_NOW;
    }

    this.cx -= this.xVel;
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
	ctx.beginPath();
	ctx.arc(this.cx, this.cy, this.getRadius(), 0, Math.PI * 2);
	ctx.stroke();
	ctx.fillStyle = this.color;
	ctx.fill();
    
};
