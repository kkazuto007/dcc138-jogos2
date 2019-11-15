function Scene(params) {
    var exemplo ={
        sprites: [],
        toRemove: [],
        ctx: null,
        w: 300,
        h: 300,
        assets: null,
        map: null
    }
    Object.assign(this, exemplo, params);
}

Scene.prototype = new Scene();
Scene.prototype.constructor = Scene;

Scene.prototype.adicionar = function(sprite){
    this.sprites.push(sprite);
    sprite.scene = this;
};

Scene.prototype.desenhar = function(){
    for(var i = 0; i<this.sprites.length; i++){
        this.sprites[i].desenhar(this.ctx);
    }  
};

Scene.prototype.mover = function(dt){
    for(var i = 0; i<this.sprites.length; i++){
        this.sprites[i].mover(dt);
    }  
};

Scene.prototype.comportar = function(){
    for(var i = 0; i<this.sprites.length; i++){
        if(this.sprites[i].comportar){
            this.sprites[i].comportar();
        }
    }  
};


Scene.prototype.limpar = function(){
    this.ctx.clearRect(0,0, this.w, this.h);
}

Scene.prototype.checaColisao = function(){
    for(var i = 0; i<this.sprites.length; i++){
        if(this.sprites[i].vida <=0){
            this.sprites[i].morto = 1;
        }
        if(this.sprites[i].morto){
            if(this.sprites[i].props.tipo === "tower"){
                this.assets.play("explosion");
                torres--;
            }
            if(this.sprites[i].props.tipo === "boss"){
                boss++;
            }
            this.toRemove.push(this.sprites[i]);
        }
        for(var j = i+1; j<this.sprites.length; j++){
            if(this.sprites[i].colidiuCom(this.sprites[j])){
                if(this.sprites[i].props.tipo === "pc"
                && this.sprites[j].props.tipo ==="enemy"){
                    this.toRemove.push(this.sprites[j]);
                    this.adicionar(new Explosion({x: this.sprites[j].x, y:this.sprites[j].y}));
                    this.assets.play("death");
                    this.assets.play("heartbeat");
                    this.sprites[2].rate += 1;
                    damage += 0.05
                }
                else
                if(this.sprites[i].props.tipo === "pc"
                && this.sprites[j].props.tipo ==="bossshot"){
                    this.toRemove.push(this.sprites[j]);
                    this.assets.play("death");
                    this.assets.play("heartbeat");
                    this.sprites[2].rate += 1;
                    damage += 0.01
                }
                else
                if(this.sprites[i].props.tipo === "pc"
                && this.sprites[j].props.tipo ==="bossshot2"){
                    this.toRemove.push(this.sprites[j]);
                    this.assets.play("death");
                    this.assets.play("heartbeat");
                    this.sprites[2].rate += 1;
                    damage += 0.05
                }
                else 
                if(this.sprites[i].props.tipo === "pc"
                && this.sprites[j].props.tipo ==="boss"){
                    this.assets.play("heartbeat");
                    this.sprites[2].rate += 1;
                    damage += 0.005
                }
                else 
                if(this.sprites[i].props.tipo === "enemy"
                && this.sprites[j].props.tipo ==="tiro"){
                    this.toRemove.push(this.sprites[i]);
                    this.toRemove.push(this.sprites[j]);
                    this.adicionar(new Explosion({x: this.sprites[i].x, y:this.sprites[i].y}));
                    this.assets.play("death");
                    kills++;
                }
                else 
                if(this.sprites[i].props.tipo === "bossshot"
                && this.sprites[j].props.tipo ==="tiro"){
                    this.toRemove.push(this.sprites[i]);
                    this.toRemove.push(this.sprites[j]);
                    this.assets.play("death");
                    kills++;
                }
                else 
                if(this.sprites[i].props.tipo === "bossshot2"
                && this.sprites[j].props.tipo ==="tiro"){
                    this.toRemove.push(this.sprites[i]);
                    this.toRemove.push(this.sprites[j]);
                    this.assets.play("death");
                    kills++;
                }
                else 
                if(this.sprites[i].props.tipo === "tower"
                && this.sprites[j].props.tipo ==="tiro"){
                    this.toRemove.push(this.sprites[j]);
                    this.sprites[i].vida--;
                }
                else 
                if(this.sprites[i].props.tipo === "boss"
                && this.sprites[j].props.tipo ==="tiro"){
                    this.toRemove.push(this.sprites[j]);
                    this.sprites[i].vida--;
                }
            }
        }
    }  
};

Scene.prototype.removeSprites = function () {
    for (var i = 0; i < this.toRemove.length; i++) {
        var idx = this.sprites.indexOf(this.toRemove[i]);
        if(idx>=0){
            this.sprites.splice(idx,1);
        }
    }
    this.toRemove = [];
};

Scene.prototype.desenharMapa = function () {
    this.map.desenhar(this.ctx);
}

Scene.prototype.gerador = function () {
    if(enemycronometer <= 0 ){
        this.adicionar(new Sprite({ x: 288, y: 48, w:16, h:16, comportar: persegue(pc), props: {tipo: "enemy"}}));
        this.adicionar(new Sprite({ x: 48, y: 420, w:16, h:16, comportar: persegue(pc), props: {tipo: "enemy"}}));
        this.adicionar(new Sprite({ x: 580, y: 440, w:16, h:16, comportar: persegue(pc), props: {tipo: "enemy"}}));
        this.adicionar(new Sprite({ x: 300, y: 380, w:16, h:16, comportar: persegue(pc), props: {tipo: "enemy"}}));
        this.adicionar(new Sprite({ x: 480, y: 96, w:16, h:16, comportar: persegue(pc), props: {tipo: "enemy"}}));
        enemycronometer += 10;
    }
}

Scene.prototype.passo = function(dt){
    this.limpar();
    ctx.lineWidth = 256;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    this.desenharMapa();
    this.comportar();
    this.mover(dt);
    this.desenhar();
    //this.checaColisao();
    this.removeSprites();
}

Scene.prototype.passo2 = function(dt){
    this.limpar();
    ctx.lineWidth = 256;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    this.desenharMapa();
    this.gerador();
    this.comportar();
    this.mover(dt);
    this.desenhar();
    this.checaColisao();
    this.removeSprites();
}