function createSprites(images, sprites, animatedSprites) {
	sprites.test = new Sprite(images.sheet1);

    // When ship is moving up and down
    sprites.ship = [];
    sprites.rock  = new Sprite(images.rock);
    sprites.laserCharge = [];
    sprites.deathExplosion = [];
    sprites.bigDeathExplosion = [];
    sprites.enemy1 = [];
	sprites.enemy2 = new Sprite(images.sheet8, 6, 5, 24, 25);
    sprites.enemy3 = [];
    sprites.boss = [];
	sprites.missile = new Sprite(images.missile,0,0,2105,555);
	sprites.missile.scale = 0.015;
    sprites.enemyBullet = new Sprite(images.sheet43, 135, 5, 8, 7);
    sprites.fetusBossBullet = new Sprite(images.sheet30, 575, 2061, 23, 23);
    animatedSprites.laserCharge = new AnimationSprite(images.sheet1, 0, 51, 33.25, 32, 0, 8);
    animatedSprites.laser = []; 
    sprites.laser = new Sprite(images.sheet1, 200, 120, 32.5, 12);
	sprites.powerUp = new Sprite(images.sheet3, 153, 1, 17, 16);
	sprites.starField = new Sprite(images.starField);
	sprites.wall = new Sprite(images.wall, 0, 0, 64, 23);
	sprites.wall.scale = 1.6;
    
	
    for(var i = 100; i <= 233; i+= 33.25){
        sprites.ship.push(new Sprite(images.sheet1, i, 2, 33.25, 15));
    }

    for(var i = 0; i <= 266; i += 33.25){
        sprites.laserCharge.push(new Sprite(images.sheet1, i, 51, 33.25, 32));
    }

    for(var col = 2; col < 1915; col+= 212.666) {    
        for(var row = 27; row < 668; row+= 162){
            sprites.boss.push(new Sprite(images.sheet30, row, col, 162, 212.666));
        }
    }

    animatedSprites.laser.push(new AnimationSprite(images.sheet1, 200, 120, 33, 12, 10, 2));
    animatedSprites.laser.push(new AnimationSprite(images.sheet1, 168, 135, 48, 15, 10, 2 ));
    animatedSprites.laser.push(new AnimationSprite(images.sheet1, 136, 153, 64, 15, 10, 2 ));
    animatedSprites.laser.push(new AnimationSprite(images.sheet1, 104, 170, 80, 16, 10, 2 ));

    sprites.enemy1.push(new Sprite(images.sheet5, 5, 2, 21, 25));
    sprites.enemy1.push(new Sprite(images.sheet5, 37, 2, 21, 25));
    sprites.enemy1.push(new Sprite(images.sheet5, 70, 2, 21, 25));
    sprites.enemy1.push(new Sprite(images.sheet5, 103, 2, 21, 25));
    sprites.enemy1.push(new Sprite(images.sheet5, 137, 2, 21, 25));
    sprites.enemy1.push(new Sprite(images.sheet5, 169, 2, 21, 25));
    sprites.enemy1.push(new Sprite(images.sheet5, 203, 2, 21, 25));
    sprites.enemy1.push(new Sprite(images.sheet5, 236, 2, 21, 25));

    sprites.enemy3.push(new Sprite(images.sheet10, 1, 5, 31, 25));
    sprites.enemy3.push(new Sprite(images.sheet10, 34, 5, 31, 25));
    sprites.enemy3.push(new Sprite(images.sheet10, 67, 5, 31, 25));
    sprites.enemy3.push(new Sprite(images.sheet10, 100, 5, 31, 25));
    sprites.enemy3.push(new Sprite(images.sheet10, 133, 5, 31, 25));
    sprites.enemy3.push(new Sprite(images.sheet10, 166, 5, 31, 25));
    sprites.enemy3.push(new Sprite(images.sheet10, 167, 35, 27, 25));

    sprites.deathExplosion.push(new Sprite(images.sheet1, 267, 304, 19, 16));
    sprites.deathExplosion.push(new Sprite(images.sheet1, 217, 300, 27, 21));
    sprites.deathExplosion.push(new Sprite(images.sheet1, 182, 296, 32, 27));
    sprites.deathExplosion.push(new Sprite(images.sheet1, 146, 295, 32, 29));
    sprites.deathExplosion.push(new Sprite(images.sheet1, 108, 295, 31, 31));
    sprites.deathExplosion.push(new Sprite(images.sheet1, 71, 295, 33, 31));

    sprites.bigDeathExplosion.push(new Sprite(images.sheet16, 145, 46, 23, 22));
    sprites.bigDeathExplosion.push(new Sprite(images.sheet16, 113, 43, 27, 25));
    sprites.bigDeathExplosion.push(new Sprite(images.sheet16, 81, 41, 27, 28));
    sprites.bigDeathExplosion.push(new Sprite(images.sheet16, 43, 37, 29, 31));

    sprites.bullet = new Sprite(images.sheet1, 248,88,17,6);
    sprites.bullet.scale = 1;
}