var canvas = /** @type {HTMLCanvasElement} */(null);
var ctx = /** @type {CanvasRenderingContext2D} */(null);

var time = 0,
    fps = 0,
    framesAcum = 0,
    acumDelta = 0;
var targetDT = 1/60; // 60 fps
var globalDT;

// stats usar esto u objeto
var money = 10;
var vaultHp = 5;
var vaultPosition = 48 * 9;

//ASSETS Y AUDIOS
var assets = {
    villagers:{
        img: null,
        path: "./assets/Workless_sheet.png"
    },
    farmer:{
        img: null,
        path: "./assets/Farmer_sheet.png"
    },
    smith:{
        img: null,
        path: "./assets/Smith_sheet.png"
    },
    player:{
        img: null,
        path: "./assets/Samurai_sheet.png"
    },
    malandro:{
        img: null,
        path: "./assets/Malandro_sheet.png"
    },
    mouse:{
        img: null,
        path: "./assets/Feather.png"
    },
    clock:{
        img: null,
        path: "./assets/Clock.png"
    },
    clockFront:{
        img: null,
        path: "./assets/Clock_front.png"
    },
    healbar:{
        img: null,
        path: "./assets/healbar.png"
    },
    panel:{
        img: null,
        path: "./assets/panel02.png"
    },

    
    wall:{
        img: null,
        path: "./assets/wall_Sheet.png"
    },
    field:{
        img: null,
        path: "./assets/Crops_sheet.png"
    },
    buildings:{
        img: null,
        path: "./assets/Buildings_sheet.png"
    },
    flame:{
        img: null,
        path: "./assets/Flame_sheet.png"
    },
    smoke: {
        img: null,
        path: "./assets/smoke.png"
    },
    tile:{
        img: null,
        path: "./assets/testTile.png"
    },
    button:{
        img: null,
        path:"./assets/testButton.png"
    },
    buttonPress:{
        img: null,
        path:"./assets/testButtonPress.png"
    },
    ndoPlano:{
        img: null,
        path:"./assets/SegundoPlano_BG.png"
    },
    erPlano:{
        img: null,
        path:"./assets/TercerPlano_BG.png"
    },
    toPlano:{
        img: null,
        path:"./assets/CuartoPlano_BG.png"
    },

}
var audios= {
    espadazo: null,
}

var player = null;
var home = null;
var wall = null;
var fields = [];
var nanianos = [];
var smith = null;
var camera = null;
var background = null;
var flameFrames = 0;
var panel = null;
var tiles = [];
var nOfTiles = 37;
var tileIdList = [];
tileIdList.push(1, 2, 4, 1, 3, 2, 1, 4, 4, 2, 3, 2, 1, 3, 2, 1, 1, 3, 4, 2, 4, 4, 3, 1, 2, 1, 3, 1, 4, 2, 2, 3, 1, 3, 2, 1, 4);
//mejorar esto, meter todos los tiles en una misma imagen
var enemy = null;
var enemies = [];
var spawnTimer = 1;
var spawnTimerAux= 1;
var spawnCount = 0;

var clock = {
    time: 0,
    dayTime: 720,
    dayAuxTime: 0,
    nightTime: 240,
    nightTimeAux: 240,
    day: 1
}
var sceneLimits = {
    x: 0,
    y: 0,
    width: 3456,
    height: 540
}

var gameOver = false;
var enemiesKilled = 0;


function LoadImages(assets, onloaded){
    let imagesToLoad = 0;
    const onload = () => --imagesToLoad === 0 && onloaded();
    // iterate through the object of assets and load every image
    for (let asset in assets) {
        if (assets.hasOwnProperty(asset)) {
            imagesToLoad++; // one more image to load

            // create the new image and set its path and onload event
            const img = assets[asset].img = new Image;
            img.src = assets[asset].path;
            img.onload = onload;
        }
    }
    
    return assets;
}

function Init() {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

    // input setup
    SetupKeyboardEvents();
    SetupMouseEvents();
    
    // assets loading
    LoadImages(assets, () => {
        audios.espadazo = document.getElementById("audioEspadazo");
        Start();
        Loop();
    });
}

