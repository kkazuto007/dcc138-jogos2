function Sprite(params = {}) {
    var exemplo = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        ax: 0,
        ay: 0,
        h: 10,
        w: 10,
        a: 0,
        va: 0,
        vm: 0,
        vida: 1,
        morto: 0,
        rate: 0,
        lado: 1,
        frame: 0,
        spawn: {},
        props: {},
        cooldown: 0,
        color: "blue",
        imune: 0,
        atirando: 0,
        comportar: undefined,
        scene: undefined
    }
    Object.assign(this, exemplo, params);
}
Sprite.prototype = new Sprite();
Sprite.prototype.constructor = Sprite;

Sprite.prototype.desenhar = function (ctx) {

    ctx.save();
    ctx.scale(0.5, 0.5)
    ctx.translate(this.x, this.y);
    if (this.ax >= 0) {
        if (this.ay >= 0) {
            var F = Math.floor(this.frame * this.ax / 10 + this.frame * this.ay / 10 + this.frame * this.rate);
        }
        else {
            var F = Math.floor(this.frame * (-1) * this.ay / 10);
        }
    }
    else {
        var F = Math.floor(this.frame * (-1) * this.ax / 10);
    }
    if (this.props.tipo === "enemy") {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.drawImage(this.scene.assets.img("enemy"),
            Math.floor(relogio/50)*32,
            (F % 2) *32,
            32,
            32,
            -this.w,
            -this.h,
            32,
            32
        );
        ctx.restore();
    }

    if (this.props.tipo === "bossshot") {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.drawImage(this.scene.assets.img("bossshot"),
            0,
            0,
            32,
            32,
            -this.w,
            -this.h,
            this.w,
            this.h);
        ctx.restore();
    }

    if (this.props.tipo === "bossshot2") {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.drawImage(this.scene.assets.img("enemy"),
        128,
        32,
        32,
        32,
        -this.w,
        -this.h,
        32,
        32
        );
        ctx.restore();
    }

    if (this.props.tipo === "relogio") {
        ctx.save();
        ctx.scale(2, 2)
        ctx.translate(pc.x-32, pc.y - canvas.height / 4 + 32 );
        ctx.drawImage(this.scene.assets.img("clock"), Math.floor(relogio / 60) * 32, 0, 32, 32, 0, 0, this.w, this.h);
        ctx.restore();
    }
    
    if (this.props.tipo === "tower") {
        if(this.vida >= 5){
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.drawImage(this.scene.assets.img("temple"),
            0,
                0,
                128,
                128,
                -this.w/2,
                -this.h,
                128,
                128,
                );
            ctx.restore();
        }
        else{
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.drawImage(this.scene.assets.img("circle"),
            0,
                0,
                128,
                128,
                -this.w/2,
                -this.h,
                128,
                128,
            );
            ctx.restore();
        }
    }
    
    if (this.props.tipo === "pc") {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.drawImage(this.scene.assets.img("demon"),
            (F % 4) * 32,
            (Math.floor(this.lado) - 1) * 64,
            32,
            64,
            -this.w*2,
            -this.h*3,
            32,
            64
            );
            ctx.restore();
        }
        
    if (this.props.tipo === "boss") {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.drawImage(this.scene.assets.img("enemy"),
        128,
        32,
        32,
        32,
        -this.w,
        -this.h,
        64,
        64
        );
        ctx.restore();
    }
        
    if (this.props.tipo === "tiro"){
        ctx.save();
        ctx.translate(this.x, this.y);
        var T = this.frame * 26
        ctx.drawImage(this.scene.assets.img("bash"),
        Math.floor(T/5) * 64,
        0,
        64,
        64,
        -this.w/2,
        -this.h/2,
        64,
        64
        );
        ctx.restore();
    }
    ctx.restore();
    
    //TRANSFORMAR EM DESENHA HUD
    if (this.props.tipo === "coracao") {
        ctx.save();
        //ctx.scale(2, 2);
        ctx.translate(pc.x + 90, pc.y - canvas.height / 4 + 32);
        ctx.drawImage(this.scene.assets.img("heart"), (F % 4) * 32, 0, 32, 32, 0, 0, this.w, this.h);
        ctx.drawImage(this.scene.assets.img("font"), 224, 0, 64, 32, this.x-20, this.y+14, 32, 16);
        ctx.drawImage(this.scene.assets.img("numbers"), Math.floor((this.rate*100/7)/100)*32, 0, 32, 32, this.x-36, this.y+30, 16, 16);
        ctx.drawImage(this.scene.assets.img("numbers"), Math.floor((this.rate*100/7)/10)*32, 0, 32, 32, this.x-20, this.y+30, 16, 16);
        ctx.drawImage(this.scene.assets.img("numbers"), Math.floor((this.rate*100/7)%10)*32, 0, 32, 32, this.x-4, this.y+30, 16, 16);
    
        ctx.drawImage(this.scene.assets.img("font"), 96, 0, 128, 32, this.x-230, this.y-12, 64, 16);
        ctx.drawImage(this.scene.assets.img("numbers"), torres*32, 0, 32, 32, this.x-168, this.y-12, 16, 16);
    
        ctx.drawImage(this.scene.assets.img("font"), 0, 0, 96, 32, this.x-230, this.y+15, 48, 16);
        ctx.drawImage(this.scene.assets.img("numbers"), Math.floor(kills/100)*32, 0, 32, 32, this.x-184, this.y+15, 16, 16);
        ctx.drawImage(this.scene.assets.img("numbers"), Math.floor(kills/10)*32, 0, 32, 32, this.x-168, this.y+15, 16, 16);
        ctx.drawImage(this.scene.assets.img("numbers"), Math.floor(kills%10)*32, 0, 32, 32, this.x-152, this.y+15, 16, 16);
        ctx.restore();
    }

}
Sprite.prototype.mover = function (dt) {
    this.frame += 4 * dt;
    if(this.props.tipo === "tiro"){
        if (Math.floor(this.frame) >= 1){
            this.morto = true;
        }
    }
    if (Math.floor(this.frame) >= 20) {
        this.frame = 0;
    }
    this.movermru(dt);
}

