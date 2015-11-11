// ==========
// SHIP STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Ship(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.ship;
    this.sprites = this.sprites || g_sprites.ship;
    this.lasor = this.lasor || g_sprites.lasor;
    
    // Set normal drawing scale, and warp state off
    this._scale = 1;
    this._isWarping = false;
};

Ship.prototype = new Entity();

Ship.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

Ship.prototype.KEY_THRUST    = 'D'.charCodeAt(0);
Ship.prototype.KEY_RETRO     = 'A'.charCodeAt(0);
Ship.prototype.KEY_UPWARD    = 'W'.charCodeAt(0);
Ship.prototype.KEY_DOWNWARD  = 'S'.charCodeAt(0);

Ship.prototype.KEY_FIRE      = ' '.charCodeAt(0);

// Initial, inheritable, default values
Ship.prototype.rotation = 0;
Ship.prototype.cx = 200;
Ship.prototype.cy = 200;
Ship.prototype.velX = 0;
Ship.prototype.velY = 0;
Ship.prototype.launchVel = 10;
Ship.prototype.numSubSteps = 1;
Ship.prototype.lives = 3;
Ship.prototype.speed = 3;
Ship.prototype.spriteIndex = 2;
Ship.prototype.powerUps = {blue : false, red : false, misseles : false};

// HACKED-IN AUDIO (no preloading)
Ship.prototype.warpSound = new Audio(
    "sounds/shipWarp.ogg");

Ship.prototype.warp = function () {

    this._isWarping = true;
    this._scaleDirn = -1;
    this.warpSound.play();
    
    // Unregister me from my old posistion
    // ...so that I can't be collided with while warping
    spatialManager.unregister(this);
};

Ship.prototype._updateWarp = function (du) {

    var SHRINK_RATE = 3 / SECS_TO_NOMINALS;
    this._scale += this._scaleDirn * SHRINK_RATE * du;
    
    if (this._scale < 0.2) {
    
        this._moveToASafePlace();
        this.halt();
        this._scaleDirn = 1;
        
    } else if (this._scale > 1) {
    
        this._scale = 1;
        this._isWarping = false;
        
        // Reregister me from my old posistion
        // ...so that I can be collided with again
        spatialManager.register(this);
        
    }
};

Ship.prototype._moveToASafePlace = function () {

    // Move to a safe place some suitable distance away
    var origX = this.cx,
        origY = this.cy,
        MARGIN = 40,
        isSafePlace = false;

    for (var attempts = 0; attempts < 100; ++attempts) {
    
        var warpDistance = 100 + Math.random() * g_canvas.width /2;
        var warpDirn = Math.random() * consts.FULL_CIRCLE;
        
        this.cx = origX + warpDistance * Math.sin(warpDirn);
        this.cy = origY - warpDistance * Math.cos(warpDirn);
        
        this.wrapPosition();
        
        // Don't go too near the edges, and don't move into a collision!
        if (!util.isBetween(this.cx, MARGIN, g_canvas.width - MARGIN)) {
            isSafePlace = false;
        } else if (!util.isBetween(this.cy, MARGIN, g_canvas.height - MARGIN)) {
            isSafePlace = false;
        } else {
            isSafePlace = !this.isColliding();
        }

        // Get out as soon as we find a safe place
        if (isSafePlace) break;
        
    }
};
    
Ship.prototype.usedShield = false;

Ship.prototype.update = function (du) {

    // Handle warping
    if (this._isWarping) {
        this._updateWarp(du);
        return;
    }
    
    // Unregister and check for death
    spatialManager.unregister(this);
    if( this._isDeadNow ) {
        return entityManager.KILL_ME_NOW;
    }


    // Perform movement substeps
    var steps = this.numSubSteps;
    var dStep = du / steps;
    for (var i = 0; i < steps; ++i) {
        this.computeSubStep(dStep);
    }

    // Handle firing
    this.maybeFireBullet(du);

    // Handle collision
	var collision = this.isColliding();
	if(collision){
		if(collision.type != "PowerUp" && this.powerUps.red != true) {
			if(--this.lives === 0) return entityManager.KILL_ME_NOW;
			this.warp();
		}else if(collision.type == "PowerUp"){
			this.takePowerUp(collision.getPower());
		}else if(this.powerUps.red == true){
			this.usedShield = true;
		}
	}else {
		if(this.usedShield == true){
			this.usedShield = false;
			this.powerUps.red = false;
		}
        spatialManager.register(this);
    }

};