function Start() {
    time = performance.now();
    clock.dayTime = 0;

    alert("        Bienvenido a 7 KINGDOMS: ROAD TO GENERAL!!!               Muevete hacia los lados con A y D, ataca haciendo clic en la parte superior de la pantalla con el ratón e interactua con los comenrciantes y edificios desde el panel inferior. Para empezar te recomiendo que contrates un granjero desde la granja de la derecha y construllas un muro, por la noche las cosas se pondrán dificiles!!");
    
    // initialize the player //Aqui tengo que meter la ubicación de inicio del player y la imagen (?) del player.
    player = new Player( assets.player.img, new Vector2(canvas.width / 2, 336), 5);
    //wolrd buildings
    home = new Home;
    wall = new Wall(assets.wall.img, new Vector2( 48 * 30, 336));
    for(i = 0; i < 4; i++){
        let field = new Field( assets.field.img, (48 * 34) + (i * 48 * 8)/* posición inicial más posición respecto al primero*/ );
        fields.push(field);
    }
    for(i = 0; i < 4; i++){//nanianos
        let naniano = new Farmer(assets.villagers.img, (48 * 2) + (i * 96 * 4)/* posición inicial más posición respecto al primero*/, assets.farmer.img, i);
        nanianos.push(naniano);
    }
    smith = new Smith(assets.smith.img);
    
    panel = new Panel(assets.panel.img, assets.button.img, assets.buttonPress.img, player, wall, nanianos, fields, home);
    camera = new Camera(player);
    background = new Background(sceneLimits.width, sceneLimits.height, 48, camera, assets.ndoPlano.img, assets.erPlano.img, assets.toPlano.img, assets.buildings.img);
    //Tiles
    for (i = 0; i < nOfTiles; i++){
        let tile
        tile = new Tile(assets.tile.img, i, tileIdList[i]);
        tiles.push(tile);
    }
    //tiles = new Tile();
    camera.Start();

    // one enemy //esto tengo que borrarlo
    //enemy = new Enemy(assets.villagers.img, new Vector2 (3456, 336), 4/*hp*/, wall, player, home);
    //enemy spawn for the moment
    //let enemy = new Enemy(assets.malandro.img, new Vector2 (3456, 336), 4/*hp*/, wall, player, home);
    //enemies.push(enemy);
}

function Loop() {
    requestAnimationFrame(Loop);

    let now = performance.now();
    let deltaTime = (now - time) / 1000;
    globalDT = deltaTime;
    
    //Clock
    clock.time += deltaTime * 6;
    if(clock.time <= 720) {
        
        clock.nightTime = 240;
        clock.dayTime = clock.time;
    }
    else if(clock.time > 720){
        clock.dayTime = 720;
        clock.nightTime = clock.time - 720;
    }
    if(clock.time > 960 || clock.time < 0){
        clock.day++;
        clock.time = 0;
    } 
    clock.dayAuxTime = 1 - clock.dayTime/720;
    clock.nightTimeAux = clock.nightTime/240;
    //
    time = now;
    framesAcum++;
    acumDelta += deltaTime;

    if (acumDelta >= 1) {
        fps = framesAcum;
        framesAcum = 0;
        acumDelta -= 1;
    }
    if (deltaTime > 1) return;
    
    // Update the games logic
    Update(deltaTime);
    // Draw the game elements
    Draw();
}

