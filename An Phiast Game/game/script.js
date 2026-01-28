const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// player sprite
const sprites = {
    up: new Image(),
    down: new Image(),
    left: new Image(),
    right: new Image()
};

// key sprites
const keySprite = new Image();
keySprite.src = "assets/images/key.png";
const key2Sprite = new Image();
key2Sprite.src = "assets/images/key2.png";
const key3Sprite = new Image();
key3Sprite.src = "assets/images/key3.png";

// load player sprites with directions
sprites.up.src = "assets/images/player_up.png";
sprites.down.src = "assets/images/player_down.png";
sprites.left.src = "assets/images/player_left.png";
sprites.right.src = "assets/images/player_right.png";

// bow and arrow sprites
const bowSprite = new Image();
bowSprite.src = "assets/images/bow.png";
const arrowSprite = new Image();
arrowSprite.src = "assets/images/arrow.png";

// enemy objects
let enemy1 = null;
let enemy2 = null;
let enemy3 = null;

// enemy sprites
const enemy1Sprite = new Image();
enemy1Sprite.src = "assets/images/bluespider.png";

const enemy2Sprite = new Image();
enemy2Sprite.src = "assets/images/redspider.png";

const enemy3Sprite = new Image();
enemy3Sprite.src = "assets/images/bat.png";     

// heart sprite
const heartSprite = new Image();
heartSprite.src = "assets/images/heart.png";

// background sound
const backgroundSound = new Audio("assets/sounds/cavesounds.mp3");
backgroundSound.loop = true;// loop 
backgroundSound.volume = 0.2; // set volume

// walking sound
const walkingSound = new Audio("assets/sounds/walksound.mp3");
walkingSound.loop = true; // loop
walkingSound.volume = 0.06; //

// key pickup sound
const keyPickupSound = new Audio("assets/sounds/keysound.mp3");
keyPickupSound.volume = 0.1;

// bow shooting sound
const shootSound = new Audio("assets/sounds/bowshoot.mp3");
shootSound.volume = 0.1; 

// player hit sound
const playerHitSound = new Audio("assets/sounds/hitsound.mp3");
playerHitSound.volume = 0.1;

// enemy hit sound
const enemyHitSound = new Audio("assets/sounds/hitsound.mp3");
enemyHitSound.volume = 0.1;

// player death sound
const playerDeathSound = new Audio("assets/sounds/playerdeath.mp3");
playerDeathSound.volume = 0.1;

// level complete sound
const levelCompleteSound = new Audio("assets/sounds/levelup.mp3");
levelCompleteSound.volume = 0.05;



// bow and arrow objects
let bow = null;
let arrow = null;    

// player object
let player = {
    x: 250,
    y: 550,
    size: 65,
    speed: 5.0,
    frameX: 0,
    maxFrame: 3,
    frameDelay: 10,
    frameCounter: 0,
    direction: "down"
};

// keys pressed
let pressedKeys = {};

// game state
let gameState = "menu";

// background image
const background = new Image();

let score = 0; // level 3 score
let health = 3; // player health
let invincible = false;

let showEnding = false; //end screen


