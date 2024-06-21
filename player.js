
class Player {

    constructor(img, initialPosition, _life) {
        this.img = img;

        this.position = initialPosition;
        this.attacking = false;
        this.moving = false;
        this.lastFrameMoving = false;
        this.running = false;
        this.lastFrameRunning = false;
        this.goingRight = true;
        this.goingRightModifier = 1;
        this.framesCount = 0;
        this.gnocchi = 0;

        //stats
        this.speed = 200;
        this.speedMult = 1.5;
        this.movement = 0;
        this.maxHp = _life;
        this.hp = this.maxHp;
        this.extenuation = 800; //mas o menos 8 segs
        this.extenuationAux = 1000;
        
        //Attacking things
        this.weapon = new Weapon("palo", 1, 0, this, 0);
        this.fireRate = 0.6;
        this.fireRateAux = 0;
        this.lastAttack = 0;
        //Armour hp++++
        this.armour = new Armour("arapos", 0, 0, 0)

        this.box = {
            x: 18,
            y: 58
        }

        //Hitbox unused rn
        this.boundingRadius = 18;
        this.boundingRadius2 = this.boundingRadius * this.boundingRadius
        ;

    }

    Update(deltaTime) {
        this.framesCount++;
        
        // attack
        //#region attack
        this.fireRateAux += deltaTime;
        
        if (Input.IsMousePressed() && Input.mouse.y < 382 &&(this.fireRateAux >= this.fireRate)) {
            
            this.framesCount = 0;
            this.gnocchi = 0;
            this.attacking = true;
            this.lastAttack++;
            //
            audios.espadazo.currentTime=0;
            audios.espadazo.play();
            //
            this.fireRateAux = 0.0;
        }

        if (this.attacking && this.framesCount < 30){
            //do the attack things
            this.weapon.active = true;
            
        }
        else if (this.attacking && this.framesCount >= 30){
            this.attacking = false;
            this.framesCount = 0;

            this.weapon.active = false;
        }
        //#endregion

        // movement
        this.movement = 0;


        if (Input.IsKeyPressed(KEY_A) || Input.IsKeyPressed(KEY_LEFT)) {
            this.movement -= 1;
            this.goingRight = false;
            this.goingRightModifier = -1;
        }
        if (Input.IsKeyPressed(KEY_D) || Input.IsKeyPressed(KEY_RIGHT)) {
            this.movement += 1;
            this.goingRight = true;
            this.goingRightModifier = 1;
        }


        if(this.movement != 0){
            this.moving = true;
            
        }
        else{
            this.moving = false;
            this.running = false;
        }
        // speed multiply
        if (Input.IsKeyPressed(KEY_LSHIFT)) {
            if (this.extenuationAux > 1)
            {
                this.movement *= this.speedMult;

                if(this.movement != 0){
                    this.running = true;
                    if(this.extenuationAux > 0) this.extenuationAux -= 2;
                    else this.extenuationAux = 0;
                }
                else {
                    this.running = false;
                    if(this.extenuationAux < this.extenuation) this.extenuationAux += 1;
                    else this.extenuationAux = this.extenuation;
                }
            }
            else this.running = false;
        }
        else {
            if(this.extenuationAux < this.extenuation) this.extenuationAux += 1;
            else this.extenuationAux = this.extenuation;
            this.running = false;
        }

        if(!this.attacking){
            if (!this.lastFrameMoving && !this.moving && this.framesCount > (120 + 120)) {
                this.framesCount = 0;
                this.gnocchi = 0;
            }
            else if (this.lastFrameMoving != this.moving) {
                this.framesCount = 0;
                this.gnocchi = 0;
            }// empieza o deja de moverse
            else if (this.lastFrameRunning != this.running) {
                this.framesCount = 0;
                this.gnocchi = 0;
            } //empieza o deja de correr
            else if (this.lastFrameMoving && this.moving && this.framesCount >= 60) {
                this.framesCount = 0;
                this.gnocchi = 0;
            }//60 duración movingAnim
            else if (this.lastFrameRunning && this.running && this.framesCount >= 30) {
                this.framesCount = 0;
                this.gnocchi = 0;
            }//60 duración runningAnim

            if (this.framesCount > 120) this.gnocchi++;
        }
        

        this.lastFrameMoving = this.moving;
        this.lastFrameRunning = this.running;

        // apply the movement
        this.position.x += this.movement * this.speed * deltaTime;
        

        
        if (this.position.x < sceneLimits.x + this.boundingRadius)
            this.position.x = sceneLimits.x + this.boundingRadius;
        if (this.position.x > sceneLimits.x + sceneLimits.width - this.boundingRadius)
            this.position.x = sceneLimits.x + sceneLimits.width - this.boundingRadius;
        if (this.position.y < sceneLimits.y + this.boundingRadius)
            this.position.y = sceneLimits.y + this.boundingRadius;
        if (this.position.y > sceneLimits.y + sceneLimits.height - this.boundingRadius)
            this.position.y = sceneLimits.y + sceneLimits.height - this.boundingRadius;
        
        this.weapon.Update();
    }

