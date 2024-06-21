class Smith{

    constructor (_img){
        this.img = _img;
        this.position = 48 * 5;
        this.patrol = {start:48 * 4, end: 48 * 8};
        this.framesCount = 0;

        this.movement = 0;
        this.directionModifier = 1;
        this.goingRight = true;
        this.speed = 50;
        this.moving = false;
    }

    Update(deltaTime){
        
        this.framesCount++;
        this.movement = 0;

        if(this.framesCount > (120 + 80)){
            this.framesCount = 0;
        }

        else if(this.framesCount < 120){
            //workless patrol
            this.movement = 1;
        }

        if(this.position >= this.patrol.end){
            this.goingRight = false;
            this.directionModifier = -1;
        }
        else if(this.position <= this.patrol.start){
            this.goingRight = true;
            this.directionModifier = 1;
        }



        if(this.movement != 0){
            this.moving = true; 
        }
        else{
            this.moving = false;
        }

        this.position += this.movement * this.directionModifier * this.speed * deltaTime;

        if (this.position < 0)
            this.position = 0;

    }

    Draw(ctx){
        let animFrame = 0;
        if(this.framesCount < 60) animFrame = Math.trunc(this.framesCount/10);
        else if (this.framesCount < 120) animFrame = Math.trunc((this.framesCount -60)/10);
        else animFrame = Math.trunc((this.framesCount -120)/10);

        ctx.save();

        ctx.translate(this.position, 336);
        ctx.scale(this.directionModifier, 1);

        if(this.moving){
            //do patrol paint
            ctx.drawImage(this.img, 96 * 1, 96*animFrame, 96, 96, -46, -96, 96 , 96);
        }
        else{
            //do Idle paint
            ctx.drawImage(this.img, 96 * 0, 96*animFrame, 96, 96, -46, -96, 96 , 96);
        }

        ctx.restore();
    }
    //48 * 4, 336 - (48 * 4)
}