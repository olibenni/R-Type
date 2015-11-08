function createSprites(images, sprites, animatedSprites) {
	sprites.test = new Sprite(images.sheet1);

    // When ship is moving up and down
    sprites.ship = [];
    sprites.rock  = new Sprite(images.rock);
    sprites.laserCharge = [];
    sprites.deathExplosion = [];
    sprites.starField = new Sprite(images.starField);
    sprites.enemy1 = [];
    animatedSprites.laserCharge = new AnimationSprite(images.sheet1, 0, 51, 33.25, 32, 0, 8);
    animatedSprites.laser = new AnimationSprite(images.sheet1, 200, 120, 32.5, 12, 10, 2);
	

    for(var i = 100; i <= 233; i+= 33.25){
        sprites.ship.push(new Sprite(images.sheet1, i, 2, 33.25, 15));
    }

    for(var i = 0; i <= 266; i += 33.25){
        sprites.laserCharge.push(new Sprite(images.sheet1, i, 51, 33.25, 32));
    }

    for(var i = 5; i <= 257; i+= 21){
    	sprites.enemy1.push(new Sprite(images.sheet5, i, 5, 21, 25));
    }

    sprites.deathExplosion.push(new Sprite(images.sheet1, 267, 304, 19, 16));
    sprites.deathExplosion.push(new Sprite(images.sheet1, 217, 300, 27, 21));
    sprites.deathExplosion.push(new Sprite(images.sheet1, 182, 296, 32, 27));
    sprites.deathExplosion.push(new Sprite(images.sheet1, 146, 295, 32, 29));
    sprites.deathExplosion.push(new Sprite(images.sheet1, 108, 295, 31, 31));
    sprites.deathExplosion.push(new Sprite(images.sheet1, 71, 295, 33, 31));

    sprites.bullet = new Sprite(images.sheet1, 248,88,17,6);
    sprites.bullet.scale = 1;
}