    Draw(ctx) {
        let animFrame = Math.trunc(this.framesCount/10);
        let gnocchiFrame = Math.trunc(this.gnocchi/10);
        let fastFrame = Math.trunc(this.framesCount/5);

        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.scale(this.goingRightModifier, 1);

        if(this.attacking){
            //Column 4
            ctx.drawImage(this.img, 96 * 4, 96*fastFrame, 192, 96, -46, -96, 192 , 96);
        }
        else if(this.running){
            //Column 2
            ctx.drawImage(this.img, 96 * 2, 96*fastFrame, 96, 96, -46, -96, 96 , 96);
        }
        else if (this.moving){
            //Column 1
            ctx.drawImage(this.img, 96 * 1, 96*animFrame, 96, 96, -46, -96, 96 , 96);
        }
        else if(this.framesCount >= 120){
            //Column 0
            ctx.drawImage(this.img, 96 * 0, 96 * gnocchiFrame, 96, 96, -46, -96, 96 , 96);
        }
        // Column 0
        else ctx.drawImage(this.img, 96 * 0, 0, 96, 96, -46, -96, 96 , 96);

        ctx.restore();

        /*ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.boundingRadius, 0, Math.PI * 2, false);
        ctx.fill();

        ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
        ctx.beginPath();
        ctx.rect(this.position.x - this.box.x/2, this.position.y - this.box.y, this.box.x, this.box.y);
        ctx.fill();*/

        //this.weapon.Draw(animFrame, ctx);

    }

}

class Weapon{
    constructor(_name, _damage, _cost, _owner, _id){
        
        this.name = _name;
        this.damage = _damage;
        this.cost = _cost;
        this.owner = _owner;
        this.id = _id;
        this.range = 48+40

        this.position = { x: 0, y: 336-54};
        this.active = false;
        
    }
    Activate(){
        this.active = true;
    }
    Deactivate(){
        this.active = false;
    }
    Update(){
        if(this.owner.goingRight){
            this.position.x = this.owner.position.x;
        }
        else this.position.x = this.owner.position.x - this.range;
    }
    Draw(_animFrame, ctx){
        if(this.active){

            ctx.save();

            ctx.translate(this.position.x, this.position.y);
            ctx.scale(this.owner.goingRightModifier, 1);

        
            ctx.restore();
            
            if(this.owner.goingRight){
                ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
                ctx.beginPath();
                ctx.rect(this.position.x, this.position.y, this.range, 54);
                ctx.fill();
            }
            else{
                ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
                ctx.beginPath();
                ctx.rect(this.position.x, this.position.y, this.range, 54);
                ctx.fill();
            }
        }
    }
}

class Armour{
    constructor(_name, _armour, _cost, _id){
        
        this.name = _name;
        this.armour = _armour;
        this.cost = _cost;
        this.id = _id;
    }
}
