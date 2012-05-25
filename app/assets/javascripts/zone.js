GetHomeBack.Zone = (function(GetHomeBack){
    "use strict";

    function Class(zn, opts){
        this.x = zn.x;
        this.y = zn.y;
        this.points = this.buildPoints(0, 0);
        this.infos = zn.infos;
        this.alphaInfection = 1-(this.infos.infection / 100.0);
        this.alphaYouth = 1-(this.infos.youth / 100.0);

        if (this.infos.type1 === "water"){
            this.color = "127, 169, 181";
        }
        else if (this.infos.type1 === "swamp"){
            this.color = "105, 74, 68";
        }
        else if (this.infos.type1 === "plain"){
            this.color = "127, 168, 79";
        }
        else if (this.infos.type1 === "mountainous"){
            this.color = "127, 127, 127";
        }
        else {
            this.color = "0, 0, 0";
        }

        if (this.infos.type2) {
            this.image = GetHomeBack.sprites(this.infos.type2);
        }
        else {
            this.image = GetHomeBack.sprites("grass");
        }

    }

    Class.prototype.cx = function(){
        return this.x * Zone.width - this.y * Zone.width / 2;
    };

    Class.prototype.cy = function(){
        return this.y * (3/4 * Zone.height);
    };

    Class.prototype.buildPoints = function(x, y){
        var cx = this.cx() - x,
            cy = this.cy() - y;
        return [
            {x: cx,                y: cy - Zone.height/2},
            {x: cx + Zone.width/2, y: cy - Zone.height/4},
            {x: cx + Zone.width/2, y: cy + Zone.height/4},
            {x: cx,                y: cy + Zone.height/2},
            {x: cx - Zone.width/2, y: cy + Zone.height/4},
            {x: cx - Zone.width/2, y: cy - Zone.height/4},
            {x: cx,                y: cy - Zone.height/2}
        ];
    };

    Class.prototype.drawBackground = function(ctx, x, y){
        var points = this.buildPoints(x, y);
        var color = this.selected ? "255, 250, 71" : this.color;
        ctx.fillStyle = "rgba("+color+", "+this.alphaInfection+")";
        ctx.strokeStyle = "rgba("+color+", "+this.alphaInfection+")";
        ctx.beginPath();
        var point = points[0];
        ctx.moveTo(point[0], point[1]);
        for (var i=1; i<points.length; i++){
            point = points[i];
            ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    };

    Class.prototype.drawImage = function(ctx, x, y){
        if (this.image) {
            var cx = this.cx() - Zone.height/2;
            var cy = this.cy() - Zone.height/2;
            var oldGlobalAlpha = ctx.globalAlpha;
            ctx.globalAlpha = this.alphaYouth;
            this.image.draw(ctx, cx-x, cy-y);
            ctx.globalAlpha = oldGlobalAlpha;
        }
    };

    Class.prototype.contains = function(x, y){
        // Stolen from http://local.wasp.uwa.edu.au/~pbourke/geometry/insidepoly/
        for (var i=1; i<this.points.length; i++){
            var p0 = this.points[i];
            var p1 = this.points[ (i+1) % this.points.length ];
            var pos = (y - p0.y)*(p1.x - p0.x) - (x - p0.x)*(p1.y - p0.y);
            if (pos < 0) return false;
        }
        return true;
    };

    Class.prototype.isContained = function(x, y, dx, dy){
        return x < this.cx() + Zone.width &&
               x+dx > this.cx() - Zone.width &&
               y < this.cy() + Zone.height &&
               y+dy > this.cy() - Zone.height;
    };

    Class.prototype.around = function(){
        return [
            GetHomeBack.drawer.getDrawable(this.cx() + Zone.width/2, this.cy() - Zone.height/2),
            GetHomeBack.drawer.getDrawable(this.cx() + Zone.width,   this.cy()),
            GetHomeBack.drawer.getDrawable(this.cx() + Zone.width/2, this.cy() + Zone.height/2),
            GetHomeBack.drawer.getDrawable(this.cx() - Zone.width/2, this.cy() + Zone.height/2),
            GetHomeBack.drawer.getDrawable(this.cx() - Zone.width,   this.cy()),
            GetHomeBack.drawer.getDrawable(this.cx() - Zone.width/2, this.cy() - Zone.height/2)
        ];
    };

    Class.prototype.draw = function(ctx, x, y){
        this.drawBackground(ctx, x, y);
        this.drawImage(ctx, x, y);
    };

    Class.prototype.onClick = function(e){
    };

    Class.prototype.onSelected = function(){
        this.selected = true;
    };

    Class.prototype.display = function(dst){
        dst.displayZone(this);
    };

    Class.prototype.onUnSelected = function(){
        this.selected = false;
    };

    function Zone(zn, opts){
        return new Class(zn, opts);
    }

    Zone.width = 48;
    Zone.height = 48;

    return Zone;
})(GetHomeBack);
