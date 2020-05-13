"use strict";

// class for land/terrain -> org class Place
class Terrain {
    constructor(wdt, form, y) {
        this.y = y;
        this.h = 6;
        this.w = 21;
        this.wdt = wdt;
        this.form = form;
        this.clr = clr[2];  // green for land
    }

    show() {
        let maps = CC.maps;
        noStroke();
        fill(this.clr);
        let len = maps[this.form].length;
        for (let py=0; py<len; py++) {
            rect(0, this.y + py * this.h, this.w + maps[this.form][py] * this.w, this.h);
            let invert = (this.wdt - this.w) - maps[this.form][py] * this.w;
            rect(invert, this.y + py * this.h, this.wdt - invert, this.h);
        }
        this.showMapNum(maps);
    }

    showMapNum(maps) {
        textFont("arial black");
        fill(0);
        textSize(20);
        let msg;
        if (this.form == 8) msg = "BASE ";
        else msg = "Map ";
        msg += this.form;
        text(msg + " top", 10, this.y);
        let len = maps[this.form].length;
        text(msg + " bottom", 10, this.y+len*this.h);
    }
}
