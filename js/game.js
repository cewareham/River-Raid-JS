"use strict";

// Game class
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.game = false;
        this.goout = false;
        // define shapes - easier than using #s
        this.eShape = {
            PLANE: 0, PLANE_LEFT: 1, PLANE_RIGHT: 2, HELI_RIGHT0: 3, HELI_RIGHT1: 4,
            HELI_LEFT0: 5, HELI_LEFT1: 6, SHIP_RIGHT: 7, SHIP_LEFT: 8, AIRPLANE_E: 9,
            AIRPLANE_D: 10, FUEL: 11, EXPL1:12, EXPL2: 13, HOME: 14
        }
        this.centerCanvas();
        //                      x   y width height  shape#        out expl
        this.plane = new Shape(370, 420, 49, 42, this.eShape.PLANE, 0, 0);
    }
  
    update() {

    }
  
    render() {
        // river
        background(clr[3]);     // river -> blue

        this.plane.show();
    }

    centerCanvas() {
        var xx = (windowWidth - width) / 2;
        var yy = (windowHeight - height) / 2;
        this.canvas.position(xx, yy);
    }
}
