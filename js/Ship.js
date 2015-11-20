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
Ship.prototype.powerUps = {blue : 0, red : 0, missile : 1, speed : 0};

// HACKED-IN AUDIO (no preloading)
Ship.prototype.warpSound = new Audio(
    "sounds/Wobwobwob.ogg");
Ship.prototype.lazerSound = new Audio (
	"sounds/Lazer2.ogg");
	
Ship.prototype.warp = function () {

    this._isWarping = true;
    this._scaleDirn = -1;
    if(!MUTE) this.warpSound.play();
    
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
        this.powerUps.red = 1;
        
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
    
        var warpDistance = Math.random() * 100;
        var warpDirn = Math.random() * consts.FULL_CIRCLE;
        
        this.cx = warpDistance * Math.abs(Math.sin(warpDirn));
        this.cy = g_canvas.height/2 + Math.cos(warpDirn)*50;
        
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

    this.nextTest();
    // Handle warping
    if (this._isWarping) {
        this._updateWarp(du);
        return;
    }
    
    // Unregister and check for death
    spatialManager.unregister(this);
    if( this._isDeadNow ) {
		this.resetPowerUps();
        return entityManager.KILL_ME_NOW;
    }


    // Perform movement substeps
    var steps = this.numSubSteps;
    var dStep = du / steps;
    for (var i = 0; i < steps; ++i) {
        this.computeSubStep(dStep);
    }

    // Handle firing
	this.calcMissileReload();
    this.maybeFireBullet(du);

    // Handle collision
	var collision = this.isColliding();
	if(collision){
		if(collision.type != "PowerUp" && this.powerUps.red == 0) {
			if(--this.lives === 0) return entityManager.KILL_ME_NOW;
                this.warp();
                entityManager.clearBullets();
		}else if(collision.type == "PowerUp"){
			this.takePowerUp(collision.getPower());
		}else if(this.powerUps.red > 0){
			this.usedShield = true;
		}
	}else {
		if(this.usedShield == true){
			this.usedShield = false;
			this.powerUps.red -= 1;
		}
        spatialManager.register(this);
    }

};

Ship.prototype.wallCollision = function(){
	if(--this.lives == 0) this._isDeadNow = true;
	else{
		this.warp();
		entityManager.clearBullets();
	}
}

Ship.prototype.computeSubStep = function (du) {
    var nextX = this.cx;
    var nextY = this.cy;
    if(keys[this.KEY_THRUST]){
		nextX += this.speed * du;
	}
	else if(keys[this.KEY_RETRO]){
		nextX -= this.speed * du;
	}
	if(keys[this.KEY_UPWARD]){
        this.moveUpAnimation();
		nextY -= this.speed * du;
	}
	else if(keys[this.KEY_DOWNWARD]){
        this.moveDownAnimation();
		nextY += this.speed * du;
	}
    else{
        this.spriteIndex = 2;
    }
    this.keepWithinBounds(nextX, nextY);    
};

Ship.prototype.moveUpAnimation = function() {
    this.spriteIndex = 4;
};

Ship.prototype.moveDownAnimation = function() {
    this.spriteIndex = 0;
};

Ship.prototype.keepWithinBounds = function(nextX, nextY) {
    this.cx = util.boundary(this.sprite.width/2, nextX, 0, g_canvas.width); 
    this.cy = util.boundary(this.sprite.height/2, nextY, 0, g_canvas.height);
};


// When timer is more than 200 we can fire bullets
Ship.prototype.reloadTime = 200 / NOMINAL_UPDATE_INTERVAL;
// We start with being able to fire
Ship.prototype.elapsedReloadingTime = 200 / NOMINAL_UPDATE_INTERVAL;

// If 200ms have passed since last bullet, another bullet can be fired
Ship.prototype.reloadingBullet = function(du) {
    this.elapsedReloadingTime += du;
	// Check if bullet has been reloaded and if space has been released.
    if(this.elapsedReloadingTime >= this.reloadTime && !this.isHoldingTrigger() && keys[this.KEY_FIRE]) {
        this.elapsedReloadingTime = 0;
        return true;
    }
    return false;
};

//Stops ship from shooting bullets when trying to charge laser.
Ship.prototype.didShootLastUpdate = false;
Ship.prototype.isHoldingTrigger = function() {
    if( this.didShootLastUpdate && keys[this.KEY_FIRE] ) {
        return true;
    }
    this.didShootLastUpdate = false;
    return false;
};

