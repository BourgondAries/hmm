"use strict";

function Bubbles() {
    this.bubbles = [];
    this.namedBubbles = {};
}

Bubbles.prototype.draw = function (context) {
    var i = null;
    for (i = 0; i < this.bubbles.length; i += 1) {
        this.bubbles[i].draw(context);
    }
};

Bubbles.prototype.getFavd = function () {
    return this.bubbles.filter(function (e) {
        return e.getFav();
    }).map(function (e) {
        return e.getIndex();
    });
};

Bubbles.prototype.getMastered = function () {
    return this.bubbles.filter(function (e) {
        return e.isMastered();
    }).map(function (e) {
        return e.getIndex();
    });
};

Bubbles.prototype.setMastereds = function (list) {
    var i, bubble;
    for (i = 0; i < list.length; i += 1) {
        bubble = this.namedBubbles[list[i]];
        if (bubble !== undefined) {
            bubble.flipMaster();
        }
    }
};

Bubbles.prototype.getNamed = function (name) {
    return this.namedBubbles[name];
};

Bubbles.prototype.add = function (name, bubble) {
    this.bubbles.push(bubble);
    this.namedBubbles[name] = bubble;
};

Bubbles.prototype.getBubble = function (index) {
    return this.bubbles[index];
};

Bubbles.prototype.length = function () {
    return this.bubbles.length;
};

Bubbles.prototype.collide = function (pos) {
    var i = null;
    for (i = 0; i < this.length(); i += 1) {
        if (this.getBubble(i).hitTest(pos)) {
            return this.bubbles[i];
        }
    }
};

Bubbles.prototype.genUniqId = function () {
    var randNum, i;

    for (i = 0; i < 1000; i += 1) {
        randNum = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        if (this.namedBubbles[randNum] === undefined) {
            return randNum;
        }
    }
    while (this.namedBubbles[i] !== undefined) {
        i += 1;
    }
    return i;
};

Bubbles.prototype.hover = function (mousePos, sounds) {
    var i = null;
    for (i = 0; i < this.length(); i += 1) {
        if (this.getBubble(i).hitTest(mousePos)) {
            if (this.getBubble(i).getHL() === false) {
                this.getBubble(i).setHighlighting(true);
                sounds.hover();
            }
        } else {
            this.getBubble(i).setHighlighting(false);
        }
    }
};

Bubbles.prototype.click = function (mousePos) {
    var i = null;
    for (i = 0; i < this.length(); i += 1) {
        if (this.getBubble(i).hitTest(mousePos)) {
            return {
                hit: true,
                facts: this.getBubble(i).getNameAndFacts(),
                bubble: this.getBubble(i)
            };
        }
    }
    return {
        hit: false
    };
};