Sprite.prototype.moverCircular = function (dt) {
    this.a = this.a + this.va * dt;

    this.vx = this.vm * Math.cos(this.a);
    this.vy = this.vm * Math.sin(this.a);

    this.x = this.x + this.vx * dt;
    this.y = this.y + this.vy * dt;

    this.cooldown = this.cooldown - dt;
}

Sprite.prototype.movermru = function (dt) {

    this.x = this.x + this.ax * dt;
    this.y = this.y + this.ay * dt;

    this.a = this.a + this.va*dt;

    this.mc = Math.floor(this.x / this.scene.map.SIZE);
    this.ml = Math.floor(this.y / this.scene.map.SIZE);
    if(this.props.tipo != "boss" && this.props.tipo != "bossshot" && this.props.tipo != "bossshot2"){
        this.aplicaRestricoes(dt);
    }
    this.cooldown = this.cooldown - dt;
}

/*
Sprite.prototype.moverOrtogonal = function (dt) {
    this.a = this.a + this.va*dt;

    this.vx = this.vx + this.ax * dt - this.vx * 0.9 * dt;
    this.vy = this.vy + this.ay * dt + 120 * dt;


    this.mc = Math.floor(this.x / this.scene.map.SIZE);
    this.ml = Math.floor(this.y / this.scene.map.SIZE);

    this.aplicaRestricoes(dt);
    this.cooldown = this.cooldown - dt;
}
*/

Sprite.prototype.aplicaRestricoes = function (dt) {

    var dnx;
    var dx;
    dx = this.ax * dt;
    dnx = dx;
    dy = this.ay * dt;
    dny = dy;
    if (dx > 0 && this.scene.map.cells[this.mc + 1][this.ml].tipo != 0) {
        dnx = this.scene.map.SIZE * (this.mc + 1) - (this.x + this.w / 2);
        dx = Math.min(dnx, dx);
    }
    if (dx < 0 && this.scene.map.cells[this.mc - 1][this.ml].tipo != 0) {
        dnx = this.scene.map.SIZE * (this.mc - 1 + 1) - (this.x - this.w / 2);
        dx = Math.max(dnx, dx);
    }
    if (dy > 0 && this.scene.map.cells[this.mc][this.ml + 1].tipo != 0) {
        dny = this.scene.map.SIZE * (this.ml + 1) - (this.y + this.h / 2);
        dy = Math.min(dny, dy);
    }
    if (dy < 0 && this.scene.map.cells[this.mc][this.ml - 1].tipo != 0) {
        dny = this.scene.map.SIZE * (this.ml - 1 + 1) - (this.y - this.h / 2);
        dy = Math.max(dny, dy);
    }
    this.ay = dy / dt;
    this.x = this.x + dx;
    this.y = this.y + dy;

    var MAXX = this.scene.map.SIZE * this.scene.map.COLUMNS - this.w / 2;
    var MAXY = this.scene.map.SIZE * this.scene.map.LINES - this.h / 2;

    if (this.x > MAXX) this.x = MAXX;
    if (this.y > MAXY) {
        this.y = MAXY;
        this.ay = 0;
    }
    if (this.x - this.w / 2 < 0) this.x = 0 + this.w / 2;
    if (this.y - this.h / 2 < 0) this.y = 0 + this.h / 2;

}


Sprite.prototype.colidiuCom = function (alvo) {
    if (alvo.x + alvo.w / 2 < this.x - this.w / 2) return false;
    if (alvo.x - alvo.w / 2 > this.x + this.w / 2) return false;

    if (alvo.y + alvo.h / 2 < this.y - this.h / 2) return false;
    if (alvo.y - alvo.h / 2 > this.y + this.h / 2) return false;

    return true;
}