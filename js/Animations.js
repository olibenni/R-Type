/**
 * Animation is a class for every animation.
 */
function Animation(descr) {
	this.setup(descr);

	this.scale = this.scale || 1;
};

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
	ctx.save();
	this.sprites[this.spriteNumber].scale = this.scale;
	this.sprites[this.spriteNumber].drawCentredAt(ctx, this.cx, this.cy);
	ctx.restore();
};

function Explosion(descr) {
	this.setup(descr);
};
Explosion.prototype = new Animation();
Explosion.prototype.delay = 100 / NOMINAL_UPDATE_INTERVAL; //Overwrite the delay

function BigExplosion(descr) {
	this.setup(descr);
};

BigExplosion.prototype = new Animation();
BigExplosion.prototype.delay = 100 / NOMINAL_UPDATE_INTERVAL; //Overwrite the delay

function GreaterExplosion(descr) {
	this.setup(descr);
};
GreaterExplosion.prototype = new Animation();
GreaterExplosion.prototype.delay = 100 / NOMINAL_UPDATE_INTERVAL;