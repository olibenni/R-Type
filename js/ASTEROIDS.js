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
		sprite : g_sprites.ship[2],
        sprites : g_sprites.ship
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


var KEY_MIXED   = keyCode('L');
var KEY_GRAVITY = keyCode('G');
var KEY_AVE_VEL = keyCode('V');
var KEY_SPATIAL = keyCode('X');

var KEY_HALT  = keyCode('H');
var KEY_RESET = keyCode('R');

var KEY_0 = keyCode('0');

var KEY_1 = keyCode('1');
var KEY_2 = keyCode('2');

var KEY_K = keyCode('K');

var PLAY_AGAIN = keyCode('T');
var MUTE_KEY = keyCode('M');

function processDiagnostics() {

    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_GRAVITY)) g_useGravity = !g_useGravity;

    if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_HALT)) entityManager.haltShips();

    if (eatKey(KEY_RESET)) entityManager.resetShips();

    if (eatKey(KEY_0)) entityManager.toggleRocks();

    /*if (eatKey(KEY_1)) entityManager.generateShip({
        cx : g_mouseX,
        cy : g_mouseY,
        
        sprite : g_sprites.ship[2],
        sprites : g_sprites.ship
    });*/

    if (eatKey(KEY_K)) entityManager.killNearestShip(
        g_mouseX, g_mouseY);
	
	if(eatKey(PLAY_AGAIN) && entityManager.isPlayerDead()) {
        entityManager.playAgain();
        entityManager.gameHasStarted = true;
    }
	if(eatKey(MUTE_KEY)){
		MUTE = !MUTE;
	} 

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
        sheet1  : "./images/r-typesheet1.gif",
        sheet3  : "./images/r-typesheet3.gif",
        sheet5  : "./images/r-typesheet5.gif",
		sheet8	: "./images/r-typesheet8.gif",
        sheet10 : "./images/r-typesheet10.gif",
        sheet16 : "./images/r-typesheet16.gif",
        sheet30 : "./images/r-typesheet30.gif",
        sheet43 : "./images/r-typesheet43.gif",
		sheet44 : "./images/r-typesheet44.gif",
        rock    : "./images/rock.png",
		starField: "./images/starfield2.png",
		wall 	: "./images/wall.png",
		missile : "./images/missile.png"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};
var g_animatedSprites = {};

function preloadDone() {

    createSprites(g_images, g_sprites, g_animatedSprites);


    entityManager.init();
    //createInitialShips();

    main.init();
}

// Kick it off
requestPreloads();