// ==========
// Enemy STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Boss(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Set normal drawing scale
    this._scale = 1;
};

Boss.prototype = new Entity();

// Initial, inheritable, default values
Boss.prototype.rotation = 0;
Boss.prototype.cx = 200;
Boss.prototype.velX = -1;
Boss.prototype.velY = 0;
Boss.prototype.numSubSteps = 1;
Boss.prototype.lives = 150;
Boss.prototype.lifeTime = 0;
Boss.prototype.shootingSpeed = 5;
Boss.prototype.spriteIndex = 4;

Boss.prototype.deadSound = new Audio (
	"sounds/rtypeDie.ogg");
Boss.prototype.fireSound = new Audio (
	"sounds/Lazer3.ogg");

Boss.prototype.playSounds = function () {
		this.fireSound.volume = 0.3;
		if(!MUTE) this.fireSound.play();
};

Boss.prototype.update = function (du) {
    this.lifeTime += du;
    // Unregister and check for death
    spatialManager.unregister(this);
    if( this._isDeadNow ) {
        return entityManager.KILL_ME_NOW;
    }

    if(this.shouldFlash){
        this.playFlashAnimation(du);
    }

    this.handlePhase(du);
};

Boss.prototype.inPosition = function() {
    return this.cx+this.width/2 < g_canvas.width;
};

Boss.prototype.currentPhase = "entrancePhase";
Boss.prototype.handlePhase = function(du) {
    if(this.currentPhase === "entrancePhase"){
        this.runEnteringPhase(du);
    }
    else if(this.currentPhase === "fetusPhase"){
        this.runFetusPhase(du);
    }
    else if(this.currentPhase === "figthingPhase"){
        this.runFigthingPhase(du);
    }
};


Boss.prototype.entranceDelay = 400 / NOMINAL_UPDATE_INTERVAL;
Boss.prototype.elapsedDelay = 0;
Boss.prototype.spriteIncrement = -1;
Boss.prototype.runEnteringPhase = function(du) {
    if( !this.inPosition() ) {
        this.cx += this.velX*du;
    }
    
    this.runEntranceAnimation(du);
    
    if(this.lifeTime > 5000/NOMINAL_UPDATE_INTERVAL){
        this.currentPhase = "fetusPhase";
        this.spriteIndex = 8;
    }
};

Boss.prototype.runEntranceAnimation = function(du) {
    this.elapsedDelay += du;
    if(this.elapsedDelay > this.entranceDelay){
        if(this.spriteIndex === 4 || this.spriteIndex === 7){ 
            this.spriteIncrement *= -1;}
        this.spriteIndex += this.spriteIncrement;
        this.elapsedDelay = 0;
    }
};

Boss.prototype.fetusPhaseDelay = 100 / NOMINAL_UPDATE_INTERVAL;
Boss.prototype.runFetusPhase = function(du) {
    this.elapsedDelay += du;
    if(this.elapsedDelay > this.fetusPhaseDelay){
        this.spriteIndex += 1;
        this.elapsedDelay = 0;
    }
    if(this.spriteIndex === this.sprite.length){
        this.spriteIndex = 24;
        this.spriteIncrement = -4;
        this.currentPhase = "figthingPhase";
    }
};

Boss.prototype.runFigthingPhase = function(du) {
   // Handle firing
    this.maybeFireBullet(du);
    this.runFetusFightingAnimation(du);
    spatialManager.register(this);
};

Boss.prototype.fetusAnimationDelay = 3000 / NOMINAL_UPDATE_INTERVAL;
Boss.prototype.elapsedFetusAnimationDelay = 0;
Boss.prototype.runFetusFightingAnimation = function(du) {
    this.elapsedFetusAnimationDelay += du;
    if(this.elapsedFetusAnimationDelay > this.fetusAnimationDelay){
        if(this.spriteIndex === 24 || this.spriteIndex === 32){
            this.spriteIncrement *= -1;
        }
        this.spriteIndex += this.spriteIncrement;
        this.elapsedFetusAnimationDelay = 0;
        if(this.spriteIndex === 32){
            this.isFetusFiring = true;
        }
    }
    if(this.isFetusFiring){
        this.fetusFire(du);        
    }
};

