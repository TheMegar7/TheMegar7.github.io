class Field{
    constructor(_img, _position){
        this.img = _img;
        this.position ={start: _position, end: _position + 288};
        
        this.state = 0; //0 sin apañar, 1 sin plantar, 2 plantado, 3 crecido
        this.lastDay = 1;

    }
    Update(_day){
        let day = _day;
        if (this.state != 0 && this.lastDay != day){
            if(this.state < 3) this.state++;
            else this.state = 1;
            this.lastDay = day;
        }

    }
    Draw(ctx){
        //pintar en función del estado

        switch(this.state){
            case 0:
                ctx.fillStyle = "rgba(255, 255, 0, 0.4)";
                
                break;
            case 1:
                ctx.fillStyle = "rgba(200, 255, 0, 0.4)";
                break;
            case 2:
                ctx.fillStyle = "rgba(100, 255, 0, 0.4)";
                break;
            default:
                ctx.fillStyle = "rgba(0, 255, 0, 0.4)";
                break;

        }
        ctx.drawImage(this.img, 0, 108 * this.state, 288, 108, this.position.start, (336) - (80), 288, 108);
        /*
        ctx.beginPath();
        ctx.rect(this.position.start, (336) - (48 * 2), 288, 12 + (48 * 2));
        ctx.fill();
        */
        

    }

    BuildField(){
        this.state = 1;
    }
}