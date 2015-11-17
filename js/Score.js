var Score = {
	score: 0,

	addScore : function(x) {
		this.score += x;
	},

	render : function(ctx) {
		ctx.font = '20px sans-serif';
		ctx.fillStyle = 'white';
		ctx.fillText("Score: " + this.score, g_canvas.width - 200, g_canvas.height - 578);
	}

}