Ship.prototype.maybeFireBullet = function (du) {
    var launchDist = this.getRadius() * 1.2;
    
    var relVel = this.launchVel;
    var relVelX = relVel;
    var relVelY = 0;

    //Need to make sure we cant spam bullets, also if we are charging laser
    //we cannot fire bullets
    if (this.reloadingBullet(du) && !this.isChargingLaser()) {
        this.didShootLastUpdate = true;
        entityManager.fireBullet(
           this.cx + launchDist, this.cy,
           relVelX, relVelY,
           0
        );
		//Shoot powerups if activated
		
		if(this.powerUps.blue > 0){
			this.fireBlue(launchDist);
		}
		if(this.powerUps.missile > 0){
			this.fireMissile(launchDist);
		}
        this.chargeLaser(du);
    } 
    //Laser has been charging and space has been released = fire laser
    else if( this.isChargingLaser() && !keys[this.KEY_FIRE] ) {
        if(!MUTE) this.lazerSound.play();
		entityManager.fireLaser(
           this.cx + launchDist*2, this.cy,
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

Ship.prototype.fireBlue = function(launchDist){
	var blueSpeed = Math.sqrt(this.launchVel*this.launchVel * 2)/2
	
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
	
	if(this.powerUps.blue > 1){
		var blueSpeedY = (this.launchVel * Math.sin((22.5*Math.PI)/180))/ Math.sin((90*Math.PI)/180) 
		var blueSpeedX = (this.launchVel * Math.sin((67.5*Math.PI)/180))/ Math.sin((90*Math.PI)/180)
		entityManager.fireLaserBullet(
			this.cx + launchDist, this.cy+this.getRadius()/2,
			blueSpeedX,blueSpeedY,
			0.125*Math.PI
		);
		entityManager.fireLaserBullet(
			this.cx + launchDist, this.cy-this.getRadius()/2,
			blueSpeedX,-blueSpeedY,
			1.875*Math.PI
		);
	}
	if(this.powerUps.blue > 2){
		entityManager.fireLaserBullet(
			this.cx, this.cy+launchDist,
			blueSpeedY,blueSpeedX,
			0.375*Math.PI
		);
		entityManager.fireLaserBullet(
			this.cx, this.cy-launchDist,
			blueSpeedY,-blueSpeedX,
			1.675*Math.PI
		);
	}
};

Ship.prototype.missileReloadTime = 150 / NOMINAL_UPDATE_INTERVAL;
Ship.prototype.missileReloadingDone = 0;
Ship.prototype.fireMissile = function(launchDist){
	if(this.missileReloadTime == this.missileReloadingDone){
		entityManager.fireMissile(
			this.cx+launchDist*2, this.cy,this.powerUps.missile,0
		)
		this.missileReloadingDone = 0;
	}
};

Ship.prototype.calcMissileReload = function(){
	if(this.missileReloadingDone < this.missileReloadTime){
		this.missileReloadingDone += this.powerUps.missile / NOMINAL_UPDATE_INTERVAL;
	}
	if(this.missileReloadingDone > this.missileReloadTime){
		this.missileReloadingDone = this.missileReloadTime;
	}
}

Ship.prototype.laserReloadTime = 500 / NOMINAL_UPDATE_INTERVAL;
Ship.prototype.isChargingLaser = function() {
    return this.laserCharge > this.laserReloadTime ;
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

Ship.prototype.addSpeed = function (x){
		this.speed += x;
};


Ship.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Ship.prototype.takePowerUp = function (powerUp) {
    if(powerUp == "Blue"){
		if(this.powerUps.blue < 3){
			this.powerUps.blue += 1;
		}
	}
	if(powerUp == "Speed"){
		if(this.powerUps.speed < 3){
			this.powerUps.speed += 1;
			this.addSpeed(1);
		}
	}
	if(powerUp == "Red"){
		if(this.powerUps.red < 3){
			this.powerUps.red += 1;
		}
	}
	if(powerUp == "Missile"){
		if(this.powerUps.missile < 3){
			this.powerUps.missile += 1;
		}
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

Ship.prototype.resetPowerUps = function(){
	this.powerUps.blue = 0;
	this.powerUps.red = 0;
	this.powerUps.speed = 0;
	this.powerUps.missile = 0;
}

Ship.prototype.drawShield = function(ctx){
	var shieldColors = ["rgba(255, 0, 0, 0.2)","rgba(0, 255, 0, 0.2)","rgba(0, 0, 255, 0.4)"]
	var red = this.powerUps.red-1;
    
	ctx.save();	
    ctx.translate(this.cx, this.cy);
    ctx.scale(this._scale, this._scale);
    ctx.translate(-this.cx, -this.cy);
	var grd=ctx.createRadialGradient(this.cx,this.cy,0,this.cx,this.cy,this.getRadius());
	grd.addColorStop(0,"rgba(255, 255, 255, 0.5)");
	grd.addColorStop(1, shieldColors[red]);
	ctx.beginPath();
	ctx.arc(this.cx, this.cy, this.getRadius()+3, 0, Math.PI * 2);
	ctx.stroke();
	ctx.fillStyle = grd;
	ctx.fill();
    ctx.restore();
};

Ship.prototype.drawLaserCharge = function(ctx){
		ctx.font = "20px sans-serif";
		ctx.fillStyle = "white";
		ctx.fillText("Charge", g_canvas.width/2-100,570);
		ctx.beginPath();
		ctx.save();
		ctx.strokeStyle = 'white';
		ctx.strokeRect(g_canvas.width/2-30, 555, 120, 20);
		ctx.closePath();
		ctx.restore();
		var charged = this.laserCharge
		if(charged < 30){charged = 0}
		if(charged > 150){charged = 150}
		ctx.fillStyle = "blue";
		if(charged > 30){
			ctx.fillRect(g_canvas.width/2-30, 555, charged-30, 20);
		}
};

Ship.prototype.drawLives = function(ctx){
	for(var i = 0; i < this.lives; i++){
		g_sprites.ship[3].drawCentredAt(ctx, 20+i*40,15,0);
	}
};

Ship.prototype.testindex = 0;
Ship.prototype.nextTest = function(){
    this.testindex = (this.testindex + 1) % g_sprites.boss.length;
};

Ship.prototype.drawPowerUps = function(ctx){
	var radius = 30;
	var x = g_canvas.width/2 + 140
	var y = g_canvas.height-35
	ctx.save();
	ctx.line = 5;
	
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2);
	ctx.strokeStyle = "Blue"
	ctx.stroke();
	
	ctx.beginPath();
	ctx.arc(x+(radius+5)*2, y, radius, 0, Math.PI * 2);
	ctx.strokeStyle = "Red"
	ctx.stroke();
	
	ctx.beginPath();
	ctx.arc(x+(radius+5)*4, y, radius, 0, Math.PI * 2);
	ctx.strokeStyle = "Grey"
	ctx.stroke();
	
	ctx.beginPath();
	ctx.arc(x+(radius+5)*6, y, radius, 0, Math.PI * 2);
	ctx.strokeStyle = "Yellow"
	ctx.stroke();
	
	ctx.font = "40px sans-serif";
	ctx.fillStyle = "white";
	
	ctx.fillText(this.powerUps.blue, x-11,y+13);
	ctx.fillText(this.powerUps.red, x+(radius+5)*2-11,y+13);
	ctx.fillText(this.powerUps.speed, x+(radius+5)*4-11,y+13);
	ctx.fillText(this.powerUps.missile, x+(radius+5)*6-11,y+13);
	ctx.restore();
}

Ship.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprites[this.spriteIndex].scale = this._scale;
	
	if(this.powerUps.red > 0){
		this.drawShield(ctx);
	}
	
    this.sprites[this.spriteIndex].drawWrappedCentredAt(
       ctx, this.cx, this.cy, this.rotation
    );

	this.drawLaserCharge(ctx);
	this.drawLives(ctx);
	this.drawPowerUps(ctx);
	
    if( this.isChargingLaser() ) {
        g_animatedSprites.laserCharge.cycleAnimationAt(ctx, this.cx+this.sprite.width, this.cy);
    }
    // g_sprites.bossBullet.drawCentredAt(ctx, 500, 250, 0);
    // g_sprites.boss[this.testindex].drawCentredAt(ctx, 300, 200, 0);

    this.sprite.scale = origScale;
};
