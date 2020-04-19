"use strict";

// Game class
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.centerCanvas();
    }
  
    update() {

    }
  
    render() {
        // river
        background(clr[3]);     // river -> blue
    }

    centerCanvas() {
        var xx = (windowWidth - width) / 2;
        var yy = (windowHeight - height) / 2;
        this.canvas.position(xx, yy);
    }
}
