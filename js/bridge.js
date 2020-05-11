"use strict";

// class for bridges -> org class Ponte (bridge)
class Bridge {
    constructor(x, y, w, h, shape, out, t_expl) {
        this.x = x;
        this.dir = 0;
        this.y = y;
        this.w = w;
        this.h = h;
        this.shape = shape;     // use shape instead of 'ty'
        this.out = out;
        this.t_expl = t_expl;
    }

    show() {
        let obj = this.shape;
        let bridges = CC.bridges;
        if (this.t_expl > 20) obj = 2;
        else if (this.t_expl) obj = 3;

        noStroke();
        for (let col=0; col<bridges[obj][0].length; col++) {
            for (let lin=0; lin<bridges[obj].length; lin++) {
                if (bridges[obj][lin][col] && (!this.out || this.t_expl)) {
                    let x = this.x + col * round(this.w / bridges[obj][0].length);
                    let y = this.y + lin * round(this.h / bridges[obj].length);
                    let w = round(this.w / bridges[obj][0].length);
                    let h = round(this.h / bridges[obj].length);
                    fill(clr[bridges[obj][lin][col]]);
                    rect(x, y, w, h);
                }
            }
        }
        if (this.t_expl) this.t_expl -= 1;
    }
}
