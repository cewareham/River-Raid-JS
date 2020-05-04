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
        this.mp = [[[10],          // clues (pistas)
                    [10],
                    [11],
                    [11],
                    [11],
                    [11],
                    [11],
                    [1],
                    [11],
                    [11],
                    [11],
                    [11],
                    [11],
                    [10],
                    [10]],

                   [[0,  17,  0,  0,  0, 17,  0],
                    [17, 17, 17, 17, 17, 17, 17],  // bridge (ponte)
                    [18, 18, 18, 18, 18, 18, 18],
                    [18, 18, 18, 18, 18, 18, 18],
                    [19, 19, 19, 19, 19, 19, 19],
                    [19, 19, 19, 19, 19, 19, 19],
                    [18, 18, 18, 18, 18, 18, 18],
                    [18, 18, 18, 18, 18, 18, 18],
                    [19, 19, 19, 19, 19, 19, 19],
                    [19, 19, 19, 19, 19, 19, 19],
                    [1,   1,  1,  1,  1,  1,  1],
                    [1,   1,  1,  1,  1,  1,  1],
                    [19, 19, 19, 19, 19, 19, 19],
                    [19, 19, 19, 19, 19, 19, 19],
                    [18, 18, 18, 18, 18, 18, 18],
                    [18, 18, 18, 18, 18, 18, 18],
                    [19, 19, 19, 19, 19, 19, 19],
                    [19, 19, 19, 19, 19, 19, 19],
                    [18, 18, 18, 18, 18, 18, 18],
                    [18, 18, 18, 18, 18, 18, 18],
                    [17, 17, 17, 17, 17, 17, 17],  // bridge (ponte)
                    [0,  17,  0,  0,  0, 17, 0]],

                   [[0, 0, 0, 0, 0, 8, 0, 0],     // 12 explosion 1 (esplosão 1)
                    [0, 0, 0, 8, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 8, 0],
                    [8, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 6, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 0, 4],
                    [0, 4, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 4, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 4, 0],
                    [9, 0, 0, 0, 1, 0, 0, 0],
                    [0, 0, 9, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 9, 0, 0]],

                   [[0, 0, 15, 0, 0, 0],          // 13 explosion 2 (esplosão 2)
                    [0, 0, 0, 0, 15, 0],
                    [15, 0, 0, 0, 0, 0],
                    [0, 0, 0, 15, 0, 0],
                    [0, 15, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 15],
                    [0, 0, 9, 0, 0, 0],
                    [0, 0, 0, 0, 9, 0]]]
    }

    show() {
        let obj = this.shape;
        if (this.t_expl > 20) {
            obj = 2;
        } else if (this.t_expl) {
            obj = 3;
        }

        noStroke();
        for (let col=0; col<this.mp[obj][0].length; col++) {
            for (let lin=0; lin<this.mp[obj].length; lin++) {
                if (this.mp[obj][lin][col] && (!this.out || this.t_expl)) {
                    let x = this.x + col * floor(this.w / this.mp[obj][0].length);
                    let y = this.y + lin * floor(this.h / this.mp[obj].length);
                    let w = floor(this.w / this.mp[obj][0].length);
                    let h = floor(this.h / this.mp[obj].length);
                    fill(clr[this.mp[obj][lin][col]]);
                    rect(x, y, w, h);
                }
            }
        }
        if (this.t_expl) this.t_expl -= 1;
    }
}
