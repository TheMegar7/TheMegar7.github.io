var select = null;
class Panel{
    constructor(_panel, _button, _buttonPress, _player, _wall, _nanianos, _fields, _home){
        this.player = _player;
        this.wall= _wall;
        this.nanianos= _nanianos;
        this.fields= _fields;
        this.home= _home;
        this.panelImg = _panel;
        this.imgButton = _button;
        this.imgButtonPress = _buttonPress;

        this.multiButton = _button;
        this.buyField = _button;
        this.buyWall = _button;
        this.repairWall = _button;
        this.buyArmour = _button;
        this.buyWeapon = _button;

        this.buttonPress = false;
        this.buttonPress1 = false;
        //Guardar todos los botones en una sola imagen
        //var buttonPressed = false

        //ubicaciones
        this.farmPos = {start: 960, end: 1200};
        this.wallPos = {start: this.wall.position.x, end: this.wall.position.x + 96};
        
        //ubicaciones en pantalla:
        this.screemUbis={//para botonex 2x1
            xMiddle: 489,
            yMiddle: 432,
            Width: 96,
            height: 48
        };


        //
        this.activeFields = 0;

        //tienda
        this.swords = [];
        this.sword1 = new Weapon("Espada roma", 2, 10, this.player, 1);
        this.sword2 = new Weapon("Espada afilada", 4, 25, this.player, 2);
        this.swords.push(this.sword1, this.sword2);

        this.armours = [];
        this.armour1 = new Armour("Armadura de cuero", 5, 10, 1);
        this.armour2 = new Armour("Media armadura de placas", 10, 20, 2);
        this.armour3 = new Armour("Armadura de placas completa", 20, 40, 3);
        this.armours.push(this.armour1, this.armour2, this.armour3);


    }