Ship.prototype.computeSubStep = function (du) {
    
    //var thrust = this.computeThrustMag();

    // Apply thrust directionally, based on our rotation
    //var accelX = +Math.sin(this.rotation) * thrust;
    //var accelY = -Math.cos(this.rotation) * thrust;
    
    //accelY += this.computeGravity();

    //this.applyAccel(accelX, accelY, du);
    var nextX = this.cx;
    var nextY = this.cy;
    if(keys[this.KEY_THRUST]){
		nextX += this.speed * du;
	}
	else if(keys[this.KEY_RETRO]){
		nextX -= this.speed * du;
	}
	if(keys[this.KEY_UPWARD]){
        this.moveUp();
		nextY -= this.speed * du;
	}
	else if(keys[this.KEY_DOWNWARD]){
        this.moveDown();
		nextY += this.speed * du;
	}
    else{
        this.spriteIndex = 2;
    }
    this.keepWithinBounds(nextX, nextY);
    //this.wrapPosition();
    
};

Ship.prototype.moveUp = function() {
    this.spriteIndex = 4;
};

Ship.prototype.moveDown = function() {
    this.spriteIndex = 0;
};

Ship.prototype.keepWithinBounds = function(nextX, nextY) {
    this.cx = util.boundary(this.sprite.width/2, nextX, 0, g_canvas.width); 
    this.cy = util.boundary(this.sprite.height/2, nextY, 0, g_canvas.height);
};


var NOMINAL_GRAVITY = 0.12;

Ship.prototype.computeGravity = function () {
    return g_useGravity ? NOMINAL_GRAVITY : 0;
};

var NOMINAL_THRUST = +0.2;
var NOMINAL_RETRO  = -0.1;

Ship.prototype.computeThrustMag = function () {
    
    var thrust = 0;
    
    if (keys[this.KEY_THRUST]) {
        thrust += NOMINAL_THRUST;
    }
    if (keys[this.KEY_RETRO]) {
        thrust += NOMINAL_RETRO;
    }
    
    return thrust;
};

Ship.prototype.applyAccel = function (accelX, accelY, du) {
    
    // u = original velocity
    var oldVelX = this.velX;
    var oldVelY = this.velY;
    
    // v = u + at
    this.velX += accelX * du;
    this.velY += accelY * du; 

    // v_ave = (u + v) / 2
    var aveVelX = (oldVelX + this.velX) / 2;
    var aveVelY = (oldVelY + this.velY) / 2;
    
    // Decide whether to use the average or not (average is best!)
    var intervalVelX = g_useAveVel ? aveVelX : this.velX;
    var intervalVelY = g_useAveVel ? aveVelY : this.velY;
    
    // s = s + v_ave * t
    var nextX = this.cx + intervalVelX * du;
    var nextY = this.cy + intervalVelY * du;
    
    // bounce
    if (g_useGravity) {

	var minY = g_sprites.ship.height / 2;
	var maxY = g_canvas.height - minY;

	// Ignore the bounce if the ship is already in
	// the "border zone" (to avoid trapping them there)
	if (this.cy > maxY || this.cy < minY) {
	    // do nothing
	} else if (nextY > maxY || nextY < minY) {
            this.velY = oldVelY * -0.9;
            intervalVelY = this.velY;
        }
    }
    
    // s = s + v_ave * t
    this.cx += du * intervalVelX;
    this.cy += du * intervalVelY;
};

// When timer is more than 200 we can fire bullets
Ship.prototype.reloadTime = 200 / NOMINAL_UPDATE_INTERVAL;
// We start with being able to fire
Ship.prototype.elapsedReloadingTime = 200 / NOMINAL_UPDATE_INTERVAL;

// If 200ms have passed since last bullet, another bullet can be fired
Ship.prototype.reloadingBullet = function(du) {
    if(this.elapsedReloadingTime >= this.reloadTime && keys[this.KEY_FIRE]) {
        this.elapsedReloadingTime = 0;
        return true;
    }
    return false;
};