// levels definition
const levels = [
    {
        backgroundSrc: "assets/images/background.png",
        walls: [
            { x: 118, y: 371, width: 32, height: 397 },//boundary walls array
            { x: 149, y: 358, width: 161, height: 22 },
            { x: 310, y: 244, width: 13, height: 134 },
            { x: 331, y: 224, width: 169, height: 28 },
            { x: 493, y: 73, width: 8, height: 148 },
            { x: 515, y: 71, width: 457, height: 13 },
            { x: 976, y: 91, width: 16, height: 69 },
            { x: 997, y: 154, width: 334, height: 12 },
            { x: 1330, y: 160, width: 15, height: 142 },
            { x: 1349, y: 305, width: 257, height: 12 },
            { x: 1606, y: 327, width: 13, height: 84 },
            { x: 1625, y: 401, width: 135, height: 22 },
            { x: 1759, y: 429, width: 11, height: 169 },
            { x: 1615, y: 602, width: 140, height: 10 },
            { x: 1610, y: 614, width: 4, height: 140 },
            { x: 1187, y: 758, width: 418, height: 15 },
            { x: 1175, y: 775, width: 8, height: 89 },
            { x: 630, y: 860, width: 543, height: 7 },
            { x: 622, y: 778, width: 7, height: 81 },
            { x: 147, y: 773, width: 473, height: 8 },

            { x: 177, y: 417, width: 93, height: 30},//inside barriers
            { x: 356, y: 264, width: 144, height: 33},
            { x: 1027, y: 386, width: 140, height: 54},
            { x: 891, y: 110, width: 80, height: 60},
            { x: 981, y: 182, width: 51, height: 36},
            { x: 1198, y: 223, width: 96, height: 29},
            { x: 947, y: 582, width: 45, height: 40},
            { x: 1534, y: 352, width: 50, height: 44},
            { x: 1509, y: 699, width: 59, height: 43},
            { x: 868, y: 769, width: 97, height: 23},
            { x: 1025, y: 787, width: 99, height: 21},
            { x: 649, y: 796, width: 41, height: 40},
        ],
        key: { x: 800, y: 200, size: 30, collected: false },//key postion
        exitWall: { x: 1759, y: 429, width: 50, height: 169 }//exit wall location
    },
    {
        backgroundSrc: "assets/images/background2.png",
        walls: [
            { x: 242, y: 533, width: 9, height: 81},//boundary walls array lvl 2
            { x: 239, y: 524, width: 68, height: 7},
            { x: 312, y: 227, width: 7, height: 297},
            { x: 318, y: 224, width: 122, height: 3},
            { x: 471, y: 235, width: 2, height: 127},
            { x: 471, y: 372, width: 78, height: 1},
            { x: 548, y: 221, width: 6, height: 147},
            { x: 556, y: 220, width: 129, height: 8},
            { x: 705, y: 222, width: 5, height: 142},
            { x: 709, y: 362, width: 253, height: 13},
            { x: 957, y: 388, width: 4, height: 54},
            { x: 466, y: 452, width: 491, height: 10},
            { x: 467, y: 463, width: 3, height: 66},
            { x: 470, y: 527, width: 752, height: 3},
            { x: 1220, y: 532, width: 4, height: 84},
            { x: 1131, y: 618, width: 92, height: 3},
            { x: 1131, y: 620, width: 2, height: 50},
            { x: 1134, y: 669, width: 164, height: 1},
            { x: 1306, y: 458, width: 3, height: 208},
            { x: 1064, y: 454, width: 245, height: 4},
            { x: 1059, y: 378, width: 3, height: 62},
            { x: 1069, y: 373, width: 231, height: 4},
            { x: 1298, y: 326, width: 3, height: 47},
            { x: 769, y: 321, width: 525, height: 4},
            { x: 762, y: 223, width: 2, height: 88},
            { x: 770, y: 215, width: 850, height: 4},
            { x: 1639, y: 219, width: 4, height: 180},
            { x: 1645, y: 396, width: 50, height: 11},
            { x: 1700, y: 410, width: 3, height: 74},
            { x: 1526, y: 489, width: 155, height: 6},
            { x: 1512, y: 327, width: 3, height: 156},
            { x: 1454, y: 324, width: 47, height: 4},
            { x: 1453, y: 328, width: 3, height: 198},
            { x: 1454, y: 526, width: 165, height: 5},
            { x: 1616, y: 534, width: 3, height: 73},
            { x: 1455, y: 616, width: 161, height: 2},
            { x: 1455, y: 616, width: 2, height: 53},
            { x: 1457, y: 669, width: 150, height: 5},
            { x: 1622, y: 678, width: 3, height: 82},
            { x: 295, y: 764, width: 1314, height: 5},
            { x: 286, y: 683, width: 6, height: 74},
            { x: 292, y: 665, width: 664, height: 8},
            { x: 954, y: 621, width: 6, height: 45},
            { x: 231, y: 616, width: 724, height: 11},
        ],
        key: { x: 1110, y: 413, size: 30, collected: false },//key position
        exitWall: { x: 1688, y: 408, width: 5, height: 76}//exit wall location
    },

    {
        backgroundSrc: "assets/images/background_3.png",
        walls: [
            { x: 196, y: 337, width: 7, height: 306},//boundary walls array lvl 3
            { x: 209, y: 323, width: 220, height: 4},
            { x: 429, y: 210, width: 6, height: 113},
            { x: 440, y: 209, width: 216, height: 7},
            { x: 656, y: 92, width: 3, height: 116},
            { x: 664, y: 94, width: 597, height: 3},
            { x: 1253, y: 98, width: 2, height: 117},
            { x: 1257, y: 213, width: 228, height: 7},
            { x: 1480, y: 221, width: 5, height: 108},
            { x: 1487, y: 329, width: 225, height: 3},
            { x: 1712, y: 332, width: 5, height: 316},
            {x: 1486, y: 643, width: 227, height: 2},
            {x: 1481, y: 643, width: 5, height: 113},
            {x: 1258, y: 754, width: 223, height: 2},
            {x: 1255, y: 754, width: 3, height: 108},
            {x: 660, y: 861, width: 595, height: 3},
            {x: 660, y: 763, width: 3, height: 98},
            {x: 436, y: 758, width: 217, height: 7},
            {x: 430, y: 651, width: 6, height: 107},
            {x: 204, y: 644, width: 226, height: 7},

        ],
        key: { x: 1110, y: 413, size: 30, collected: false },//key position
        bow: { x: 800, y: 450, size: 60, collected: false },//bow position
        exitWall: { x: 1712, y: 332, width: 5, height: 316}
    },

    {
    backgroundSrc: "assets/images/background4.png",
        walls: [
            {x: 137, y: 375, width: 1, height: 163},
            {x: 149, y: 549, width: 142, height: 2},
            {x: 408, y: 550, width: 150, height: 1},
            {x: 672, y: 550, width: 128, height: 2},
            {x: 675, y: 550, width: 119, height: 1},
            {x: 908, y: 589, width: 124, height: 1},
            {x: 1153, y: 590, width: 138, height: 1},
            {x: 1390, y: 544, width: 124, height: 1},
            {x: 1620, y: 523, width: 144, height: 1},


            



        ],
        key: {},
        exitWall: { }
    }

    
];