    Update(){
        
        if(this.player.position.x > this.farmPos.start && this.player.position.x < this.farmPos.end) select = 1;
        else if(this.player.position.x > this.wallPos.start && this.player.position.x < this.wallPos.end) select = 2;
        else if(this.player.position.x > 96*2 && this.player.position.x < 96*4) select = 3;
        else select = 0;
        
        switch(select){
            case 1:
                if(this.activeFields < 4){
                    if (Input.IsMousePressed()){
                        if(Input.mouse.x >= 489 && Input.mouse.x <= 582 && Input.mouse.y >= 432 && Input.mouse.y <= 477){
                            this.buyField = this.imgButtonPress;
                            this.buttonPress = true;
                        }
                    }
                    //al soltar (triggers)

                    else if (this.buttonPress == true){
                        let value = 5 * (this.activeFields+1);
                        if (this.home.money >= value){
                            this.nanianos[this.activeFields].Hire(this.fields[this.activeFields]);
                            this.fields[this.activeFields].BuildField();
                            this.home.money -= 5 * (this.activeFields+1);
                            
                            this.activeFields++;
                        }
                        this.buyField = this.imgButton;
                        this.buttonPress = false;

                    }

                }
                else this.buyField = this.imgButtonPress;

            break;
            case 2:

                if(this.wall.lvl < 3){
                    if (Input.IsMousePressed()){
                        if(Input.mouse.x >= (this.screemUbis.xMiddle - this.screemUbis.Width) && Input.mouse.x <= this.screemUbis.xMiddle
                        && Input.mouse.y >= this.screemUbis.yMiddle && Input.mouse.y <= this.screemUbis.yMiddle + this.screemUbis.height){
                            this.buyWall = this.imgButtonPress;
                            this.buttonPress = true;
                        }
                    }
                    //al soltar (triggers)
                    else if (this.buttonPress == true){
                        let value = 5 + (this.wall.lvl * 10);
                        if (this.home.money >= value){
                            this.home.money -= 5 + (this.wall.lvl * 10);
                            this.wall.LvlUp();
                        }
                        this.buyWall = this.imgButton;
                        this.buttonPress = false;
                        
                    }

                }
                else this.buyField = this.imgButtonPress;

                if(this.wall.hp != this.wall.maxHp){
                    
                    if (Input.IsMousePressed()){
                        if(Input.mouse.x >= this.screemUbis.xMiddle + this.screemUbis.Width && Input.mouse.x <= this.screemUbis.xMiddle + (this.screemUbis.Width*2)
                        && Input.mouse.y >= this.screemUbis.yMiddle && Input.mouse.y <= this.screemUbis.yMiddle + this.screemUbis.height){
                            this.repairWall = this.imgButtonPress;
                            this.buttonPress1 = true;
                        }
                    }
                    else if (this.buttonPress1 == false) this.repairWall = this.imgButton;
                    //al soltar (triggers)
                    else if (this.buttonPress1 == true){
                        if (this.home.money >= this.wall.repairCost){
                            this.wall.hp = this.wall.maxHp;
                            this.home.money -= this.wall.repairCost;
                            
                        }
                        this.repairWall = this.imgButton;
                        this.buttonPress1 = false; 
                    }
                }
                else this.repairWall = this.imgButtonPress;

            break;
            case 3:

                if (this.player.armour.id < 3){
                    if (Input.IsMousePressed()){
                        if(Input.mouse.x >= (this.screemUbis.xMiddle - this.screemUbis.Width) && Input.mouse.x <= this.screemUbis.xMiddle
                        && Input.mouse.y >= this.screemUbis.yMiddle && Input.mouse.y <= this.screemUbis.yMiddle + this.screemUbis.height){
                            this.buyArmour = this.imgButtonPress;
                            this.buttonPress = true;
                        }
                    }
                    //al soltar (triggers)
                    else if (this.buttonPress == true){
                        let value = this.armours[this.player.armour.id].cost;
                        if (this.home.money >= value){
                            this.home.money -= value;
                            this.player.armour = this.armours[this.player.armour.id];
                        }
                        this.buyArmour = this.imgButton;
                        this.buttonPress = false;
                        
                    }
                }
                else this.buyArmour = this.imgButtonPress;

                if(this.player.weapon.id < 2){
                    
                    if (Input.IsMousePressed()){
                        if(Input.mouse.x >= this.screemUbis.xMiddle + this.screemUbis.Width && Input.mouse.x <= this.screemUbis.xMiddle + (this.screemUbis.Width*2)
                        && Input.mouse.y >= this.screemUbis.yMiddle && Input.mouse.y <= this.screemUbis.yMiddle + this.screemUbis.height){
                            this.buyWeapon = this.imgButtonPress;
                            this.buttonPress1 = true;
                        }
                    }
                    else if (this.buttonPress1 == false) this.repairWall = this.imgButton;
                    //al soltar (triggers)
                    else if (this.buttonPress1 == true){
                        let value = this.swords[this.player.weapon.id].cost;
                        if (this.home.money >= value){
                            this.player.weapon = this.swords[this.player.weapon.id];
                            this.home.money -= value;
                            
                        }
                        this.buyWeapon = this.imgButton;
                        this.buttonPress1 = false; 
                    }
                }
                else this.buyWeapon = this.imgButtonPress;



            break;
            default:
                
                break;
        }
        
        //al pulsar
        /*if (Input.IsMousePressed()){
            //boton de prueba
            if(Input.mouse.x >= 489 && Input.mouse.x <= 582 && Input.mouse.y >= 432 && Input.mouse.y <= 477){
                this.actualImg = this.imgButtonPress;
                this.buttonPress = true;
            }
        }
        //al soltar (triggers)
        else if (this.buttonPress == true){
            this.actualImg = this.imgButton;
            this.buttonPress = false;
        }*/

    }
    Draw(ctx){
        
        ctx.fillStyle = "rgba(200, 160, 80, 1)";
        ctx.beginPath();
        ctx.rect(0, 384, 1080, 540-366);
        ctx.fill();
        
        ctx.drawImage(this.panelImg, 0, 384);


        ctx.textAlign = "start";
        ctx.fillStyle = "white";
        ctx.font = "12px Comic Sans MS regular";
        ctx.fillText("Money: " + this.home.money, 24, this.screemUbis.yMiddle);
        ctx.fillText("Home hp: " + this.home.hp, 24, this.screemUbis.yMiddle +12);
        ctx.fillText("Hired farmers: " + this.activeFields, 24, this.screemUbis.yMiddle + 24);

        ctx.fillText("Wall lvl: " + this.wall.lvl, 24, this.screemUbis.yMiddle + 48);
        ctx.fillText("Wall health: " + this.wall.hp, 24, this.screemUbis.yMiddle + 60);

        ctx.fillText("Armour: " + this.player.armour.name, 860, this.screemUbis.yMiddle);
        ctx.fillText("Bonus health: " + this.player.armour.armour, 860, this.screemUbis.yMiddle + 12);
        ctx.fillText("Weapon: " + this.player.weapon.name, 860, this.screemUbis.yMiddle + 36);
        ctx.fillText("Damage: " + this.player.weapon.damage, 860, this.screemUbis.yMiddle + 48);
        



        //Panel central
        //switch para cambiar de panel
        switch(select){
            case 1:
                ctx.drawImage(this.buyField, this.screemUbis.xMiddle, this.screemUbis.yMiddle);
                ctx.textAlign = "center";
                ctx.fillStyle = "white";
                ctx.font = "16px Comic Sans MS regular";

                ctx.fillText("Farm", this.screemUbis.xMiddle + 48, this.screemUbis.yMiddle - 20);

                
                if(this.activeFields < 4){
                    ctx.textAlign = "center";
                    ctx.fillStyle = "white";
                    ctx.font = "12px Comic Sans MS regular";
                    ctx.fillText("Buy Field", this.screemUbis.xMiddle + 48, this.screemUbis.yMiddle + 16);
                    ctx.fillText("(give gold)", this.screemUbis.xMiddle + 48, this.screemUbis.yMiddle + 32);
                    let value =(5 * (this.activeFields+1));
                    ctx.fillText(value + " gold", this.screemUbis.xMiddle + 48, this.screemUbis.yMiddle + 60);
                }
            break;
            case 2:
                ctx.textAlign = "center";
                ctx.fillStyle = "white";
                ctx.font = "16px Comic Sans MS regular";

                ctx.fillText("Wall", this.screemUbis.xMiddle + 48, this.screemUbis.yMiddle - 20);

                let value2 =(5 * (this.wall.lvl+1));
                ctx.drawImage(this.buyWall, this.screemUbis.xMiddle - this.screemUbis.Width, this.screemUbis.yMiddle);
                ctx.textAlign = "center";
                ctx.fillStyle = "white";
                ctx.font = "12px Comic Sans MS regular";
                ctx.fillText("Build Wall", this.screemUbis.xMiddle + 48 - this.screemUbis.Width, this.screemUbis.yMiddle + 24);

                if(this.wall.lvl < 3){
                    ctx.fillText(value2 + " gold", this.screemUbis.xMiddle + 48 - this.screemUbis.Width, this.screemUbis.yMiddle + 60);
                }

                ctx.drawImage(this.repairWall, this.screemUbis.xMiddle + this.screemUbis.Width, this.screemUbis.yMiddle);
                ctx.textAlign = "center";
                ctx.fillStyle = "white";
                ctx.font = "12px Comic Sans MS regular";
                ctx.fillText("Repair wall", this.screemUbis.xMiddle + 48 + this.screemUbis.Width, this.screemUbis.yMiddle + 24);

                if(this.wall.hp != this.wall.maxHp){
                    ctx.fillText(this.wall.repairCost + " gold", this.screemUbis.xMiddle + 48 + this.screemUbis.Width, this.screemUbis.yMiddle + 60);
                }

            break;
            case 3:
                ctx.textAlign = "center";
                ctx.fillStyle = "white";
                ctx.font = "16px Comic Sans MS regular";

                ctx.fillText("BlackSmith", this.screemUbis.xMiddle + 48, this.screemUbis.yMiddle - 20);    

                ctx.drawImage(this.buyArmour, this.screemUbis.xMiddle - this.screemUbis.Width, this.screemUbis.yMiddle);
                if(this.player.armour.id < 3){
                    let value3 = this.armours[this.player.armour.id].cost;
                    ctx.textAlign = "center";
                    ctx.fillStyle = "white";
                    ctx.font = "12px Comic Sans MS regular";
                    ctx.fillText("Buy:", this.screemUbis.xMiddle + 48 - this.screemUbis.Width, this.screemUbis.yMiddle + 16);
                    ctx.fillText(this.armours[this.player.armour.id].name, this.screemUbis.xMiddle + 48 - this.screemUbis.Width, this.screemUbis.yMiddle + 28);
                    ctx.fillText("+" + this.armours[this.player.armour.id].armour + " hp", this.screemUbis.xMiddle + 48 - this.screemUbis.Width, this.screemUbis.yMiddle + 40);

                    ctx.fillText(value3 + " gold", this.screemUbis.xMiddle + 48 - this.screemUbis.Width, this.screemUbis.yMiddle + 60);
                }
                else{
                    ctx.textAlign = "center";
                    ctx.fillStyle = "white";
                    ctx.font = "12px Comic Sans MS regular";
                    ctx.fillText("Sold Out", this.screemUbis.xMiddle + 48 + this.screemUbis.Width, this.screemUbis.yMiddle + 40);
                }

                ctx.drawImage(this.buyWeapon, this.screemUbis.xMiddle + this.screemUbis.Width, this.screemUbis.yMiddle);
                if(this.player.weapon.id < 2){
                    let value4 = this.swords[this.player.weapon.id].cost;
                    ctx.textAlign = "center";
                    ctx.fillStyle = "white";
                    ctx.font = "12px Comic Sans MS regular";
                    ctx.fillText("Buy:", this.screemUbis.xMiddle + 48 + this.screemUbis.Width, this.screemUbis.yMiddle + 16);
                    ctx.fillText(this.swords[this.player.weapon.id].name, this.screemUbis.xMiddle + 48 + this.screemUbis.Width, this.screemUbis.yMiddle + 28);
                    ctx.fillText(this.swords[this.player.weapon.id].damage + " Damage", this.screemUbis.xMiddle + 48 + this.screemUbis.Width, this.screemUbis.yMiddle + 40);

                    ctx.fillText(value4 + " gold", this.screemUbis.xMiddle + 48 + this.screemUbis.Width, this.screemUbis.yMiddle + 60);
                }
                else{
                    ctx.textAlign = "center";
                    ctx.fillStyle = "white";
                    ctx.font = "12px Comic Sans MS regular";
                    ctx.fillText("Sold Out", this.screemUbis.xMiddle + 48 + this.screemUbis.Width, this.screemUbis.yMiddle + 40);
                }

            break;
            default:
                ctx.drawImage(this.imgButtonPress, this.screemUbis.xMiddle, this.screemUbis.yMiddle);
                break;
        }
    }
}