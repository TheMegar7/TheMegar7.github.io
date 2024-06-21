class Enemy{

    constructor(_img, _initialPosition, _life, _wall, _target, _vault) {
        this.img = _img;
        this.position = _initialPosition;
        this.rotation = 0;
        this.life = _life;
        this.lastHit= 0;

        this.aggroRadius = 64;
        this.boundingRadius = 18;
        this.boundingRadius2 = this.boundingRadius * this.boundingRadius;
        //variables of movement
        this.speed = 200;
        this.movement = 0;
        this.directionModifier = -1;

        //External conditions of behaviour
        this.wall = _wall;
        
        this.target = _target;
        this.vault = _vault;
        this.vault.position.x;
        //variables of states of behaviour
        this.robasion = false;
        this.golpeasion = false;

        this.attacking = false;
        this.hit = false;
        this.attackingTime = 0;

        this.CountFrame = 0;


        
    }

    Update(deltaTime){
        this.movement = 0;

        let distancePlayer = (this.target.position.x - this.position.x) * Math.sign(this.target.position.x - this.position.x);
        let distanceWall = (this.wall.position.x+46 - this.position.x) * Math.sign(this.wall.position.x+46 - this.position.x);
        let distanceVault = (this.vault.position.x+(96*1.5) - this.position.x) * Math.sign(this.vault.position.x+(96*1.5) - this.position.x);


        //Gestion de ataque
        if(this.attackingTime >= 90 && this.attacking){
            this.attackingTime = 0;
            this.attacking = false;
        }
        else if(this.attackingTime == 30 && this.attacking){
            //do attack things
            this.hit = true;
        }
        else this.hit = false;
        //gestión de estados
        if(this.attacking){
            this.attackingTime++;
            

        }
        else if(distancePlayer < this.aggroRadius && (this.directionModifier == Math.sign(this.target.position.x - this.position.x)) && this.target.hp > 0){
            //Attack player
            this.attacking = true;
            
        }
        else if(distanceWall < this.aggroRadius && this.wall.hp > 0){
            this.attacking = true;
        }
        else if (distanceVault < this.aggroRadius && this.vault.money > 0 && this.robasion == false){
            //robasión
            this.attacking = true;

            this.robasion = true;
            this.directionModifier = 1
        }
        else if (distanceVault < this.aggroRadius && this.robasion == false && this.golpeasion == false){
            //golpeasión
            this.attacking = true;

            this.golpeasion = true;
            this.directionModifier = 1;
        }
        ///if money atacar -> money -1
        ///if life atacar -> hp -1

        //the run away
        else{
            this.movement++;
        }

        if (this.directionModifier > 0) this.speed = 300;
        this.position.x += this.movement * this.directionModifier * this.speed * deltaTime;

        if (this.position.x < 0){
            this.position.x = 0;
            this.directionModifier = 1;
        }
        if(this.movement != 0){
            this.CountFrame++;
        }
        else{
            this.CountFrame = 0;
        }
        if(this.CountFrame >= 60){
            this.CountFrame = 0;
        }
    }

    Draw(ctx){
        let attackframe = Math.trunc((this.attackingTime-30)/10);
        let prepAttFrame = Math.trunc(this.attackingTime/10);
        let moveFrame = Math.trunc(this.CountFrame/10);

        ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.scale(this.directionModifier, 1);

        /*ctx.beginPath();
        ctx.arc(0, 0, this.boundingRadius, 0, Math.PI * 2, false);
        ctx.fill();*/
        if(this.attackingTime >= 30 && this.attackingTime < 60){
            /*ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
            ctx.beginPath();
            ctx.rect(0, -54, 64, 54);
            ctx.fill();*/
        }

        if(this.attacking){
            if(this.attackingTime < 30){
                ctx.drawImage(this.img, 96 * 0, 96*prepAttFrame, 96, 96, -46, -96, 96 , 96);
            }
            else{
                ctx.drawImage(this.img, 96 * 3, 96*attackframe, 96, 96, -46, -96, 96 , 96);
            }
        }
        else if(this.movement != 0 && this.directionModifier != 1){//walking
            ctx.drawImage(this.img, 96 * 1, 96*moveFrame, 96, 96, -46, -96, 96 , 96);
        }
        else if(this.movement != 0 && this.directionModifier == 1){//running
            ctx.drawImage(this.img, 96 * 2, 96*moveFrame, 96, 96, -46, -96, 96 , 96);
        }


        ctx.restore();


    }

    Damage(damage){
        this.life -= damage;
        if (this.life < 0) this.life = 0;
        return this.life <= 0;
    }


}