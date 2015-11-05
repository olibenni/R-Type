/**
 * Animation is a class for every animation.
 */
function Animation() {};

Animation.prototype = new Entity();
Animation.prototype.spriteNumber = 0;
Animation.prototype.delay = 0;
Animation.prototype.elapsedDelay = 0;

Animation.prototype.update = function(du) {
	this.elapsedDelay += du;
	if(this.elapsedDelay >= this.delay) {
		this.elapsedDelay = 0;
		this.spriteNumber++;
	}
	if(this.spriteNumber >= this.sprites.length) {
		return entityManager.KILL_ME_NOW;
	}
};
Animation.prototype.render = function(ctx) {
	this.sprites[this.spriteNumber].drawCentredAt(ctx, this.cx, this.cy);
};

function Explosion(descr) {
	this.setup(descr);
};
Explosion.prototype = new Animation();
Explosion.prototype.delay = 100 / NOMINAL_UPDATE_INTERVAL; //Overwrite the delay

