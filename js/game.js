"use strict";

// Game class
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.defaultVSpeed = 2;
        this.horiz_speed = 2                // x velocity of player
        this.maxVel_y = 10;                 // max vertical velocity
        this.vel_y = this.defaultVSpeed;    // y velocity -> vertical speed, default = 2
        this.speed = 0;
        this.lives = 1;     // lives = vidas
        this.n_eny = 5;
        this.gaslev = 0;    // gazlev
        this.points = 0;    // pontos=points, pontes=bridges
        this.propeller = 0; // helice = propeller
        this.delay_y = 3;
        this.eny_box = 96;
        this.frame = 0;

        this.TRAINING_MODE = false;
        this.paused = false;

        this.mover = false;
        this.goout = false; // go out (sair)
        this.game = false;
        this.intro = false;
        this.gas_level = 166;   // gaz_level
        this.hitplane = false;
        this.screen_height = 480;
        this.s_gas_alert = "gas_full";
        this.home = [];     // home (casa)
        this.island = [];   // island (ilha)
        this.terrain = [];
        this.bridges = [];  // bridges (pontes)
        this.enemy = [];
        this.data_home = [];
        this.data_enemy = [];
        this.data_island = [3, 3, 3];
        this.data_terrain = [3, 3, 3];
        // define shapes - easier than using #s
        this.eShape = {
            PLANE: 0, PLANE_LEFT: 1, PLANE_RIGHT: 2, HELI_RIGHT0: 3, HELI_RIGHT1: 4,
            HELI_LEFT0: 5, HELI_LEFT1: 6, SHIP_RIGHT: 7, SHIP_LEFT: 8, AIRPLANE_E: 9,
            AIRPLANE_D: 10, FUEL: 11, EXPL1:12, EXPL2: 13, HOME: 14
        }
        this.centerCanvas();
        this.shot = new Shot(1, 0, 1);  // tiro = 'shot'
        this.base = new Terrain(width, 8, -100);
        //                      x   y width height  shape#        out expl
        this.plane = new Shape(370, 420, 49, 42, this.eShape.PLANE, 0, 0);
        this.planeLives = [];
        
        for (let ii=0; ii<3; ii++) {
            this.data_home.push(ii);
            this.home.push(ii);
            //                                        14->home (house) shape
            this.home[ii] = new Shape(-100, 0, 85, 56, 14, 0, 0);

            this.island.push(ii);
            this.island[ii] = new Island(width, 1, 0);

            this.terrain.push(ii);
            this.terrain[ii] = new Terrain(width, 3, - ii * 336 - 100);

            this.bridges.push(ii);
            this.bridges[ii] = new Bridge(ii*485, -this.screen_height, 316, 77, 0, 0, 0);

            this.planeLives.push(ii);
            let plWidth = 25,
                plHeight = 21,
                plSpacing = 10,
                plX = 680 + ii*(plWidth+plSpacing),
                plY = 490;
            this.planeLives[ii] = new Shape(plX, plY, plWidth, plHeight, this.eShape.PLANE, 0, 0);
        }

        this.terrain_intro = new Terrain(width, 0, 0);
        
        this.bridges[2].shape = 1;
        this.bridges[2].x = 312;
        this.bridges[2].out = 1;
        this.bridges[2].h = 68;
        this.bridges[2].w = 175;

        for (let ii=0; ii< this.n_eny; ii++) {
            this.enemy.push(ii);
            this.enemy[ii] = new Shape(0, 0, 0, 0, 0, 0, 0);
            this.data_enemy.push(ii);
        }
        this.restart();
    }

    restart() {
        this.lives = 3;     // vidas
        this.points = 0;    // pontos
        this.base.y = -100;
        this.mover = false;
        this.gas_level = 166;
        this.plane.out = true;
        this.hitplane = false;
        this.bridges[2].out = true;
        this.s_gas_alert = "gas_full";
        this.vel_y = this.defaultVSpeed;

        //  stop sounds (parando os sons)
        ASSETS.sndVoo0.stop();
        ASSETS.sndVoo1.stop();
        ASSETS.sndVoo2.stop();
        ASSETS.sndGas_alert.stop();

        for (let ii=0; ii<3; ii++) {
            this.terrain[ii].form = 3;
            this.data_terrain[ii] = 3;
            this.terrain[ii].y = -ii * 336 - 100;
            this.home[ii].x = 80;
            this.data_home[ii] = [80, false];
            this.island[ii].y = -1600;
            this.data_island[ii] = 13;
        }
        this.data_home[1][1] = true;
        this.terrain_intro.y = 100;

        for (let ii=0; ii<this.n_eny; ii++) {
            this.data_enemy[ii] = [100, ii*this.eny_box - this.screen_height, 42, 30, 6, 1, 0];
        }
        this.data_enemy[4] = [350, -96, 81, 24, 8, 0];
        this.data_enemy[3] = [450, -192, 42, 30, 6, 0];
        this.data_enemy[1] = [500, -384, 37, 72, 11, 0];
    }
  
    update() {
        // scroll island down to start (base) position (base.y = 240)
        // this is the 'intro' when this.game = false
        // for the intro this.base.y goes from -100 to +240
        // when this.base.y hits 240 the intro code below is skipped
        if (this.base.y < 238 && !this.game) {
            this.intro = true;
            this.base.y += this.vel_y;
            for (let ii=0; ii<this.n_eny; ii++) {
                this.enemy[ii].y += this.vel_y;
                if (ii < 3) {
                    this.home[ii].y += this.vel_y;      // casa = home
                    this.island[ii].y += this.vel_y;
                    this.terrain[ii].y += this.vel_y;
                }
            }
        }

        if (this.base.y == -100 && this.plane.out) {
            this.read_pos();
        }

        if (this.base.y < 238 && this.game && this.intro) {
            this.base.y += this.vel_y;
            for (let ii=0; ii<this.n_eny; ii++) {
                // Space between base and enemies (Espaco entre a base e os inimigos)
                if (this.enemy[ii].y > this.base.y + 4) {
                    this.enemy[ii].out = true;
                }
                this.enemy[ii].y += this.vel_y;
                if (ii < 3) {
                    this.home[ii].y += this.vel_y;      // casa = home
                    this.island[ii].y += this.vel_y;
                    this.terrain[ii].y += this.vel_y;
                }
            }
        }

        if (this.plane.out && !this.plane.t_expl && this.game && this.lives > 0 && !this.intro) {
            this.intro = true;
            this.bridges[2].out = true;     // pontos=points, pontes=bridges
            this.gas_level = 166;
            this.plane.x = 370;
            this.plane.shape = this.eShape.PLANE;
            this.base.y = -100;
            this.lives--;
        }

        //if (this.base.y == 238 && this.game && this.intro) {
        if (this.base.y > 237 && this.game && this.intro) {
            this.plane.out = false;
        }

        if (keyIsDown(113)) {   // F2 keycode = 113
            this.restart();
            this.game = true;
        }

        //if (this.base.y == 238 && this.game && this.intro && keyPressed()) {
        if (this.base.y > 237 && this.game && this.intro && keyIsPressed) {
            this.intro = false;
            ASSETS.sndVoo1.loop();
            ASSETS.sndVoo1.play();
        }
    }

    collide(a, b) {
        if (this.TRAINING_MODE) return false;
        return a.x+a.w>b.x && a.x<b.x+b.w && a.y+a.h>b.y && a.y<b.y+b.h;
    }

    hitcolortest(obj, clr) {
        // clr format is eg. "#6E9C42"
        // p5.js get(x, y) returns color value format eg. [45, 50, 184, 255]->rgba array
        // so must convert get(x, y) value to clr format with p5.js hex(..) function below
        if (obj.x >= 0 && obj.x + obj.w <= width && obj.y >= 0 && obj.y + obj.h <= height) {
            for (let ii=0; ii<floor(obj.w); ii++) {
                for (let jj=0; jj<floor(obj.h); jj++) {
                    if ((!ii && (!jj || jj == floor(obj.h) - 1)) || !jj && ii == floor(obj.w) - 1) {
                        let canvasColor = get(floor(obj.x + ii), floor(obj.y + jj));
                        canvasColor = "#" + hex(canvasColor[0], 2) + hex(canvasColor[1], 2) + hex(canvasColor[2], 2);
                        if (canvasColor == clr) return true;
                    }
                }
            }
        }
        return false;
    }

    save_pos() {    // salvar_pos = save_pos
        for (let ii=0; ii<this.n_eny; ii++) {
            this.data_enemy[ii][0] = this.enemy[ii].x;
            this.data_enemy[ii][1] = this.enemy[ii].y;
            this.data_enemy[ii][2] = this.enemy[ii].w;
            this.data_enemy[ii][3] = this.enemy[ii].h;
            this.data_enemy[ii][4] = this.enemy[ii].shape;
            this.data_enemy[ii][5] = this.enemy[ii].out;
            if (ii < 3) {
                this.data_terrain[ii] = this.terrain[ii].form;
                this.data_island[ii] = this.island[ii].form;
                this.data_home[ii][0] = this.home[ii].x;    // casa = home
                this.data_home[ii][1] = this.home[ii].y;
            }
        }
    }

    read_pos() {    // ler_pos = read_pos
        if (this.lives < 0) {
            this.game = false;
        }

        for (let ii=0; ii<this.n_eny; ii++) {
            this.enemy[ii].x = this.data_enemy[ii][0];
            this.enemy[ii].y = this.data_enemy[ii][1];
            this.enemy[ii].w = this.data_enemy[ii][2];
            this.enemy[ii].h = this.data_enemy[ii][3];
            this.enemy[ii].shape = this.data_enemy[ii][4];
            this.enemy[ii].out = this.data_enemy[ii][5];
        }
 
        for (let ii=0; ii<3; ii++) {
            this.home[ii].x = this.data_home[ii][0];
            this.home[ii].out = this.data_home[ii][1];
            this.terrain[ii].form = this.data_terrain[ii];
            this.island[ii].form = this.data_island[ii];
            this.home[ii].x = 80;
            this.home[ii].y = -ii * 350;
        }
        this.terrain[0].y = 100;
        this.terrain_intro.y = 100;
    }

    hittest() {
        let t_expl = 40;
        // Shot crashes into walls (Tiro colide com paredes)
        if (this.hitcolortest(this.shot, clr[2])) {
            this.shot.y = -this.shot.h
        }

        // Airplane with walls (Avião com paredes)
        if ((this.hitcolortest(this.plane, clr[2]) || this.hitplane || !this.gas_level) && !this.plane.out) {
            ASSETS.sndVoo0.stop();
            ASSETS.sndVoo1.stop();
            ASSETS.sndVoo2.stop();
            this.mover = false;
            this.hitplane = false;
            this.plane.out = true;
            ASSETS.sndGas_alert.stop();
            this.plane.t_expl = 40;
            this.s_gas_alert = "gas_full";
            if (this.gas_level) ASSETS.sndS_explode.play();
            else ASSETS.sndGas_explode.play();
        }

        let enehit = 0;
        for (let ii=0; ii<this.n_eny; ii++) {
            // move planes on x axis (movimenta aviões no eixo x)
            if (this.enemy[ii].shape==5 || this.enemy[ii].shape==6 ||this.enemy[ii].shape==8 ||this.enemy[ii].shape==9) {
                this.enemy[ii].dir = -1;                
            } else {
                this.enemy[ii].dir = 1;
            }

            let hit = this.enemy[ii].w;
            this.enemy[ii].w = hit/2;
            if (this.hitcolortest(this.enemy[ii], clr[2])) {
                if (this.enemy[ii].shape==5 || this.enemy[ii].shape==6) {
                    this.enemy[ii].shape = 4;
                    this.enemy[ii].x += 2;
                }
                if (this.enemy[ii].shape==8) {
                    this.enemy[ii].x += 2;
                    this.enemy[ii].shape = 7;
                }
            }
            this.enemy[ii].x += hit/2;
            if (this.hitcolortest(this.enemy[ii], clr[2])) {
                if (this.enemy[ii].shape==4 || this.enemy[ii].shape==3) {
                    this.enemy[ii].x -= 2;
                    this.enemy[ii].shape = 6;
                }
                if (this.enemy[ii].shape==7) {
                   this.enemy[ii].x -= 2;
                   this.enemy[ii].shape = 8; 
                }
            }
            this.enemy[ii].x -= hit/2;
            this.enemy[ii].w = hit;

            // Shot collides with objects (Tiro colide com objetos)
            if (this.collide(this.shot, this.enemy[ii]) && !this.enemy[ii].out && this.shot.y >= 0) {
                this.enemy[ii].t_expl = t_expl;
                this.enemy[ii].out = true;
                enehit = this.enemy[ii].shape;
                ASSETS.sndShot.stop();
                ASSETS.sndS_explode.play();
                this.shot.y = -this.shot.h;
            }

            // Airplane with enemies (Avião com inimigos)
            if (this.collide(this.plane, this.enemy[ii]) && this.enemy[ii].shape < 11 && !this.enemy[ii].out) {
                this.enemy[ii].t_expl = t_expl;
                this.enemy[ii].out = true;
                enehit = this.enemy[ii].shape;
                ASSETS.sndShot.stop();
                this.hitplane = true;
            }

            // Airplane with gasoline (Avião com gasolina) -> shape #11 is fuel
            if (this.collide(this.plane, this.enemy[ii]) && this.enemy[ii].shape==11 && !this.enemy[ii].out && !this.plane.out) {
                if (this.gas_level < 165) {
                    if (!ASSETS.sndGas0.isPlaying()) ASSETS.sndGas0.play();
                    this.gas_level += 0.3;
                } else {
                    if (!ASSETS.sndGas1.isPlaying()) ASSETS.sndGas1.play();

                }
            }

            // Airplane with bridges (Avião com pontes)
            if ((this.collide(this.plane, this.bridges[0]) || this.collide(this.plane, this.bridges[1])) && !this.plane.out) {
                this.hitplane = true;
            }

            // Airplane with base bridge (Avião com ponte base)
            if (this.collide(this.plane, this.bridges[2]) && !this.bridges[2].out) {
                this.save_pos();
                this.hitplane = true;
                this.points += 250;
                this.bridges[2].out = true;
                this.bridges[2].t_expl = t_expl;
            }

            // Base bridge shot (Tiro com a ponte da base)
            if (this.collide(this.bridges[2], this.shot) && !this.bridges[2].out && this.shot.y >=0) {
                this.save_pos();
                this.bridges[2].t_expl = t_expl;
                this.bridges[2].out = true;
                this.points += 250;
                ASSETS.sndShot.stop();
                ASSETS.sndS_explode.play();
                this.shot.y = -100;
            }

            // Points for hitting enemies (Pontos ao atingir inimigos)
            if (2 < enehit && enehit < 7) {         // helicopter (helicoptero)
                this.points += 80
            } else if (6 < enehit && enehit < 9) {  // ship (navio)
                this.points +=40;
            } else if (8 < enehit && enehit < 11) { // airplane (avião)
                this.points += 120
            } else if (enehit == 11) {              // gas stationg (Posto gaz)
                this.points += 30;
            }
        }
    }

    enemies() {     // enemies = inimigos
        this.frame++;
        if (this.frame % 4 == 0) this.propeller = !this.propeller;
        this.hittest();

        for (let ii=0; ii<this.n_eny; ii++) {
            if (this.propeller) {       // animate helicopter propeller
                if (this.enemy[ii].shape == 3 || this.enemy[ii].shape == 5)
                    this.enemy[ii].shape += 1;
                else if (this.enemy[ii].shape == 4 || this.enemy[ii].shape == 6)
                this.enemy[ii].shape -= 1;
            }

            if (this.game && !this.intro) {
                // move enemies vertically (movimenta inimigos na vertical)
                this.enemy[ii].y += this.mover * this.vel_y;
                // move enemy ships & helicopters (movimenta inimigos navios e helicopteros)
                if (2 < this.enemy[ii].shape && this.enemy[ii].shape < 9 && this.enemy[ii].y > 200 && !this.enemy[ii].out) {
                    this.enemy[ii].x += this.enemy[ii].dir;
                }

                // horizontal plane movement (movimento dos avioes na horizontal)
                if (this.enemy[ii].shape == 10 || this.enemy[ii].shape == 9) {
                    if (this.enemy[ii].x > width && this.enemy[ii].shape == 10) {
                        this.enemy[ii].x = 0;
                    }
                    if (this.enemy[ii].x < 0 && this.enemy[ii].shape == 9) {
                        this.enemy[ii].x = width;
                    }
                    if (!this.enemy[ii].out & !this.plane.out) {
                        this.enemy[ii].x += this.enemy[ii].dir;
                    }
                }

                // reposition enemies (reposicionando inimigos)
                // our speed is > one line per frame so can't test for y position == value
                // must instead test for y position > value-1
                //if (this.enemy[ii].y == this.screen_height - this.eny_box / 3) {
                if (this.enemy[ii].y > (this.screen_height - this.eny_box / 3) - 1) {
                    this.enemy[ii].y = 0;
                    if (this.base.y < this.enemy[ii].y && this.enemy[ii].y < this.base.y + 400) {
                        this.enemy[ii].out = true;
                    } else {
                        this.enemy[ii].out = false;
                    }

                    // draw type of enemies and rank (sorteia tipo de inimigos e posto)
                    let emys = [4, 6, 7, 8, 9, 10, 11];
                    let rnd = round(random(0, 6));
                    this.enemy[ii].shape = emys[rnd];
                    if (rnd == 0 || rnd == 1) {
                        this.enemy[ii].w = 42;
                        this.enemy[ii].h = 30;
                    } else if (rnd == 2 || rnd == 3) {
                        this.enemy[ii].w = 81;
                        this.enemy[ii].h = 24;
                    } else if (rnd == 4 || rnd == 5) {
                        this.enemy[ii].w = 48;
                        this.enemy[ii].h = 18;
                    } else if (rnd == 6) {
                        this.enemy[ii].w = 37;
                        this.enemy[ii].h = 72;
                    }

                    // generate random positions for enemies (Gerando posicoes aleatorias para os inimigos)
                    let pos = true;
                    while (pos) {
                        this.enemy[ii].x = floor(random(0, 8) * 84 + 23);
                        pos = this.hitcolortest(this.enemy[ii], clr[2]);
                    }
                    this.enemy[ii].y = -this.eny_box / 3;
                }
                if (-370 <= this.base.y && this.base.y < 50 && this.enemy[ii].y > (this.screen_height + this.eny_box/2) -1) {
                    this.enemy[ii].out = true;
                }

                if (this.enemy[ii].y > (this.screen_height + this.eny_box / 2) - 1) {
                    this.enemy[ii].y = -this.eny_box / 2;
                }
            }
            this.enemy[ii].show();
        }
        // takes gasoline (retira gasolina)
        if (!this.intro && this.mover) {
            this.gaslev += 1;
            if (this.gaslev > 100) {
                this.gaslev = 0;
                if (!this.TRAINING_MODE) this.gas_level -= 5;
            }
            if (this.gas_level < 0) this.gas_level = 0;
        }

        // Gasoline warning running out (Aviso de gasolina acabando)
        if (this.gas_level <= 70 && this.s_gas_alert == "gas_full") {
            this.s_gas_alert = "gas_alert";
            ASSETS.sndGas_alert.loop();
            ASSETS.sndGas_alert.play();
        }
        if (this.gas_level <= 5 && this.gaslev > 80 && this.s_gas_alert == "gas_alert") {
            this.s_gas_alert = "gas_end";
            ASSETS.sndGas_alert.stop();
            ASSETS.sndGas_end.play();
        }

        if (this.s_gas_alert != "gas_full" && this.gas_level > 70) {
            this.s_gas_alert = "gas_full";
            ASSETS.sndGas_end.stop();
            ASSETS.sndGas_alert.stop();
        }
    }
 
    lands() {
        // move the base (mover a base)
        if (this.game && !this.intro && !this.plane.t_expl) {
            this.base.y += this.mover * this.vel_y;
        }

        for (let ii=0; ii<3; ii++) {
            this.island[ii].y = this.base.y - (2000+ii*246);
            this.terrain[ii].y = this.base.y - (330+ii*300);

            if (this.intro) this.terrain_intro.show();

            if (this.terrain[ii].y < this.screen_height) {
                this.terrain[ii].show();
            }

            if (this.island[ii].y < this.screen_height) {
                this.island[ii].show();
            }
        }

        this.terrain_intro.y = this.base.y + 210;

        for (let ii=0; ii<3; ii++) {
            // moves house & base in y (movimenta casa e base em y)
            this.home[ii].y += this.mover * this.vel_y;

            // randomly place houses (posiciona casinhas aleatoreamente)
            // if (this.home[ii].y == this.screen_height) -> replace with:
            if (this.home[ii].y > this.screen_height-1) {
                this.home[ii].y = 0;
                let rnd_home = [0, 1, 2, 3, 4, 5, 6, 7, 8];
                //seq_mix(rnd_home, 0, 8);    // scramble array (embaralha array)
                shuffle(rnd_home, true);    // p5.js shuffle(), true param->modify passed array
                for (let jj=0; jj<8; jj++ ){
                    this.home[ii].x = rnd_home[jj] * this.home[ii].w + 25;
                    // colidir = collide
                    if (this.hitcolortest(this.home[ii], clr[3]) || this.bridges[2].t_expl ||
                            this.collide(this.home[ii], this.bridges[0]) ||
                            this.collide(this.home[ii], this.bridges[1]) ||
                            this.collide(this.home[ii], this.bridges[2])) {
                        this.home[ii].out = true
                    } else {
                        this.home[ii].out = false;
                        break;
                    }
                }
            }

            if (this.home[ii].y < this.screen_height) {
                this.home[ii].show();
            }

            // bridges (pontes)
            this.bridges[ii].y = this.base.y + 164;
            // in python x < y < z is equivalent to x < y and y < z
            // in javascript x < y < z is equiv to x < y [true or false] and [true or false, i.e 1 or 0] < z
            if (-this.screen_height < this.base.y && this.base.y < this.screen_height) {
                this.bridges[ii].show();
            }
        }
        this.bridges[2].y = this.base.y + 169;

        // regenerate the bridge (regenera a ponte)
        if (this.base.y > this.screen_height && !this.intro) {
            this.bridges[2].out = false;
        }
    }
  
    render() {
        // river (rio) -> flash river color when bridge explodes
        if (this.bridges[2].t_expl % 2) background(clr[8]);
        else background(clr[3]);     // river -> blue

        // releasing control (Liberando controle)
        if (!this.plane.out && !this.intro) {
            this.control();     // check keyboard
        }

        this.shot.show(this.plane.x + this.plane.w/2, this.plane.y + this.plane.h/2);
        
        // bottom (Fundo)
        fill(clr[2]);
        rect(0, 0, 20, height);         // vertical green strip on left
        rect(width-20, 0, 20, height);  // vertical green strip on right

        // in python x < y < z is equivalent to x < y and y < z
        // in javascript x < y < z is equiv to x < y [true or false] and [true or false, i.e 1 or 0] < z
        // so {if -screen_height < base.y < screen_height:} is equiv to:
        if (-this.screen_height < this.base.y && this.base.y < this.screen_height) {
            this.base.show();            
        }

        this.lands();
        this.enemies();
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

        this.texts();        // textos = texts

        // Restart base, lands & islands (Reinicia Terras Base e Ilhas)
        if (this.island[2].y > this.screen_height) {
            this.base.y = -400;
            for (let ii=0; ii<3; ii++) {
                this.terrain[ii].form = floor(random(0, 7));
                this.island[ii].form = floor(random(0, 13));
            }
        }
    }

    texts() {
        // gas meter (medidor)
        textFont("arial");
        textSize(33);
        fill(0);
        // type ½ -> hold Alt & type 0189, then release Alt
        text("E      ½      F", 333, 524+31);
        fill(clr[1]);
        rect(335+this.gas_level, 529, 10, 27);

        // lives (vidas)
        textFont(ASSETS.fntCB);     // cooper black font
        fill(232, 232, 74);         // yellow text
        // textSize(34);
        // text(this.lives, 290, 554+32);
        //console.log(this.lives, this.game, this.plane.out, this.intro);
        if (this.lives <= 0 && this.game && this.plane.out && !this.intro) {
            textSize(30);
            let msg = "GAME OVER  F2 to play again",
                txtWidth = drawingContext.measureText(msg).width,
                txtX = (width - txtWidth)/2;    // center horizontally
            text(msg, txtX,/*364-45,*/ 552+36);
        } else {    // show lives left visually with small planes
            for (let ii=0; ii<this.lives; ii++) this.planeLives[ii].show();
        }

        // points (pontos)
        if (this.points) {
            text(this.points, 450, 474+32);
        }

        // text
        if (!this.game) {
            //textFont("arial black");
            textSize(30);
            let msg = "River Raid JS  F2 to start",
                txtWidth = drawingContext.measureText(msg).width,
                txtX = (width - txtWidth)/2;    // center horizontally
            text(msg, txtX,/*364-45,*/ 552+36);
        }
    }

    control() {
        // game speed (velocidade do jogo)
        if (this.game && !this.intro) {
            this.speed += this.vel_y;
            if (this.speed > this.delay_y) {
                this.mover = true;
                this.speed = 0;
            } else {
                this.mover = false;
            }
        }

        // control [steering] direction [with arrow keys] (Controlando a direcao)
        this.plane.shape = this.eShape.PLANE;
        if (keyIsDown(LEFT_ARROW) && this.plane.x > 10) {
            this.plane.x -= this.horiz_speed;
            this.plane.shape = this.eShape.PLANE_LEFT;
        }
        if (keyIsDown(RIGHT_ARROW) && this.plane.x < 734) {
            this.plane.x += this.horiz_speed;
            this.plane.shape = this.eShape.PLANE_RIGHT;
        }

        // control speed (controlando a velocidade)
        if (keyIsDown(UP_ARROW)) {
            if (this.delay_y > 0) {
                this.vel_y++;
                if (this.vel_y > this.maxVel_y) this.vel_y = this.maxVel_y;
                ASSETS.sndVoo0.stop();
                ASSETS.sndVoo1.stop();
                ASSETS.sndVoo2.loop();
                ASSETS.sndVoo2.play();
            }
            this.delay_y = 0;
        } else if (keyIsDown(DOWN_ARROW)) {
            if (this.delay_y < 2) {
                this.vel_y--;
                if (this.vel_y < 1) this.vel_y = 1;
                ASSETS.sndVoo1.stop();
                ASSETS.sndVoo2.stop();
                ASSETS.sndVoo0.loop();
                ASSETS.sndVoo0.play();
            }
            this.delay_y = 2;
        } else {
            if (this.delay_y != 1) {
                this.vel_y--;
                if (this.vel_y < this.defaultVSpeed) this.vel_y = this.defaultVSpeed;
                ASSETS.sndVoo0.stop();
                ASSETS.sndVoo2.stop();
                ASSETS.sndVoo1.loop();
                ASSETS.sndVoo1.play();
            }
            this.delay_y = 1;
        }

        // shooting (atriando)
        if (keyIsDown(32))      // keycode 32 = space bar
            this.shot.shooting = true;
            if (this.shot.y == this.plane.y - 15) {
                ASSETS.sndShot.stop();
                ASSETS.sndShot.play();
            }

        if (keyIsDown(80)) {    // keycode 80 = 'p' -> pause, set scrolling to 0 speed
            this.paused = !this.paused;
            if (this.paused) {
                this.vel_y = 0;
            } else {
                this.vel_y = this.defaultVSpeed;
            }
        }
    }

    centerCanvas() {
        var xx = (windowWidth - width) / 2;
        var yy = (windowHeight - height) / 2;
        this.canvas.position(xx, yy);
    }
}