const hintBox = document.getElementById("hintBox");// hint box element
const hint = document.getElementById("hint");

// update hint text based on level
function updateHintText() {
    if (currentLevel === 0) {
        hintBox.textContent = "Find something lying around and follow the path";
    } else if (currentLevel === 1) {
        hintBox.textContent = "It's dark... find the key and exit quickly!";
    } else if (currentLevel === 2) {
        hintBox.textContent = "Defeat enemies to raise your score and reveal the key.";
    } else if (currentLevel === 3) {
        hintBox.textContent = "Jump Jump Jump!!!";
    } else {
        hintBox.textContent = "";
    }
    
}


// current level
let currentLevel = 0;

let walls = [];
let key = {};

// load a level
function loadLevel(levelIndex) {
    const level = levels[levelIndex];

    background.src = level.backgroundSrc;// set background image
    walls = level.walls;// set walls

    key = level.key;// set key
    key.collected = false;// reset key collection

    if (levelIndex === 2) {
        key.spawned = false; // key won’t appear until score >= 50
    } else {
        key.spawned = true; // key visible normally for other levels
    }

    if (levelIndex === 3) {
        player.x = 177;
        player.y = 474;
    }
    else {
        player.x = 250;
        player.y = 550;
    }

    bow = level.bow || null;
    if (bow) bow.collected = false;

    // reset player position
    player.direction = "down";
    player.frameX = 0;
    player.frameCounter = 0;

    if (levelIndex === 2) {
    health = 3; // reset health for final level
    } else {
        health = 0; // no health display for earlier levels
    }
    invincible = false;

    enemy1 = null;
    enemy2 = null;
    enemy3 = null;
    updateHintText();

    
}

//load first level
loadLevel(currentLevel);

// key listeners
window.addEventListener("keydown", function(event) {
    let key = event.key.toLowerCase();
    pressedKeys[key] = true;
});

window.addEventListener("keyup", function(event) {
    let key = event.key.toLowerCase();
    pressedKeys[key] = false;
});

