"use strict";

// Game class
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.vel_y = 5;     // y velocity -> vertical speed, default = 2
        this.speed = 0;
        this.lives = 1;     // vidas
        this.n_eny = 5;
        this.points = 0;    // pontos=points, pontes=bridges
        this.delay_y = 3;

        this.vert_speed = 5;

        this.mover = false;
        this.goout = false; // go out (sair)
        this.game = false;
        this.intro = false;
        this.hitplane = false;
        this.screen_height = 480;
        this.island = [];   // island (ilha)
        this.terrain = [];
        this.enemy = [];
        this.data_island = [3, 3, 3];
        this.data_terrain = [3, 3, 3];
        // define shapes - easier than using #s
        this.eShape = {
            PLANE: 0, PLANE_LEFT: 1, PLANE_RIGHT: 2, HELI_RIGHT0: 3, HELI_RIGHT1: 4,
            HELI_LEFT0: 5, HELI_LEFT1: 6, SHIP_RIGHT: 7, SHIP_LEFT: 8, AIRPLANE_E: 9,
            AIRPLANE_D: 10, FUEL: 11, EXPL1:12, EXPL2: 13, HOME: 14
        }
        this.centerCanvas();
        this.base = new Terrain(width, 8, -100);
        //                      x   y width height  shape#        out expl
        this.plane = new Shape(370, 420, 49, 42, this.eShape.PLANE, 0, 0);
        
        for (let ii=0; ii<3; ii++) {
            this.island.push(ii);
            this.island[ii] = new Island(width, 1, 0);
            this.terrain.push(ii);
            this.terrain[ii] = new Terrain(width, 3, - ii * 336 - 100);
        }

        for (let ii=0; ii< this.n_eny; ii++) {
            this.enemy.push(ii);
            this.enemy[ii] = new Shape(0, 0, 0, 0, 0, 0, 0);
        }
        this.restart();
    }

    restart() {
        this.lives = 3;     // vidas
        this.points = 0;    // pontos
        this.base.y = -100;
        this.mover = false;
        this.plane.out = true;

        for (let ii=0; ii<3; ii++) {
            this.terrain[ii].form = 3;
            this.data_terrain[ii] = 3;
            this.terrain[ii].y = -ii * 336 -100;
            this.island[ii].y = -1600;
            this.data_island[ii] = 13;
        }
    }
  
    update() {
        // scroll island down to start (base) position (base.y = 240)
        // this is the 'intro' when this.game = false
        // for the intro this.base.y goes from -100 to +240
        // when this.base.y hits 240 the intro code below will be skipped
        // at that time this.game should be set to true & this.intro to false
        if (this.base.y < 238 && !this.game) {
            this.intro = true;
            this.base.y += this.vert_speed;//5;
            for (let ii=0; ii<this.n_eny; ii++) {
                this.enemy[ii].y += this.vert_speed;//5;
                if (ii < 3) {
                    this.island[ii].y += this.vert_speed;//5;
                    this.terrain[ii].y += this.vert_speed;//5;
                }
            }
        }

        if (this.base.y == -100 && this.plane.out) {
            //console.log(this.base.y, this.plane.out);
            this.ler_pos();
        }

        if (this.base.y < 238 && this.game && this.intro) {
            //console.log(this.base.y, this.game, this.intro);
            this.base.y += this.vert_speed;//5;
            for (let ii=0; ii<this.n_eny; ii++) {
                // Space between base and enemies (Espaco entre a base e os inimigos)
                if (this.enemy[ii].y > this.base.y + 4) {
                    this.enemy[ii].out = true;
                }
                this.enemy[ii].y += this.vert_speed;//1;
                if (ii < 3) {
                    //this.casa[ii].y += this.vert_speed;//1; // casa = home
                    this.island[ii].y += this.vert_speed;//1;
                    this.terrain[ii].y += this.vert_speed;//1;
                }
            }
        }

        if (this.plane.out && !this.plane.t_expl && this.game && this.lives > 0 && !this.intro) {
            this.intro = true;
            //this.bridges[2].out = true;     // pontos=points, pontes=bridges!
            this.plane.x = 370;
            this.plane.shape = this.eShape.PLANE;
            this.base.y = -100;
            this.lives -= 1;
        }

        //if (this.base.y == 238 && this.game && this.intro) {
        if (this.base.y > 237 && this.game && this.intro) {
            this.plane.out = false;
            //this.intro = false;
        }

        if (keyIsDown(113)) {   // F2 keycode = 113
            this.restart();
            this.game = true;
            //this.intro = false;
        }

        //if (this.base.y == 238 && this.game && this.intro && keyPressed()) {
        if (this.base.y > 237 && this.game && this.intro && keyIsPressed) {
            this.intro = false;
        }
    }

    ler_pos() {
        if (this.lives < 0) {
            this.game = false;
        }
 
        for (let ii=0; ii<3; ii++) {
            this.terrain[ii].form = this.data_terrain[ii];
            this.island[ii].form = this.data_island[ii];
        }
        this.terrain[0].y = 100;
    }
 
    lands() {
        // move the base (mover a base)
        if (this.game && !this.intro && !this.plane.t_expl) {
            this.base.y += this.mover * this.vel_y;
        }

        for (let ii=0; ii<3; ii++) {
            this.island[ii].y = this.base.y - (2000+ii*246);
            this.terrain[ii].y = this.base.y - (330+ii*300);

            if (this.terrain[ii].y < this.screen_height) {
                this.terrain[ii].show();
            }

            if (this.island[ii].y < this.screen_height) {
                this.island[ii].show();
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

        // in python x < y <= z is equivalent to x < y and y <= z
        // in javascript x < y <= z is equiv to x < y [true or false] and [true or false, i.e 1 or 2] <= z
        if (-this.screen_height < this.base.y && this.base.y < this.screen_height) {
            this.base.show();            
        }

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

        // Restart base, lands & islands (Reinicia Terras Base e Ilhas)
        if (this.island[2].y > this.screen_height) {
            this.base.y = -400;
            for (let ii=0; ii<3; ii++) {
                this.terrain[ii].form = floor(random(0, 7));
                this.island[ii].form = floor(random(0, 13));
            }
        }
    }

    control() {
        // game speed (velocidade do jogo)
        if (this.game && !this.intro) {
            this.speed += this.vert_speed;//1;
            if (this.speed > this.delay_y) {
                this.mover = true;
                this.speed = 0;
            } else {
                this.mover = false;
            }
        }

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

        // controlling the speed (controlando a velocidade)
        if (keyIsDown(UP_ARROW)) {
            this.delay_y = 0;
        } else if (keyIsDown(DOWN_ARROW)) {
            this.delay_y = 2;
        } else {
            this.delay_y = 1;
        }
    }

    centerCanvas() {
        var xx = (windowWidth - width) / 2;
        var yy = (windowHeight - height) / 2;
        this.canvas.position(xx, yy);
    }
}
