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
Boss.prototype.spriteIndex = 0;

Boss.prototype.deadSound = new Audio (
	"sounds/rtypeDie.ogg");
Boss.prototype.fireSound = new Audio (
	"sounds/Lazer3.ogg");

Boss.prototype.playSounds = function () {
		this.fireSound.volume = 0.3;
		this.fireSound.play();
};

Boss.prototype.update = function (du) {
    this.lifeTime += du;
    // Unregister and check for death
    spatialManager.unregister(this);
    if( this._isDeadNow ) {
        return entityManager.KILL_ME_NOW;
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
Boss.prototype.spriteIncrement = 1;
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
        if(this.spriteIndex == 4){ this.spriteIncrement = 1;}
        else if(this.spriteIndex == 7){ this.spriteIncrement = -1;}
        this.spriteIndex += this.spriteIncrement;
        this.elapsedDelay = 0;
    }
};

Boss.prototype.fetusDelay = 100 / NOMINAL_UPDATE_INTERVAL;
Boss.prototype.runFetusPhase = function(du) {
    this.elapsedDelay += du;
    if(this.elapsedDelay > this.fetusDelay){
        this.spriteIndex += 1;
        this.elapsedDelay = 0;
    }
    if(this.spriteIndex === this.sprite.length){
        this.spriteIndex = 24;
        this.currentPhase = "figthingPhase";
    }
};
Boss.prototype.runFigthingPhase = function(du) {
   // Handle firing
    this.maybeFireBullet(du);
    this.runFetusFightingAnimation(du);
    spatialManager.register(this);
};

Boss.prototype.fetusBulletDelay = 5000 / NOMINAL_UPDATE_INTERVAL;
Boss.prototype.elapsedDelayBetweenFetusBullets = 0;
Boss.prototype.runFetusFightingAnimation = function(du) {
    this.elapsedDelayBetweenFetusBullets += du;
    if(this.elapsedDelayBetweenFetusBullets > this.fetusBulletDelay){
        this.elapsedDelayBetweenFetusBullets = 0;
    }
};

Boss.prototype.takeBulletHit = function(damage) {

    var currentLives = this.lives;
    this.lives -= damage;
    var damageDealt = currentLives - Math.max(this.lives, 0);

    if(this.lives <= 0) {
		Score.addScore(500);
		this.deadSound.play();
        this.kill();
        entityManager.createBigExplosion({
            cx    : this.cx, 
            cy    : this.cy,
            scale : this.scale*2,
            sprites : g_sprites.bigDeathExplosion
        });
    } else {
		this.deadSound.play();
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

    this.sprite[this.spriteIndex].drawCentredAt(
       ctx, this.cx, this.cy, this.rotation
    );
};
