class Tile{

    constructor( _img, _positionInRow, _id){
        this.position = {
            x: (_positionInRow * 96) - 48,
            y: 336
        }
        this.img = _img;
        this.id = _id - 1;
    }

    Update(deltaTime){
        //Sin usar de momento
    }
    Draw(ctx){
        ctx.drawImage(this.img, 0, 48 * this.id, 96, 48, this.position.x, this.position.y, 96, 48);
    }
}