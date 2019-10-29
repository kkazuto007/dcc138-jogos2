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
        lado: 0,
        frame: 0,
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
    ctx.scale(0.5,0.5)
    ctx.translate(this.x, this.y);
    var F = Math.floor(this.frame);
    if(this.props.tipo === "relogio"){
        ctx.save();
        ctx.scale(4,4)
        ctx.translate(canvas.width/5,canvas.height/64);
        ctx.drawImage(this.scene.assets.img("clock"),Math.floor(relogio/60)*32,0,32,32,0,0,this.w,this.h);
        ctx.restore();
    }

    if(this.props.tipo === "npc"){
       ctx.save();
       ctx.translate(this.x, this.y);
       ctx.fillRect(this.x,this.y,this.w,this.h);
       ctx.drawImage(this.scene.assets.img("goblin"),
       0,
       0,
       64,
       64,
       0,
       0,
       this.w,
       this.h
       );
       ctx.restore();
    }
    if(this.props.tipo === "pc"){
        ctx.translate(this.x, this.y);
        switch (this.lado){
            case 1:
             //ctx.fillRect(-this.w/2, -this.h, this.w, this.h);
             ctx.drawImage(this.scene.assets.img("demon"),
             (F%4)*64,
             79,
             64,
             48,
             -this.w/2,
             -this.h,
             64,
             48
             );
             break;
             case 2:
             //ctx.fillRect(-this.w/2, -this.h, this.w, this.h);
             ctx.drawImage(this.scene.assets.img("demon"),
             (F%4)*64,
             135,
             64,
             48,
             0,
             -this.h,
             64,
             48
             );
             break;
            case 3:
             //ctx.fillRect(-this.w/2, -this.h, this.w, this.h);
             ctx.drawImage(this.scene.assets.img("demon"),
             (F%4)*64,
             0,
             64,
             48,
             -this.w/2,
             -this.h,
             64,
             48
             );
             break;
             case 4:
             //ctx.fillRect(-this.w/2,-this.h, this.w, this.h);
             ctx.drawImage(this.scene.assets.img("demon"),
             (F%4)*64,
             199,
             64,
             48,
             -this.w,
             -this.h,
             64,
             48
             );
             break;
             default:    
        };
        ctx.restore();
    }
    ctx.restore();

}
Sprite.prototype.mover = function (dt) {
    this.frame +=3*dt;
    if(Math.floor(this.frame) >= 20){
        this.frame =0;
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

Sprite.prototype.movermru = function (dt){
    this.x = this.x + this.ax * dt;
    this.y = this.y + this.ay * dt;

    this.mc = Math.floor(this.x / this.scene.map.SIZE);
    this.ml = Math.floor(this.y / this.scene.map.SIZE);

    this.aplicaRestricoes(dt);
    this.cooldown = this.cooldown - dt;
}

Sprite.prototype.moverOrtogonal = function (dt) {
    //this.a = this.a + this.va*dt;

    this.vx = this.vx + this.ax * dt - this.vx * 0.9 * dt;
    this.vy = this.vy + this.ay * dt /*+ 120 * dt*/;


    this.mc = Math.floor(this.x / this.scene.map.SIZE);
    this.ml = Math.floor(this.y / this.scene.map.SIZE);

    this.aplicaRestricoes(dt);
    this.cooldown = this.cooldown - dt;
}
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
    this.vy = dy / dt;
    this.x = this.x + dx;
    this.y = this.y + dy;

    var MAXX = this.scene.map.SIZE * this.scene.map.COLUMNS - this.w / 2;
    var MAXY = this.scene.map.SIZE * this.scene.map.LINES - this.h / 2;

    if (this.x > MAXX) this.x = MAXX;
    if (this.y > MAXY) {
        this.y = MAXY;
        this.vy = 0;
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