// collision detection
function isColliding(rect1, rect2) {
    const rect1Width = rect1.width || rect1.size;
    const rect1Height = rect1.height || rect1.size;
    const rect2Width = rect2.width || rect2.size;
    const rect2Height = rect2.height || rect2.size;

    return (
        rect1.x < rect2.x + rect2Width &&
        rect1.x + rect1Width > rect2.x &&
        rect1.y < rect2.y + rect2Height &&
        rect1.y + rect1Height > rect2.y
    );
}

// animate enemy
function animateEnemy(enemy) {
    enemy.frameCounter++;
    if (enemy.frameCounter >= enemy.frameDelay) {
        enemy.frameCounter = 0;
        enemy.frameX = (enemy.frameX + 1) % (enemy.maxFrame + 1);
    }
}

function update() {
    let moving = false;
    let nextX = player.x;
    let nextY = player.y;

    // movement for player
    if (pressedKeys["w"]) {
        nextY -= player.speed;
        player.direction = "up";
        moving = true;
    } else if (pressedKeys["s"]) {
        nextY += player.speed;
        player.direction = "down";
        moving = true;
    }

    if (pressedKeys["a"]) {
        nextX -= player.speed;
        player.direction = "left";
        moving = true;
    } else if (pressedKeys["d"]) {
        nextX += player.speed;
        player.direction = "right";
        moving = true;
    }

        // walking sound
    if (moving) {
        
        if (walkingSound.paused) {
            walkingSound.currentTime = 0; // start from beginning
            walkingSound.play();
        }
    } else {
        // stop sound when player stops moving
        if (!walkingSound.paused) {
            walkingSound.pause();
        }
    }


    // collision with walls
    let hitWall = false;
    for (let wall of walls) {
        if (
            nextX < wall.x + (wall.width || wall.size) &&
            nextX + player.size > wall.x &&
            nextY < wall.y + (wall.height || wall.size) &&
            nextY + player.size > wall.y
        ) {
            hitWall = true;
            break;
        }
    }

    if (!hitWall) {
        player.x = nextX;
        player.y = nextY;
    }

    // player animation
    if (moving) {
        player.frameCounter++;
        if (player.frameCounter >= player.frameDelay) {
            player.frameCounter = 0;
            player.frameX = (player.frameX + 1) % (player.maxFrame + 1);
        }
    } else {
        player.frameX = 0;
    }

    // screen bounds
    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;
    if (player.x > canvas.width - player.size) player.x = canvas.width - player.size;
    if (player.y > canvas.height - player.size) player.y = canvas.height - player.size;

    // key collection
    if (!key.collected && isColliding(player, key)) {
        key.collected = true;
        console.log("Key collected!");

        keyPickupSound.currentTime = 0;
        keyPickupSound.play(); //play key sound
    }

    // pick up bow and spawn enemies in level 3
    if (bow && !bow.collected && isColliding(player, bow)) {
        bow.collected = true;

        if (currentLevel === 2) {
            enemy1 = { x: 1518, y: 368, startX: 1518, startY: 388, size: 70, speed: 0.2, frameX: 0, maxFrame: 7, frameCounter: 0, frameDelay: 10 };
            enemy2 = { x: 1518, y: 456, startX: 1518, startY: 476, size: 70, speed: 0.5, frameX: 0, maxFrame: 7, frameCounter: 0, frameDelay: 10 };
            enemy3 = { x: 1518, y: 547, startX: 1518, startY: 587, size: 55, speed: 1, frameX: 0, maxFrame: 4, frameCounter: 0, frameDelay: 10 };
        }
    }

    // enemy animation and movement
    if (enemy1) { moveEnemy(enemy1); animateEnemy(enemy1); }
    if (enemy2) { moveEnemy(enemy2); animateEnemy(enemy2); }
    if (enemy3) { moveEnemy(enemy3); animateEnemy(enemy3); }

    // shoot arrow if bow collected
    if (bow && bow.collected && pressedKeys[" "] && !arrow) {
        let arrowSpeed = 12;
        let arrowX = player.x + player.size / 2;
        let arrowY = player.y + player.size / 2;

        arrow = {
            x: arrowX,
            y: arrowY,
            width: 80,
            height: 40,
            speed: arrowSpeed,
            direction: player.direction
        };

        shootSound.currentTime = 0;
        shootSound.play();
    }

    // move arrow and handle collisions
    if (arrow) {
        if (arrow.direction === "right") arrow.x += arrow.speed;
        else if (arrow.direction === "left") arrow.x -= arrow.speed;
        else if (arrow.direction === "up") arrow.y -= arrow.speed;
        else if (arrow.direction === "down") arrow.y += arrow.speed;

        // collision with walls
        for (let w of walls) {
            if (arrow.x < w.x + (w.width || w.size) &&
                arrow.x + arrow.width > w.x &&
                arrow.y < w.y + (w.height || w.size) &&
                arrow.y + arrow.height > w.y) {
                arrow = null;
                break;
            }
        }

        // collision with enemies
        const enemies = [enemy1, enemy2, enemy3];
        for (let i = 0; i < enemies.length; i++) {
            let e = enemies[i];
            if (e && arrow && isColliding(arrow, e)) {

                enemyHitSound.currentTime = 0;//enemy hit sound
                enemyHitSound.play();

                e.x = e.startX;
                e.y = e.startY;
                arrow = null;

                if (currentLevel === 2) score += 5;

                break;
            }
        }

        // remove arrow if off screen
        if (arrow && (arrow.x > canvas.width || arrow.x + arrow.width < 0 || arrow.y > canvas.height || arrow.y + arrow.height < 0)) {
            arrow = null;
        }
    }

    // enemy movement towards player
    function moveEnemy(enemy) {
        let dx = player.x - enemy.x;
        let dy = player.y - enemy.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
            enemy.x += (dx / dist) * enemy.speed;
            enemy.y += (dy / dist) * enemy.speed;
        }
    }

    // player enemy collisions
