"use strict";

let game, fntCooperBlack;

function preload() {
    fntCooperBlack = loadFont('assets/Cooper Black Regular.ttf');
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
