"use strict";

// Game class
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.game = false;
        this.goout = false; // go out (sair)
        this.intro = false;
        this.screen_height = 480;
        this.island = [];   // island (ilha)
        this.terrain = [];
        // define shapes - easier than using #s
        this.eShape = {
            PLANE: 0, PLANE_LEFT: 1, PLANE_RIGHT: 2, HELI_RIGHT0: 3, HELI_RIGHT1: 4,
            HELI_LEFT0: 5, HELI_LEFT1: 6, SHIP_RIGHT: 7, SHIP_LEFT: 8, AIRPLANE_E: 9,
            AIRPLANE_D: 10, FUEL: 11, EXPL1:12, EXPL2: 13, HOME: 14
        }
        this.centerCanvas();
        //                      x   y width height  shape#        out expl
        this.plane = new Shape(370, 420, 49, 42, this.eShape.PLANE, 0, 0);
        
        for (let ii=0; ii<3; ii++) {
            this.island.push(ii);
            this.island[ii] = new Island(width, 1, 0);
            this.terrain.push(ii);
            this.terrain[ii] = new Terrain(width, 3, - ii * 336 - 100);
        }
    }
  
    update() {

    }

    lands() {
        for (let ii=0; ii<3; ii++) {
            this.island[ii].show();

            this.terrain[ii].show();
            this.terrain[ii].y += 5;
            if (this.terrain[ii].y > this.screen_height) {
                this.terrain[ii].y = -this.screen_height;
                this.terrain[ii].form = floor(random(0, 7));
            }
        }
    }
  
    render() {
        // river
        background(clr[3]);     // river -> blue

        // releasing control (Liberando controle)
        if (!this.plane.out && !this.intro) {
            this.control();     // check keyboard
        }
        
        // bottom (Fundo)
        fill(clr[2]);
        rect(0, 0, 20, height);         // vertical green strip on left
        rect(width-20, 0, 20, height);  // vertical green strip on right

        this.lands();
        this.plane.show();

        // gray panel containing gas meter (Painel)
        fill(clr[7]);
        rect(0, this.screen_height, width, 130);
        fill(clr[14]);
        rect(0, height-117, width, 112);
        // gas meter (medidor de gasolina)
        noFill();
        strokeWeight(4);
        stroke(clr[7]);
        rect(320, 515, 204, 44);
        noStroke();
        fill(clr[7]);
        rect(335, 515, 11, 13);
        rect(422, 515, 5, 13);
        rect(500, 515, 11, 13);
    }

    control() {
        // controlling steering with arrow keys (Controlando a direcao)
        this.plane.shape = this.eShape.PLANE;
        if (keyIsDown(LEFT_ARROW) && this.plane.x > 10) {
            this.plane.x -= 5;
            this.plane.shape = this.eShape.PLANE_LEFT;
        }
        if (keyIsDown(RIGHT_ARROW) && this.plane.x < 734) {
            this.plane.x += 5;
            this.plane.shape = this.eShape.PLANE_RIGHT;
        }
    }

    centerCanvas() {
        var xx = (windowWidth - width) / 2;
        var yy = (windowHeight - height) / 2;
        this.canvas.position(xx, yy);
    }
}