if (!invincible && currentLevel === 2) {
    let hit = false;

    // check collision with each enemy
    if (enemy1 && isColliding(player, enemy1)) hit = true;
    if (enemy2 && isColliding(player, enemy2)) hit = true;
    if (enemy3 && isColliding(player, enemy3)) hit = true;

    if (hit) {
        health -= 1;
        console.log("Player hit! Health:", health);

        playerHitSound.currentTime = 0;
        playerHitSound.play(); // play hit sound

        invincible = true;
        setTimeout(() => invincible = false, 1500); // 1.5s invincibility

        if (health <= 0) {
        console.log("Player died. Restarting level 3...");

        playerDeathSound.currentTime = 0;
        playerDeathSound.play(); // play death sound

        textBox.innerHTML = "<p>You died! Try again.</p>";
        textBox.classList.remove("hidden");

            setTimeout(() => {
                score = 0; // reset score
                health = 3; // reset health
                loadLevel(2); // reload level 3
                currentLevel = 2; // level index
            }, 500);// delay
            
            setTimeout(() => {
                textBox.classList.add("hidden"); // hide text box
            }, 2000);

        }
    }
}

    // remove enemies and spawn key if score hits 50 in level 3
    if (currentLevel === 2 && score >= 50 && !key.spawned) {
        enemy1 = null;
        enemy2 = null;
        enemy3 = null;

        // place key and mark it as spawned
        key.x = 1500;
        key.y = 450;
        key.size = 30;
        key.collected = false;
        key.spawned = true;

        console.log("Key has spawned!");
    }

    // exit wall collision
    const exit = levels[currentLevel].exitWall;
    const exitHitbox = { x: exit.x - 10, y: exit.y - 10, width: exit.width + 20, height: exit.height + 20 };

    // level completion
    if (key.collected && isColliding(player, exitHitbox)) {

        levelCompleteSound.currentTime = 0;
        levelCompleteSound.play();

        currentLevel++;
        
    if (currentLevel < levels.length) {
        console.log("Level complete, next level load");
        loadLevel(currentLevel);
    } 
    else {
            if (showEnding) {
                endGameSplashes();
            } 
                else {
                    console.log("Ending disabled");
                    currentLevel = levels.length - 1; // stay on last level
                }

        }
    }
}


let isDragging = false;
let dragStart = { x: 0, y: 0 };
let currentDrag = null; 
let debugMode = true;

