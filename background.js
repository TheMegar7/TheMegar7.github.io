
const fireParticlesConfig = {
    maxParticleCount: 100,

    globalCompositeOperation: "source-over",

    emitterType: 0,

    MIN_INITIAL_VELOCITY: 10,
    MAX_INITIAL_VELOCITY: 60,

    MIN_DIRECTION_X: -0.1,
    MAX_DIRECTION_X: 0.1,

    MIN_DIRECTION_Y: -1,
    MAX_DIRECTION_Y: -0.25,

    MIN_OPACITY_DECREMENT_VELOCITY: 0.5,
    MAX_OPACITY_DECREMENT_VELOCITY: 2,

    MIN_INITIAL_SCALE: 0.05,
    MAX_INITIAL_SCALE: 0.1,

    MIN_SCALE_VELOCITY: 0.05,
    MAX_SCALE_VELOCITY: 0.1,

    MIN_INITIAL_ROTATION: 0,
    MAX_INITIAL_ROTATION: PI2,

    MIN_ROTATION_VELOCITY: 0.05,
    MAX_ROTATION_VELOCITY: 0.15,

    MIN_TIME_TO_SPAWN_PARTICLE: 0.1,
    MAX_TIME_TO_SPAWN_PARTICLE: 0.01
}

class Background {
    constructor(width, height, cellSize, _target, _background2, _background3, _background4, _buildings) {
        this.target = _target;
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.buildings = _buildings;

        this.background2 = _background2;

        this.background3 = _background3;
        this.back3Position = 0;
        this.back3MaxPos = sceneLimits.width - (1920) -1 + 6;//1920?

        this.background4 = _background4;
        this.back4Position = 0;
        this.back4MaxPos = sceneLimits.width - (1056)+ 2 + 6;//1920?
        

        
        
        this.particleSystem = new ParticleSystem(assets.smoke.img, fireParticlesConfig,new Vector2(48 * 27.5,(336) - (48 * 1)));
        
        
        
    }

    //Voy a usar esta clase para las nubes, tambien la replicare para el paradage
    Update(deltaTime){
        //let playerLimiteTotal = sceneLimits.width - 12;
        
        this.back3Position = (((this.target.cleanPos.x -12)/ this.target.maxX) * (this.back3MaxPos) -0);
        
        this.back4Position = this.target.cleanPos.x;

        this.particleSystem.Update(deltaTime);

        //this.back4Position = (((this.target.cleanPos.x -12)/ playerLimiteTotal) * (this.back4MaxPos) -48);
    }

    Draw(ctx) {
        /*ctx.strokeStyle = "grey";
        
        // horizontal lines
        for (let y = 0; y <= this.height; y += this.cellSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
            ctx.stroke();
        }

        // vertical lines
        for (let x = 0; x <= this.width; x += this.cellSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.height);
            ctx.stroke();
        }*/

        //fondo de paradaje
        ctx.drawImage(this.background4, this.back4Position - 48, 0);
        //Capa intermedia de paradaje
        ctx.drawImage(this.background3, this.back3Position, 0);
        //Capa proxima de fondo ya sin paradaje

        ctx.drawImage(this.background2, -48, 0);


        //Edificios
        /*
        ctx.fillStyle = "rgba(0, 255, 0, 0.4)";
        ctx.beginPath();
        ctx.rect(48 * 4, (336) - (48 * 2.5), 48 * 4, 48 * 2.5);
        ctx.fill();*/

        //herreia
        ctx.drawImage(this.buildings, 48 * 8, 48 * 0, 48 * 4, 48 * 4, 48 * 4, 336 - (48 * 4), 48 * 4 , 48 * 4);

        /*
        ctx.fillStyle = "rgba(0, 255, 0, 0.4)";
        ctx.beginPath();
        ctx.rect(48 * 10,(336) - (48 * 3), 48 * 6, 48 * 3);
        ctx.fill();*/
        ctx.drawImage(this.buildings, 48 * 0, 48 * 0, 48 * 8, 48 * 4, 48 * 9, 336 - (48 * 4), 48 * 8 , 48 * 4);
        /*
        ctx.fillStyle = "rgba(0, 255, 0, 0.4)";
        ctx.beginPath();
        ctx.rect(48 * 17,(336) - (48 * 2), 48 * 2, 48 * 2);
        ctx.fill();*/

        /*ctx.fillStyle = "rgba(0, 255, 0, 0.4)";
        ctx.beginPath();
        ctx.rect(48 * 20,(336) - (48 * 3), 48 * 5, 48 * 3);
        ctx.fill();*/

        ctx.drawImage(this.buildings, 48 * 12, 48 * 0, 48 * 5, 48 * 4, 48 * 20, 336 - (48 * 4), 48 * 5 , 48 * 4);

        /*ctx.fillStyle = "rgba(255, 0, 0, 0.6)";
        ctx.beginPath();
        ctx.rect(48 * 26,(336) - (48 * 1), 48 * 3, 48 * 1);
        ctx.fill();*/

        ctx.drawImage(this.buildings, 48 * 17, 48 * 0, 48 * 3, 48 * 4, 48 * 26, 336 - (48 * 4) + 12, 48 * 3 , 48 * 4);

        this.particleSystem.Draw(ctx);


    }
}