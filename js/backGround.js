function backGround(descr) {
	this.setup(descr);
	
	this.sprite = this.sprite || g_sprites.starField;
	this.scale = this.scale || 1;
};

backGround.prototype = new Entity();

backGround.prototype.speed = 1;
backGround.prototype.cx = 0;
backGround.prototype.cy = 0;
backGround.prototype.rotation = 0;

backGround.prototype.update = function(du) {
	// move the background backward
	this.cx -= this.speed;

	if(this.cx <= 0) {
		this.cx = g_canvas.width;
	}
};
 
backGround.prototype.render = function(ctx) {
	this.sprite.drawWrappedCentredAt(
	ctx, this.cx, this.cy, this.rotation);
};