function Update(deltaTime) {
    if(clock.time ==0){
        if(player.hp <= 0){
            player.position.x = 7 * 96;
        }
        player.position.y = 336;
        player.hp = player.maxHp + player.armour.armour;

        home.money += 5*panel.activeFields;
    }
    
    money = home.money;
    
    // update the enemies
    enemies.forEach(enemy => enemy.Update(deltaTime));
    //enemy.Update(deltaTime);

    if (gameOver) return;

    // update the player
    player.Update(deltaTime);
    //update enemigos
    
    //
    background.Update(deltaTime);
    fields.forEach(field => field.Update(clock.day));
    nanianos.forEach(naniano => naniano.Update(deltaTime, clock.time));
    smith.Update(deltaTime);
    //
    panel.Update();

    // update the camera
    camera.Update(deltaTime);

    //Player Weapon vs enemies collision
    
    //lo de abajo hay que hacerlo por cada enemigo
    for (let i = enemies.length - 1; i >= 0; i--){
        
        let rectangle = { 
            position: {x: player.weapon.position.x, y: player.weapon.position.y}, 
            width: 48 + 40 + 4, 
            height: 54
        }
        
        if(enemies[i].lastAttack != player.lastAttack && player.weapon.active){
            if(CheckCollisionRect(enemies[i].position, rectangle)){
                enemies[i].lastAttack = player.lastAttack;
                enemies[i].life -= player.weapon.damage;
        
                console.log("Hit");
            }
        }
        
        let enemyRectangle = { 
            position: {x: enemies[i].position.x, y: 336 -54}, 
            width: (64 + 4), 
            height: 56
        }
        if (enemies[i].directionModifier < 0) enemyRectangle.position.x -= 68;
        
        if (CheckCollisionRect (player.position, enemyRectangle) && enemies[i].hit){
            
            player.hp -= 1;
            
            console.log("Enemy Hit player");
        }
        enemyRectangle.position.x -= 68;
        enemyRectangle.width += 68;
        
        if (CheckCollisionRect (wall.position, enemyRectangle) && enemies[i].hit){
            
            wall.hp -= 1;
            
            console.log("Enemy Hit wall");
        }
        
        if (enemies[i].position.x < (96*7) && enemies[i].hit){
            
            if(home.money > 0) home.money--;
            else if(home.hp > 0 && home.money <= 0) home.hp--;
            
            console.log("Enemy Hit home");
        }
        
        if(enemies[i].position.x > 3600){
            enemies.splice(i, 1);
        } 
        
        if(enemies.length != 0){
            if(enemies[i].life <= 0){
                enemies.splice(i, 1);
                enemiesKilled++;
            }
        }
    }
    
    if(home.hp <= 0){
        gameOver = true;
    } 
    
    if(player.hp <= 0){
        player.position.y = 336 + 144;
    }
    //#region old stuff
    // player bullets vs enemies collisions
    /*
    for (let i = player.bullets.bullets.length - 1; i >= 0; i--) {
        const bullet = player.bullets.bullets[i];
        if (bullet.active) {
            for (let j = enemies.length - 1; j >= 0; j--) {
                if (bullet.active && CheckCollisionCircle(bullet.position, enemies[j].position, enemies[j].boundingRadius2)) {
                    const enemyKilled = enemies[j].Damage(bullet.damage);

                    player.bullets.Deactivate(bullet);

                    camera.Shake(0.1, 100, 3);

                    if (enemyKilled) {
                        enemies.splice(j, 1);
                        enemiesKilled++;
                    }
                }
            }
        }
    }
    */
    // check for enemies out of bounds && enemies-player collision
    /*
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemyPos = enemies[i].position;

        // enemies-player collision
        const dist2 = Vector2.SqrMagnitude(enemyPos, player.position);

        if (dist2 < enemies[i].boundingRadius2 + player.boundingRadius2) {
            gameOver = true;
        }

        // enemy out of bounds
        if (enemyPos.x < sceneLimits.x - 100 ||
            enemyPos.x > sceneLimits.x + sceneLimits.width + 100 ||
            enemyPos.y < sceneLimits.y - 100 ||
            enemyPos.y > sceneLimits.y + sceneLimits.height + 100) {
            enemies.splice(i, 1);
        }
    }
    */
   //#endregion

    // enemies spawning
    if(clock.nightTime == 240){
        spawnCount = 0;
    }
    else if (clock.time >= 725){
        spawnTimerAux -= deltaTime;
        if (spawnTimerAux <= 0 && spawnCount <= (2 + clock.day)){
            let enemy = new Enemy(assets.malandro.img, new Vector2 (3552, 336), 4/*hp*/, wall, player, home);
            enemies.push(enemy);
            spawnCount++;
            spawnTimerAux = spawnTimer;
        }
    }

    flameFrames++;
    if(flameFrames >= 80) flameFrames = 0;


}

function Draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // background
    if(clock.time < 720){
        ctx.fillStyle = "rgba(150, 150, 255, 1)";
    }
    else{
        ctx.fillStyle = "rgba(0, 0, 100, 1)";
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    camera.PreDraw(ctx); //De qeui pabajo todo lo que pase en escena //////////////////////////////////////////////////////////
    
    // grid
    background.Draw(ctx);
    //Draw tiles
    tiles.forEach(tile => tile.Draw(ctx));
    
    //fueguito
    let frm = Math.trunc(this.flameFrames/10);
    ctx.drawImage(assets.flame.img, 0, 144 * frm, 48 *2, 48 * 3, 48 *26.4, 336 - (48*3) -8, 48*2 , 48*3);

    //Buildings
    wall.Draw(ctx);
    fields.forEach(field => field.Draw(ctx));

    //NPCS
    nanianos.forEach(naniano => naniano.Draw(ctx));
    smith.Draw(ctx);

    // draw the enemies
    //enemy.Draw(ctx);
    enemies.forEach(enemy => enemy.Draw(ctx));

    // draw the player
    player.Draw(ctx);

    camera.PostDraw(ctx); //De aqui parriba todo lo que pase en escena //////////////////////////////////////////////////////////

    panel.Draw(ctx);

    if (gameOver) {
        DrawGameOverScreen();
    }

    Clock(ctx);

    Healbar(ctx);

    if(player.hp <= 0){
        Wasted(ctx);
    }

    // mouse
    ctx.drawImage(assets.mouse.img, Input.mouse.x, Input.mouse.y - 16*3);

    // draw the fps
    //DrawStats(ctx)
}

function DrawStats(ctx) {
    ctx.textAlign = "start";
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(2, 2, 110, 54);
    ctx.fillStyle = "white";
    ctx.font = "12px Comic Sans MS regular";
    
    
    ctx.fillText("FPS: " + fps, 6, 14);
    ctx.fillText("FPS (dt): " + (1 / globalDT).toFixed(2), 6, 32);
    ctx.fillText("deltaTime: " + (globalDT).toFixed(4), 6, 50);
}

function Clock(ctx){
    ctx.drawImage(assets.clock.img, 1029 - 96/2, 48 -96/2);
    ctx.fillStyle = "rgba(150, 150, 255, 1)";
    ctx.beginPath();
    ctx.arc(1029, 48, 42, Math.PI, - clock.dayAuxTime * Math.PI);
    ctx.lineTo(1029, 48);
    ctx.fill();
    ctx.fillStyle = "rgba(0, 0, 255, 1)";
    ctx.beginPath();
    ctx.arc(1029, 48, 42, 0, clock.nightTimeAux * Math.PI);
    ctx.lineTo(1029, 48);
    ctx.fill();
    ctx.drawImage(assets.clockFront.img, 1029 - 96/2, 48 -96/2);
}

function Healbar(ctx){
    ctx.drawImage(assets.healbar.img, 0, 4);
    ctx.fillStyle = "rgba( 0, 255, 0, 1)";
    ctx.beginPath();
    ctx.rect(6, 64, 10 * player.hp, 12);
    ctx.fill();

    ctx.textAlign = "start";
    ctx.fillStyle = "white";
    ctx.font = "12px Comic Sans MS regular";
    ctx.fillText(player.hp, 10 + (10 *player.hp), 74);

    ctx.fillStyle = "rgba( 100, 170, 255, 1)";
    ctx.beginPath();
    ctx.rect(6, 88, player.extenuationAux/25 * 6, 6);
    ctx.fill();
}

function Wasted(ctx) {
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = "36px Comic Sans MS regular";

    ctx.fillText("Downed, wait till day", canvas.width / 2, 60);
}

function DrawGameOverScreen() {
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = "60px Comic Sans MS regular";

    ctx.fillText("GAME OVER MAN!!!", canvas.width / 2, 220);
    ctx.font = "32px Comic Sans MS regular";
    ctx.fillText("score: " + enemiesKilled, canvas.width / 2, 220 + 60);
}

window.onload = Init;