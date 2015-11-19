/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA
_tiles		: [],
_bg 		: [],
_rocks      : [],
_bullets    : [],
_ships      : [],
_enemies    : [],
_animations : [],
_powerups	: [],

_bShowRocks : true,

// "PRIVATE" METHODS
_generateTiles : function () {
	this.generateTile();
},

_generateBgs : function() {
	this.generateBg();
},

_generateRocks : function() {
    var i,
        NUM_ROCKS = 0;

    for (i = 0; i < NUM_ROCKS; ++i) {
        this.generateRock();
    }
},

_findNearestShip : function(posX, posY) {
    var closestShip = null,
        closestIndex = -1,
        closestSq = 1000 * 1000;

    for (var i = 0; i < this._ships.length; ++i) {

        var thisShip = this._ships[i];
        var shipPos = thisShip.getPos();
        var distSq = util.wrappedDistSq(
            shipPos.posX, shipPos.posY, 
            posX, posY,
            g_canvas.width, g_canvas.height);

        if (distSq < closestSq) {
            closestShip = thisShip;
            closestIndex = i;
            closestSq = distSq;
        }
    }
    return {
        theShip : closestShip,
        theIndex: closestIndex
    };
},

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._bg, this._tiles, this._rocks, this._bullets, this._ships, this._enemies, this._animations, this._powerups];
},

init: function() {	
	this._generateBgs();
    this._generateRocks();
	this._generateTiles();
    //this._generateShip();
},

fireEnemyBullet: function(cx, cy, velX, velY, rotation) {
    this._bullets.push(new EnemyBullet({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,
        rotation : rotation
    }));
},

fireBullet: function(cx, cy, velX, velY, rotation) {
    this._bullets.push(new Bullet({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,
        rotation : rotation
    }));
},

fireLaserBullet: function(cx, cy, velX, velY, rotation) {
    this._bullets.push(new LaserBullet({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,
        rotation : rotation
    }));
},

fireMissile: function(cx,cy,vel,rotation){
	this._bullets.push(new Missile({
		cx	: cx,
		cy	: cy,
		vel : vel,
		rotation : rotation
	}));
},

fireLaser: function(cx, cy, velX, velY, rotation, charge) {
    this._bullets.push(new Laser({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,
        rotation : rotation,
        charge   : charge
    }));
},

fireFetusBullets: function(cx, cy, velX, velY, rotation) {
    this._bullets.push(new FetusBullet({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,
        rotation : rotation,
    }));    
},

clearBullets: function() {
    this._bullets.forEach(function(bullet){
        bullet.kill();
    });
},

generateTile : function(descr) {
	this._tiles.push(new Tiles(descr));
},

generateBg : function(descr) {
	this._bg.push(new backGround(descr));
},

generateRock : function(descr) {
    this._rocks.push(new Rock(descr));
},

generatePowerUp : function(descr) {
    this._powerups.push(new PowerUp(descr));
},

generateShip : function(descr) {
    this._ships.push(new Ship(descr));
},

generateEnemy : function(descr) {
    this._enemies.push(new Enemy(descr));
},

generateEnemy2 : function(descr) {
    this._enemies.push(new Enemy2(descr));
},

generateEnemy3 : function(descr) {
	this._enemies.push(new Enemy3(descr));
},

generateBoss : function(descr) {
    this._enemies.push(new Boss(descr));
},

createExplosion : function(descr) {
    this._animations.push(new Explosion(descr));
},

createBigExplosion : function(descr) {
    this._animations.push(new BigExplosion(descr));
},

killNearestShip : function(xPos, yPos) {
    var theShip = this._findNearestShip(xPos, yPos).theShip;
    if (theShip) {
        theShip.kill();
    }
},

yoinkNearestShip : function(xPos, yPos) {
    var theShip = this._findNearestShip(xPos, yPos).theShip;
    if (theShip) {
        theShip.setPos(xPos, yPos);
    }
},

resetShips: function() {
    this._forEachOf(this._ships, Ship.prototype.reset);
},

haltShips: function() {
    this._forEachOf(this._ships, Ship.prototype.halt);
},	

toggleRocks: function() {
    this._bShowRocks = !this._bShowRocks;
},

getOneEnemy: function(x) {
	for(var i = 0; i <this._enemies.length; i++){
			if(this._enemies[i].cx > x && this._enemies[i].cx < g_canvas.width){
				return this._enemies[i];
			}
	}
	return -1;
	
},

update: function(du) {

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {

            var status = aCategory[i].update(du);

            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                aCategory.splice(i,1);
            }
            else {
                ++i;
            }
        }
    }
    
    if (this._rocks.length === 0) this._generateRocks();

},

render: function(ctx) {
	
    var debugX = 10, debugY = 100;

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        if (!this._bShowRocks && 
            aCategory == this._rocks)
            continue;

        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);

        }
        debugY += 10;
    }
	
	Score.render(ctx);
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

