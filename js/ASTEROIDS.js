// =========
// ASTEROIDS
// =========
/*

A sort-of-playable version of the classic arcade game.


HOMEWORK INSTRUCTIONS:

You have some "TODO"s to fill in again, particularly in:

spatialManager.js

But also, to a lesser extent, in:

Rock.js
Bullet.js
Ship.js


...Basically, you need to implement the core of the spatialManager,
and modify the Rock/Bullet/Ship to register (and unregister)
with it correctly, so that they can participate in collisions.

Be sure to test the diagnostic rendering for the spatialManager,
as toggled by the 'X' key. We rely on that for marking. My default
implementation will work for the "obvious" approach, but you might
need to tweak it if you do something "non-obvious" in yours.
*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// ====================
// CREATE INITIAL SHIPS
// ====================

function createInitialShips() {

    entityManager.generateShip({
        cx : 200,
        cy : 200,
		sprite : g_sprites.ship2
    });
	
	 entityManager.generatePowerUp({
        cx : 400,
        cy : 200,
		sprite : g_sprites.powerup
    });
    
}

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    
    processDiagnostics();

    entityManager.update(du);
};

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useGravity = false;
var g_useAveVel = true;
var g_renderSpatialDebug = false;

var KEY_MIXED   = keyCode('M');;
var KEY_GRAVITY = keyCode('G');
var KEY_AVE_VEL = keyCode('V');
var KEY_SPATIAL = keyCode('X');

var KEY_HALT  = keyCode('H');
var KEY_RESET = keyCode('R');

var KEY_0 = keyCode('0');

var KEY_1 = keyCode('1');
var KEY_2 = keyCode('2');

var KEY_K = keyCode('K');

function processDiagnostics() {

    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_GRAVITY)) g_useGravity = !g_useGravity;

    if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_HALT)) entityManager.haltShips();

    if (eatKey(KEY_RESET)) entityManager.resetShips();

    if (eatKey(KEY_0)) entityManager.toggleRocks();

    if (eatKey(KEY_1)) entityManager.generateShip({
        cx : g_mouseX,
        cy : g_mouseY,
        
        sprite : g_sprites.ship});

    if (eatKey(KEY_2)) entityManager.generateShip({
        cx : g_mouseX,
        cy : g_mouseY,
        
        sprite : g_sprites.ship2
        });

    if (eatKey(KEY_K)) entityManager.killNearestShip(
        g_mouseX, g_mouseY);
}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {
	
    entityManager.render(ctx);
	
    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        ship   : "https://notendur.hi.is/~pk/308G/images/ship.png",
        sheet1  : "./images/r-typesheet1.gif",
        rock   : "https://notendur.hi.is/~pk/308G/images/rock.png",
		starField: "./images/starfield.png",
		sheet3  : "./images/r-typesheet3.gif"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};
var g_animatedSprites = {};

function preloadDone() {

    g_sprites.test = new Sprite(g_images.sheet1);
    g_sprites.ship  = new Sprite(g_images.ship);
    g_sprites.ship2 = new Sprite(g_images.sheet1, 166, 2, 33, 15);

    // When ship is moving up and down
    g_sprites.ship3 = [];
    for(var i = 100; i <= 233; i+= 33.25){
        g_sprites.ship3.push(new Sprite(g_images.sheet1, i, 2, 33.25, 15));
    }

    g_sprites.rock  = new Sprite(g_images.rock);


    g_sprites.laserCharge = [];
    for(var i = 0; i <= 266; i += 33.25){
        g_sprites.laserCharge.push(new Sprite(g_images.sheet1, i, 51, 33.25, 32));
    }
    g_sprites.deathExplosion = [];
    g_sprites.deathExplosion.push(new Sprite(g_images.sheet1, 267, 304, 19, 16));
    g_sprites.deathExplosion.push(new Sprite(g_images.sheet1, 217, 300, 27, 21));
    g_sprites.deathExplosion.push(new Sprite(g_images.sheet1, 182, 296, 32, 27));
    g_sprites.deathExplosion.push(new Sprite(g_images.sheet1, 146, 295, 32, 29));
    g_sprites.deathExplosion.push(new Sprite(g_images.sheet1, 108, 295, 31, 31));
    g_sprites.deathExplosion.push(new Sprite(g_images.sheet1, 71, 295, 33, 31));

    g_animatedSprites.laserCharge = new AnimationSprite(g_images.sheet1, 0, 51, 33.25, 32, 0, 8);
    g_animatedSprites.laser = new AnimationSprite(g_images.sheet1, 200, 120, 32.5, 12, 10, 2);
	
    g_sprites.bullet = new Sprite(g_images.sheet1, 248,88,17,6);
    g_sprites.bullet.scale = 1;
	
	g_sprites.powerUp = new Sprite(g_images.sheet3, 153, 1, 17, 16);
	
	g_sprites.starField = new Sprite(g_images.starField);
	
    entityManager.init();
    createInitialShips();

    main.init();
}

// Kick it off
requestPreloads();