Boss.prototype.fetusFireDelay = 100 / NOMINAL_UPDATE_INTERVAL;
Boss.prototype.elapsedFetusFireDelay = 100;
Boss.prototype.totalFetusShots = 0;
Boss.prototype.fetusFire = function(du) {
    this.elapsedFetusFireDelay += du;
    if(this.elapsedFetusFireDelay > this.fetusFireDelay){
        entityManager.fireEnemyBullet(
           this.cx, this.cy+5,
            -7, 
            0,
           this.rotation
        );
        this.elapsedFetusFireDelay = 0;
        this.totalFetusShots++;
    }
    if(this.totalFetusShots === 10){
        this.isFetusFiring = false;
        this.totalFetusShots = 0;
    }
};

Boss.prototype.flashTimer = 0;
Boss.prototype.alphaIndex = 1;
Boss.prototype.playFlashAnimation = function(du){
    this.flashTimer += du;
    this.alphaIndex = Math.random() * 0.5 + 0.25;
    if(this.flashTimer > 1000 / NOMINAL_UPDATE_INTERVAL){
        this.alphaIndex = 1;
        this.flashTimer = 0;
        this.shouldFlash = false;
    }
};

Boss.prototype.shouldFlash = false;
Boss.prototype.takeBulletHit = function(damage) {
    this.shouldFlash = true;

    var currentLives = this.lives;
    this.lives -= damage;
    var damageDealt = currentLives - Math.max(this.lives, 0);

    if(this.lives <= 0) {
		Score.addScore(500);
		if(!MUTE) this.deadSound.play();
        this.kill();
        entityManager.createBigExplosion({
            cx    : this.cx, 
            cy    : this.cy,
            scale : this.scale*5,
            sprites : g_sprites.bigDeathExplosion
        });
    } else {
		if(!MUTE) this.deadSound.play();
        entityManager.createExplosion({
            cx    : this.cx, 
            cy    : this.cy,
            scale : this.scale,
            sprites : g_sprites.deathExplosion
        });
    }

    return damageDealt;
};

Boss.prototype.delayBetweenBullets = 2000 / NOMINAL_UPDATE_INTERVAL;
Boss.prototype.elapsedDelayBetweenBullets = 0;
Boss.prototype.maybeFireBullet = function (du) {
    this.elapsedDelayBetweenBullets += du;
    if(this.elapsedDelayBetweenBullets > this.delayBetweenBullets) {
        this.elapsedDelayBetweenBullets = 0;
        var launchDeg = this.getLaunchDeg();
        var launchDist = this.getRadius() * 2;
		for(var i= 0; i < 26; i++){
			this.playSounds();
            var xspeed = -this.shootingSpeed  *  Math.cos( (launchDeg-i)*Math.PI/180 );
            var yspeed =  this.shootingSpeed  *  Math.sin( (launchDeg-i)*Math.PI/180 );
            entityManager.fireEnemyBullet(
               this.cx - launchDist, this.cy-25,
                xspeed, 
                yspeed,
               this.rotation
            );
        }
    }
};

Boss.prototype.getLaunchDeg = function() {
    var random = Math.random() * 3;
    if(random < 1) return -13;
    if(random < 2) return 13;
    return 39;
}

Boss.prototype.getRadius = function () {
    return 20;
};

Boss.prototype.render = function (ctx) {
    ctx.save();
    ctx.globalAlpha = this.alphaIndex;
    this.sprite[this.spriteIndex].drawCentredAt(
       ctx, this.cx, this.cy, this.rotation
    );
    ctx.restore();
};
