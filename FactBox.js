/*global document*/
/*global Image*/
/*global Colors*/
/*global MathJax*/

"use strict";

function FactBox() {
    this.active = false;
    this.cornerRadius = 25;
    this.colors = new Colors();
    this.topMargin = 0.075;
    this.rightMargin = 0.05;
    this.width = 0.35;
    this.height = 0.8;
    this.favbut = document.getElementById("viewerfav");
    this.editor = document.getElementById("editor");
    this.viewer = document.getElementById("viewer");
    this.viewerfacts = document.getElementById("viewerfacts");
    this.viewmaster = document.getElementById("viewmaster");
    this.viewertitle = document.getElementById("viewertitle");
    this.editor.style.visibility = "hidden";
    this.viewer.style.visibility = "hidden";
    this.inEditor = false;
    this.small = true;
    this.opacity = 0.4;
}

FactBox.prototype.isActive = function () {
    return this.active || this.inEditor;
};

FactBox.prototype.openEditor = function (nameFacts) {
    this.editor.style.visibility = "visible";
    this.inEditor = true;

    document.getElementById("title").value = nameFacts.name;
    document.getElementById("facts").value = nameFacts.facts;

    this.viewer.style.visibility = "hidden";
};

FactBox.prototype.isEditing = function () {
    return this.inEditor;
};

FactBox.prototype.closeEditor = function (bubble) {
    this.inEditor = false;
    bubble.setName(document.getElementById("title").value);
    bubble.setFacts(document.getElementById("facts").value);
    this.viewerfacts.innerHTML = bubble.getNameAndFacts().facts;
    this.viewertitle.innerHTML = bubble.getNameAndFacts().name;
    this.editor.style.visibility = "hidden";
    this.viewer.style.visibility = "visible";
    MathJax.Hub.Typeset();
};

FactBox.prototype.closeEditorNoSave = function () {
    this.inEditor = false;
    this.editor.style.visibility = "hidden";
    this.viewer.style.visibility = "visible";
};

FactBox.prototype.setMaster = function (mastered) {
    this.viewmaster.innerHTML = mastered ? 'Unmaster' : 'Master';
};

FactBox.prototype.isSmall = function () {
    return this.small;
};

FactBox.prototype.toggleSize = function () {
    this.small = !this.small;
    if (this.small) {
        this.width = 0.35;
        this.viewer.style.width = "33vw";
        this.editor.style.width = "33vw";
        this.opacity = 0.4;
    } else {
        this.width = 0.90;
        this.viewer.style.width = "88vw";
        this.editor.style.width = "88vw";
        this.opacity = 0.9;
    }
};

FactBox.prototype.show = function (info, fav, mastered) {
    if (this.inEditor) {
        return;
    }
    this.favbut.innerHTML = fav ? "★" : "☆";
    this.active = true;
    this.viewerfacts.scrollTop = 0;
    this.viewerfacts.innerHTML = info.facts;
    this.viewertitle.innerHTML = info.name;
    this.setMaster(mastered);
    MathJax.Hub.Typeset();
    this.viewer.style.visibility = "visible";
};

FactBox.prototype.hide = function () {
    this.active = false;
    this.inEditor = false;
    this.viewer.style.visibility = "hidden";
    this.editor.style.visibility = "hidden";
};

FactBox.prototype.upLeft = function (context, topMargin, rightMargin, width) {
    return {
        x: (1 - rightMargin - width) * context.canvas.width,
        y: topMargin * context.canvas.height
    };

};

FactBox.prototype.downRight = function (context, topMargin, rightMargin, height) {
    return {
        x: (1 - rightMargin) * context.canvas.width,
        y: (topMargin + height) * context.canvas.height
    };
};

FactBox.prototype.draw = function (context) {
    if (this.active === false) {
        return;
    }

    var upLeft = this.upLeft(context, this.topMargin, this.rightMargin, this.width),
        downRight = this.downRight(context, this.topMargin, this.rightMargin, this.height),
        corRad = this.cornerRadius;

    context.save();

    context.lineWidth = 0;
    context.strokeStyle = this.colors.getByName('factBoxLine');
    context.shadowColor = this.colors.getByName('factBoxShad');
    context.shadowBlur = 20;
    context.globalAlpha = this.opacity;
    context.fillStyle = this.colors.getByName('factBox');

    context.beginPath();
    context.moveTo(upLeft.x + corRad, upLeft.y);
    context.lineTo(downRight.x - corRad, upLeft.y);
    context.quadraticCurveTo(downRight.x, upLeft.y, downRight.x, upLeft.y + corRad);
    context.lineTo(downRight.x, downRight.y - corRad);
    context.quadraticCurveTo(downRight.x, downRight.y, downRight.x - corRad, downRight.y);
    context.lineTo(upLeft.x + corRad, downRight.y);
    context.quadraticCurveTo(upLeft.x, downRight.y, upLeft.x, downRight.y - corRad);
    context.lineTo(upLeft.x, upLeft.y + corRad);
    context.quadraticCurveTo(upLeft.x, upLeft.y, upLeft.x + corRad, upLeft.y);

    context.closePath();
    context.fill();
    context.stroke();
    context.restore();

    context.restore();
};
