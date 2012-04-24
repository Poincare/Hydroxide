function init() {
    var c = $("#cnv")[0]; var context = c.getContext("2d");

    br = Object.create(OHWallBouncingObj);
    br.draw = function(c) {
        c.fillRect(this.x, this.y, this.width, this.height);
    };

    Hydroxide.registerObject(br);
    Hydroxide.start("cnv", context, 20, 20, 280, 280);     
}

$(document).ready(init);
