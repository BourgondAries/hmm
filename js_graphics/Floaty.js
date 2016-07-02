"use strict";

function Floaty(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.angle = 0;
    this.color = '#8E8800';
}

Floaty.prototype.setColor = function (color) {
    this.color = color;
};

Floaty.prototype.draw = function (context) {
    context.save();

    context.beginPath();
    context.lineWidth = 2;
    context.shadowBlur = 20;
    context.shadowColor = this.color;
    context.strokeStyle = this.color;

    context.arc(this.x + Math.sin(this.angle) * 30, this.y, this.r, 0, 2 * Math.PI);

    context.stroke();
    context.restore();
};

Floaty.prototype.move = function () {
    this.y -= 0.3;
    this.angle += 0.01;
};

Floaty.prototype.height = function () {
    return this.y;
};
