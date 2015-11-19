var Score = {
	score: 0,
	music: new Audio("sounds/CoinDrop.ogg"),
	
	addScore : function(x) {
		this.music.volume = 0.3;
		if(!MUTE) this.music.play();
		this.score += x;
	},

	render : function(ctx) {
		ctx.font = '20px sans-serif';
		ctx.fillStyle = 'white';
		ctx.fillText("Score: " + this.score, g_canvas.width - 200, g_canvas.height - 578);
	}

}