Ship.prototype.maybeFireBullet = function (du) {
    this.elapsedReloadingTime += du;
    var launchDist = this.getRadius() * 1.2;
    
    var relVel = this.launchVel;
    var relVelX = relVel;
    var relVelY = 0;

    //Need to make sure we cant spam bullets, also if we are charging laser
    //we cannot fire bullets
    if (this.reloadingBullet(du) && !this.isChargingLaser()) {
        entityManager.fireBullet(
           this.cx + launchDist, this.cy,
           relVelX, relVelY,
           0
        );
		//Shoot powerups if activated
		if(this.powerUps.blue == true){
			var blueSpeed = Math.sqrt(this.speed*this.speed * 2)
			entityManager.fireLaserBullet(
				this.cx + launchDist, this.cy+this.getRadius(),
				blueSpeed,blueSpeed,
				0.25*Math.PI
			);
			entityManager.fireLaserBullet(
				this.cx + launchDist, this.cy-this.getRadius(),
				blueSpeed,-blueSpeed,
				1.75*Math.PI
			);
		}
        this.chargeLaser(du);
    } 
    //Laser has been charging and space has been released = fire laser
    else if( this.isChargingLaser() && !keys[this.KEY_FIRE] ) {
        entityManager.fireLaser(
           this.cx + launchDist, this.cy,
           relVelX, relVelY,
           0,
           this.laserCharge
        );
        this.unchargeLaser();
    }
    //Still holding space since last bullet was fired, we are charging laser
    else if(keys[this.KEY_FIRE]) {
        this.chargeLaser(du);
    } 
    else {
        this.unchargeLaser();
    }
};

Ship.prototype.isChargingLaser = function() {
    return this.laserCharge > this.reloadTime ;
};

Ship.prototype.chargeLaser = function(du) {
    this.laserCharge += du;
    if( this.isChargingLaser() ){
        this.playChargingAnimation(du)
    }
};

Ship.prototype.unchargeLaser = function() {
    this.laserCharge = 0;
};

Ship.prototype.chargeSprite = 0;
Ship.prototype.playChargingAnimation = function(du) {
    this.chargeSprite = (this.chargeSprite + 1) % 8;
};




Ship.prototype.setSpeed = function (x){
	this.speed = x;
};


Ship.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Ship.prototype.takePowerUp = function (powerUp) {
    if(powerUp == "Blue"){
		this.powerUps.blue = true;
	}
	if(powerUp == "Speed"){
		this.setSpeed(5);
	}
	if(powerUp == "Red"){
		this.powerUps.red = true;
	}
};

Ship.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
    
    this.halt();
};

Ship.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

var NOMINAL_ROTATE_RATE = 0.1;

Ship.prototype.updateRotation = function (du) {
    if (keys[this.KEY_LEFT]) {
        this.rotation -= NOMINAL_ROTATE_RATE * du;
    }
    if (keys[this.KEY_RIGHT]) {
        this.rotation += NOMINAL_ROTATE_RATE * du;
    }
};

Ship.prototype.drawShield = function(ctx){
	var grd=ctx.createRadialGradient(this.cx,this.cy,0,this.cx,this.cy,this.getRadius());
	grd.addColorStop(0,"rgba(0, 0, 255, 0.5)");
	grd.addColorStop(1,"rgba(255, 255, 255, 0.5)");
	ctx.beginPath();
	ctx.arc(this.cx, this.cy, this.getRadius()+3, 0, Math.PI * 2);
	ctx.stroke();
	ctx.fillStyle = grd;
	ctx.fill();
};

Ship.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
	
	if(this.powerUps.red == true){
		this.drawShield(ctx);
	}
	
    this.sprites[this.spriteIndex].drawWrappedCentredAt(
       ctx, this.cx, this.cy, this.rotation
    );

    g_sprites.enemy1[0].drawWrappedCentredAt(ctx, 50, 50, 0);

    // if( !this.notChargingLaser() ) {
    //     g_sprites.laserCharge[this.chargeSprite].drawWrappedCentredAt(
    //         ctx, this.cx+this.sprite.width, this.cy, this.rotation
    //     );
    // }

    if( this.isChargingLaser() ) {
        g_animatedSprites.laserCharge.cycleAnimationAt(ctx, this.cx+this.sprite.width, this.cy);
    }
    // g_sprites.deathExplosion.cycleAnimationAt(ctx, 50, 50);
    this.sprite.scale = origScale;
};