canvas.addEventListener("mousedown", (e) => {
    if (gameState !== "playing") return;
    isDragging = true;
    const rect = canvas.getBoundingClientRect();
    dragStart.x = e.clientX - rect.left;
    dragStart.y = e.clientY - rect.top;
    currentDrag = { x: dragStart.x, y: dragStart.y, width: 0, height: 0 };
});

canvas.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    currentDrag = {
        x: Math.min(dragStart.x, currentX),
        y: Math.min(dragStart.y, currentY),
        width: Math.abs(currentX - dragStart.x),
        height: Math.abs(currentY - dragStart.y)
    };
});

canvas.addEventListener("mouseup", (e) => {
    if (!isDragging) return;
    isDragging = false;

    // Log full wall object
    console.log("New wall:", currentDrag);

    currentDrag = null; // reset
});

// draw
function draw() {
    ctx.imageSmoothingEnabled = false;

    // draw the background first
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    

    // draw keys
    if (key.spawned && !key.collected) {
        if (currentLevel === 0) {
            ctx.drawImage(keySprite, key.x, key.y, key.size, key.size);
        } else if (currentLevel === 1) {
            ctx.drawImage(key2Sprite, key.x, key.y, key.size, key.size);
        } else if (currentLevel === 2) {
            ctx.drawImage(key3Sprite, key.x, key.y, key.size, key.size);
        }
    }

    if (debugMode) {
    ctx.save();
    ctx.strokeStyle = "red";       // outline color
    ctx.lineWidth = 2;             // thickness

    for (let wall of walls) {
            const w = wall.width ?? wall.size;
            const h = wall.height ?? wall.size;

            ctx.strokeRect(wall.x, wall.y, w, h);
        }
        ctx.restore();
    }   


// show live dragging wall
if (currentDrag) {
    ctx.save();
    ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
    ctx.fillRect(currentDrag.x, currentDrag.y, currentDrag.width, currentDrag.height);
    ctx.restore();
}


    if (bow && !bow.collected) {
    ctx.drawImage(bowSprite, bow.x, bow.y, bow.size, bow.size);
    }
    // draw arrow
    if (arrow) {
    ctx.save();
    ctx.translate(arrow.x + arrow.width / 2, arrow.y + arrow.height / 2);

    // rotate based on direction
    if (arrow.direction === "left") ctx.rotate(Math.PI);
    else if (arrow.direction === "up") ctx.rotate(-Math.PI/2);
    else if (arrow.direction === "down") ctx.rotate(Math.PI/2);
    // draw arrow centered
    ctx.drawImage(arrowSprite, -arrow.width / 2, -arrow.height / 2, arrow.width, arrow.height);
    ctx.restore();
    }
    // draw player sprite
    const sprite = sprites[player.direction];
    const frameWidth = sprite.width / (player.maxFrame + 1);
    const frameHeight = sprite.height;

    ctx.drawImage(
        sprite,
        player.frameX * frameWidth, 0, frameWidth, frameHeight,
        player.x, player.y, player.size, player.size
    );
    // draw enemy 1
   if (enemy1) {
    const frameWidth1 = enemy1Sprite.width / (enemy1.maxFrame + 1);
    const frameHeight1 = enemy1Sprite.height;
    ctx.drawImage(
        enemy1Sprite,
        enemy1.frameX * frameWidth1, 0, frameWidth1, frameHeight1,
        enemy1.x, enemy1.y, enemy1.size, enemy1.size
    );
}
    // draw enemy 2
if (enemy2) {
    const frameWidth2 = enemy2Sprite.width / (enemy2.maxFrame + 1);
    const frameHeight2 = enemy2Sprite.height;
    ctx.drawImage(
        enemy2Sprite,
        enemy2.frameX * frameWidth2, 0, frameWidth2, frameHeight2,
        enemy2.x, enemy2.y, enemy2.size, enemy2.size
    );
}
    // draw enemy 3
if (enemy3) {
    const frameWidth3 = enemy3Sprite.width / (enemy3.maxFrame + 1);
    const frameHeight3 = enemy3Sprite.height;
    ctx.drawImage(
        enemy3Sprite,
        enemy3.frameX * frameWidth3, 0, frameWidth3, frameHeight3,
        enemy3.x, enemy3.y, enemy3.size, enemy3.size
    );
}

    // draw score only for level 3
    if (currentLevel === 2) {
        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";  // centers text horizontally
        ctx.fillText("Score: " + score, canvas.width / 2, 40);
        ctx.textAlign = "left"; // reset alignment
    }

    if (currentLevel === 2) {
        const heartSize = 60; // size of each heart
        const spacing = 10; // space between hearts
        const totalWidth = health * (heartSize + spacing) - spacing;
        const startX = (canvas.width - totalWidth) / 2; // center
        const y = 50;; // vertical position

        for (let i = 0; i < health; i++) {
            ctx.drawImage(heartSprite, startX + i * (heartSize + spacing), y, heartSize, heartSize);
        }
    }


    // apply lighting effect only for level 2
    if (currentLevel === 1) {
    ctx.save();

    // dark overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)"; // darken background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //gradient for player light
    const lightRadius = 150;
    const gradient = ctx.createRadialGradient(
        player.x + player.size / 2,
        player.y + player.size / 2,
        0,
        player.x + player.size / 2,
        player.y + player.size / 2,
        lightRadius
    );
    gradient.addColorStop(0, "rgba(255,255,255,0.0)"); //visible around player
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.75)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.restore();
}
}


