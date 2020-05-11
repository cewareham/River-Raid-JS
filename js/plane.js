"use strict";

// class for plane
class Plane {
    constructor(x, y, w, h, shape, out, t_expl) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.shape = shape; // index into CC.shapes (constants.js) 0 is plane, 1 plane left, etc.
        this.out = out;
        this.horiz_speed = 2;

        this.t_expl = t_expl;
    }

    update() {
        // control [steering] direction [with arrow keys] (Controlando a direcao)
        this.shape = CC.eShape.PLANE;
        if (keyIsDown(LEFT_ARROW) && this.x > 10) {
            this.x -= this.horiz_speed;
            this.shape = CC.eShape.PLANE_LEFT;
        }
        if (keyIsDown(RIGHT_ARROW) && this.x < 734) {
            this.x += this.horiz_speed;
            this.shape = CC.eShape.PLANE_RIGHT;
        }
    }

    show() {
        let obj = this.shape;
        let shapes = CC.shapes;
        if (this.t_expl > 20) obj = CC.eShape.EXPL1;
        else if (this.t_expl) obj = CC.eShape.EXPL2;

        noStroke();
        for (let col=0; col<shapes[obj][0].length; col++) {
            for (let lin=0; lin<shapes[obj].length; lin++) {
                if (shapes[obj][lin][col] && (!this.out || this.t_expl)) {
                    let x = this.x + col * Math.round(this.w/shapes[obj][0].length);
                    let y = this.y + lin * Math.round(this.h/shapes[obj].length);
                    let w = Math.round(this.w/shapes[obj][0].length);
                    let h = Math.round(this.h/shapes[obj].length);
                    fill(clr[shapes[obj][lin][col]]);
                    rect(x, y, w, h);
                }
            }
        }
        if (this.t_expl) this.t_expl -= 1;
    }
}
