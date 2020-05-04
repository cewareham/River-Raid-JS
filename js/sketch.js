"use strict";

let game, ASSETS = {};

function preload() {
    ASSETS.fntCB = loadFont('assets/Cooper Black Regular.ttf');
    //soundFormats('wav');
    // loading sounds requires localhost -OR- Chrome web server!
    // Chrome with file access flag does not work
    ASSETS.sndVoo0 = loadSound('assets/voo0.wav');
    ASSETS.sndVoo1 = loadSound('assets/voo1.wav');
    ASSETS.sndVoo2 = loadSound('assets/voo2.wav');
    ASSETS.sndGas0 = loadSound('assets/gaz0.wav');
    ASSETS.sndGas1 = loadSound('assets/gaz1.wav');
    ASSETS.sndShot = loadSound('assets/tiro.wav');
    ASSETS.sndGas_end = loadSound('assets/gaz_end.wav');
    ASSETS.sndGas_alert = loadSound('assets/gaz_alert.wav');
    ASSETS.sndGas_explode = loadSound('assets/gaz_explode.wav');
    ASSETS.sndS_explode = loadSound('assets/explode.wav');
}

function setup() {
    let canvas = createCanvas(800, 600);
    game = new Game(canvas);
}

function draw() {
    game.update();
    game.render();
}

// center the canvas whenever the browser changes size
function windowResized() {
    game.centerCanvas();
}
