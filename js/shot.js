"use strict";

class Shot {
    constructor(shooting, x, y) {
        this.x = x;
        this.y = y;
        this.w = 5;
        this.h = 15;
        this.shooting = shooting;
        this.speed = 20;
    }

    show(planex, planey) {
        if (this.shooting) {
            this.shooting = false;
            if (this.y < 0) {
                this.x = planex;
                this.y = planey;
            }
        }
        if (this.y > -this.h) {
            this.y -= this.speed;
        }
        noStroke();
        fill(clr[13]);
        rect(this.x, this.y, this.w, this.h);
    }
}
