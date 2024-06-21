class Farm{

    


}

class Farmer{

    constructor(_img, _position, _img2, _magicNum){
        this.img = _img;
        this.position = _position;
        this.img2 = _img2;

        this.patrol = {start:48 * 1, end: 48 * 30};
        this.workless = true;

        this.worklessPatrol = {start:48 * 1, end: 48 * 30};
        this.farmPatrol = {start:48 * 20, end: 48 * 25};
        this.fieldPatrol = {start:48 * 20, end: 48 * 25};

        this.speed = 100;
        this.speedMult = 3;
        this.movement = 0;
        this.goingRight = true;
        this.directionModifier = 1;

        this.framesCount = _magicNum * 25;
        this.moving = false;
        this.running = false;
        this.walking = false;
    }

    Update(deltaTime, hour){
        //de dia hasta time = 720;
        this.framesCount++;
        this.movement = 0;

        if(this.workless){//patrol
            this.running = false;
            //framescount
            if(this.framesCount > (120 + 80)){
                this.framesCount = 0;
            }

            else if(this.framesCount < 120){
                //workless patrol
                this.movement = 1;
            }

            if(this.position >= this.worklessPatrol.end){
                this.goingRight = false;
                this.directionModifier = -1;
            }
            else if(this.position <= this.worklessPatrol.start){
                this.goingRight = true;
                this.directionModifier = 1;
            }
        }
        else{
            if (hour < 720){//day
                if(this.position <= this.fieldPatrol.start){
                    if(this.framesCount > 60) this.framesCount = 0;
                    
                    //go field (move right)
                    this.movement = 1;
                    this.goingRight = true;
                    this.directionModifier = 1;
                    this.running = false;
                    this.walking = true;
                }
                else{//patrol behaviour
                    this.running = false;
                    this.walking = false;
                    //framescount
                    if(this.framesCount > (120 + 80)) this.framesCount = 0;
                    //do fieldpatrol
                    else if(this.framesCount < 120){
                        this.movement = 1;

                        if(this.position <= this.fieldPatrol.start){
                            this.goingRight = true;
                            this.directionModifier = 1;
                        }
                        else if(this.position >= this.fieldPatrol.end){
                            this.goingRight = false;
                            this.directionModifier = -1;
                        }
                    }
                }
            }
            else{//night
                if(this.position >= this.farmPatrol.end){
                    if(this.framesCount > 60) this.framesCount = 0;
                    //run farm
                    this.movement = 1;
                    this.goingRight = false;
                    this.directionModifier = -1;
                    this.running = true;
                    this.walking = false;
                }
                else{//patrol behaviour
                    this.running = false;
                    this.walking = false;
                    //framescount
                    if(this.framesCount > (120 + 80)) this.framesCount = 0;
                    //do fieldpatrol
                    else if(this.framesCount < 120){
                        this.movement = 1;

                        if(this.position >= this.farmPatrol.end){
                            this.goingRight = false;
                            this.directionModifier = -1;
                        }
                        else if(this.position <= this.farmPatrol.start){
                            this.goingRight = true;
                            this.directionModifier = 1;
                        }
                    }
                }
            }
        }

        if(this.movement != 0){
            this.moving = true; 
        }
        else{
            this.moving = false;
        }

        if(this.running) this.position += (this.movement * this.directionModifier * this.speed * this.speedMult * deltaTime);
        if(this.walking) this.position += (this.movement * this.directionModifier * this.speed * 2 * deltaTime);
        else this.position += this.movement * this.directionModifier * this.speed * deltaTime;

        if (this.position < 0)
            this.position = 0;
    }

    Draw(ctx){
        let animFrame = 0;
        if(this.framesCount < 60) animFrame = Math.trunc(this.framesCount/10);
        else if (this.framesCount < 120) animFrame = Math.trunc((this.framesCount -60)/10);
        else animFrame = Math.trunc((this.framesCount -120)/10);

        /*ctx.fillStyle = "rgba(255, 255, 0, 0.4)";
        ctx.beginPath();
        ctx.rect(this.position, (336) - (48 * 2), 24, 48);
        ctx.fill();*/

        ctx.save();

        ctx.translate(this.position, 336);
        ctx.scale(this.directionModifier, 1);

        if(this.workless){
            //do the worklesspaint
            if(this.moving){
                //do moving paint
                ctx.drawImage(this.img, 96 * 3, 96*animFrame, 96, 96, -46, -96, 96 , 96);
            }
            else{
                //do Idle paint
                ctx.drawImage(this.img, 96 * 0, 96*animFrame, 96, 96, -46, -96, 96 , 96);
            }
        }
        else{
            if(this.running){
                //do running paint
                ctx.drawImage(this.img2, 96 * 3, 96*animFrame, 96, 96, -46, -96, 96 , 96);
            } 
            else if(this.walking){
                //do walking paint
                ctx.drawImage(this.img2, 96 * 2, 96*animFrame, 96, 96, -46, -96, 96 , 96);
            }
            else if(this.moving){
                //do patrol paint
                ctx.drawImage(this.img2, 96 * 1, 96*animFrame, 96, 96, -46, -96, 96 , 96);
            }
            else{
                //do Idle paint
                ctx.drawImage(this.img2, 96 * 0, 96*animFrame, 96, 96, -46, -96, 96 , 96);
            }

        }

        ctx.restore();
    }

    
    Hire( _field){//nanianos[x].Hire(fields[x])
        this.fieldPatrol.start = _field.position.start;
        this.fieldPatrol.end = _field.position.end;
        this.workless = false;
    }
}