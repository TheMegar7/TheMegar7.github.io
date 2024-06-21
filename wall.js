class Wall{

    constructor( _img, _position){
        this.img = _img;
        this.position = _position;
        this.maxHp = 0;
        this.hp = 0;
        this.boundingRadius = 24;
        this.lvl = 0;
        this.repairCost = 0;
    }

    LvlUp(){
        switch(this.lvl){
            case 0:
                this.maxHp = 10;
                this.hp = this.maxHp;
                this.lvl = 1;
                this.repairCost = 3;
                break;
            case 1:
                this.maxHp = 20;
                this.hp = this.maxHp;
                this.lvl = 2;
                this.repairCost = 10
                break;
            case 2:
                this.maxHp = 50;
                this.hp = this.maxHp;
                this.lvl = 3;
                this.repairCost = 20;
                break;
            default:
                //do nothing
                break;
        }
    }

    Repair(){
        this.hp = this.maxHp;
        return this.repairCost;
    }

    Update(){
        //dont know im a wall
    }

    Draw(ctx){

        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.scale(1, 1);

        switch(this.lvl){
            case 0:
                //pintar
                //console.log("Muro");
                ctx.drawImage(this.img,96 * this.lvl, 144 * 0, 96, 144, 0, -144, 96 , 144);
                break;
            default:
                if(this.hp > this.maxHp/2){
                    //pintar en función del lvl
                    ctx.drawImage(this.img,96 * this.lvl, 144 * 0, 96, 144, 0, -144, 96 , 144);
                    
                }
                else if(this.hp > this.maxHp/5){
                    //pintar en función del lvl
                    ctx.drawImage(this.img,96 * this.lvl, 144 * 1, 96, 144, 0, -144, 96 , 144);
                }
                else if(this.hp > 0){
                    //pintar en función del lvl
                    ctx.drawImage(this.img,96 * this.lvl, 144 * 2, 96, 144, 0, -144, 96 , 144);
                }
                else{
                    //pintar en función del lvl
                    ctx.drawImage(this.img,96 * this.lvl, 144 * 3, 96, 144, 0, -144, 96 , 144);
                }
                break;
            
        }

        ctx.restore();
    }
    
}