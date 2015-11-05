/**
 * This class is purely for sprites that are off the same size and
 * are only used as animation but not an object that can interact with anything.
 * Examples: chargeup laser animation, death explosions etc
 * @param {Image} image
 * @param {Number} sx    Start of the first sprite x pos
 * @param {Number} sy    Start of the first sprite y pos
 * @param {Number} sw    width of each sprite in the animation
 * @param {Number} sh    height of each sprite in the animation
 * @param {Number} delay some delay between sprite change
 * @param {Number} count number of sprites in the animation
 */
function AnimationSprite(image, sx, sy, sw, sh, delay, count) {
    this.image = image;
    this.sx = sx;
    this.sy = sy;
    this.sw = sw;
    this.sh = sh;
    this.delay = delay;
    this.count = count;
};

AnimationSprite.prototype.animationIndex = 0;
AnimationSprite.prototype.elapsedDelay = 0;
AnimationSprite.prototype.cycleAnimationAt = function(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    ctx.drawImage(
    	this.image, 
    	this.sx + this.sw*this.animationIndex, 
    	this.sy, 
    	this.sw, 
    	this.sh,
        -this.sw/2, 
        -this.sh/2, 
        this.sw, 
        this.sh
     );

    if( this.elapsedDelay >= this.delay ) {
    	this.elapsedDelay = 0;
    	this.animationIndex = (this.animationIndex + 1) % this.count;
    } else {
    	this.elapsedDelay++;
    }
    
    ctx.restore();
};