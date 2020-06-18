"use strict";

// class for islands -> org class Ilhas (island)
class Island {
    constructor(wdt, form, y) {
        this.y = y
        this.w = 21
        this.h = 10
        this.wdt = wdt
        this.form = form
    }

    show() {
        let islands = CC.islands;
        noStroke();
        fill(clr[2]);
        for (let py=0; py<islands[this.form].length; py++) {
            rect(this.wdt / 2, this.y + py * this.h, islands[this.form][py] * this.w, this.h);
            let invert = (this.wdt/2)-this.w*islands[this.form][py];
            rect(invert, this.y + py * this.h, (this.wdt/2)-invert, this.h);
        }
        //this.showIslandNum(islands);
    }

    showIslandNum(islands) {
        textFont("arial black");
        fill(0);
        textSize(20);
        let msg = "Island " + this.form;
        text(msg + " top", 10, this.y);
        let len = islands[this.form].length;
        text(msg + " bottom", 10, this.y+len*this.h);
    }
}