// HTML buttons
const menuDiv = document.getElementById("menu");
const controlsDiv = document.getElementById("controlsMenu");
const textBox = document.getElementById("textBox");
const startButton = document.getElementById("startButton");

// show controls menu
document.getElementById("controlsButton").addEventListener("click", function() {
    menuDiv.classList.add("hidden");
    controlsDiv.classList.remove("hidden");
});
// back to main menu
document.getElementById("backButton").addEventListener("click", function() {
    controlsDiv.classList.add("hidden");
    menuDiv.classList.remove("hidden");
});

// start game
startButton.addEventListener("click", function() {
    menuDiv.classList.add("hidden");
    gameState = "playing";

    backgroundSound.play();// plays music

    // show first text
    textBox.innerHTML = "<p>How did I get here?!</p>";
    textBox.classList.remove("hidden");

    // fade out first text after 3 seconds
    setTimeout(function() {
        textBox.classList.add("hidden");

        // after show second text
        setTimeout(function() {
            textBox.innerHTML = "<p>I need to find a way out</p>";
            textBox.classList.remove("hidden");

            // fade out after 3 seconds
            setTimeout(function() {
                textBox.classList.add("hidden");
            }, 3000);

        }, 1000); // small delay
    }, 2000);
});

function endGameSplashes() {
    gameState = "ending";

    const splash1 = document.getElementById("splash1");
    const splash2 = document.getElementById("splash2");

    // fade into first splash
    splash1.classList.remove("hidden");
    setTimeout(() => splash1.classList.add("visible"), 100);

    // after 4 seconds fade into second splash
    setTimeout(() => {
        splash1.classList.remove("visible");
        setTimeout(() => {
            splash1.classList.add("hidden");
            splash2.classList.remove("hidden");
            setTimeout(() => splash2.classList.add("visible"), 100);
        }, 1500);
    }, 4000);

    // stop the game after credits appear
    setTimeout(() => {
        // freeze the game
        cancelAnimationFrame(gameLoop);
        pressedKeys = {};
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // keep credits on screen
        gameState = "ended";
    }, 7000);

    //pause sounds
    backgroundSound.pause();
    backgroundSound.currentTime = 0;
    walkingSound.pause();
    walkingSound.currentTime = 0;
    keyPickupSound.pause();
    keyPickupSound.currentTime = 0;
    shootSound.pause();
    shootSound.currentTime = 0;
    enemyHitSound.pause();
    enemyHitSound.currentTime = 0;
    playerHitSound.pause();
    playerHitSound.currentTime = 0;
    playerDeathSound.pause();
    playerDeathSound.currentTime = 0;
}

// main loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === "playing") {// if game playing update and draw
        update();
        draw();
        hint.style.display = "block"; // show hint in game
    } else {
        hint.style.display = "none";
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
