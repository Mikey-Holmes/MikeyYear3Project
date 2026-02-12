const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GAME_WIDTH = 1920; // fixed game resolution
const GAME_HEIGHT = 1080;

function resizeCanvas() {
    // work out scale based on screen size
    const scaleX = window.innerWidth / GAME_WIDTH;
    const scaleY = window.innerHeight / GAME_HEIGHT;

    // use smaller scale to keep aspect ratio
    const scale = Math.min(scaleX, scaleY);

    // scale canvas visually
    canvas.style.width = GAME_WIDTH * scale + "px";
    canvas.style.height = GAME_HEIGHT * scale + "px";

    // keep internal canvas resolution fixed
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
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
    speed: 6.0,
    frameX: 0,
    maxFrame: 3,
    frameDelay: 10,
    frameCounter: 0,
    direction: "down"
};

// parkour physics
let velocityY = 0;
let gravity = 0.8;
let jumpPower = -15;
let isOnGround = false;


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

// animated lava for level 4
const lavaFrames = [];
for (let i = 1; i <= 4; i++) {
    const img = new Image();
    img.src = "assets/images/lava_" + i + ".png";
    lavaFrames.push(img);
}

let lavaFrameIndex = 0;
let lavaFrameCounter = 0;
let lavaFrameDelay = 40;


let lastTime = 0; // for delta time

let wasTouchingExit = false;// to see if player was touching exit to prevent instant level change

// level 4 bat animation frames
const batLevelFourFrames = [];

for (let i = 1; i <= 6; i++) {
    const img = new Image();
    img.src = "assets/images/bat4_" + i + ".png";
    batLevelFourFrames.push(img);
}

let batLevelFourFrameIndex = 0;
let batLevelFourFrameCounter = 0;
let batLevelFourFrameDelay = 8; // adjust speed
let batLevelFour = null;

//level 6 first moving platform
const movingPlatformSprite = new Image();
movingPlatformSprite.src = "assets/images/movingrock1.png";
let movingPlatform1 = null;

// level 6 second moving platform sprite
const movingPlatform2Sprite = new Image();
movingPlatform2Sprite.src = "assets/images/movingrock2.png";
let movingPlatform2 = null;

// level 6 third moving platform sprite
const movingPlatform3Sprite = new Image();
movingPlatform3Sprite.src = "assets/images/movingrock3.png";
let movingPlatform3 = null;

// level 6 fourth moving platform sprite
const movingPlatform4Sprite = new Image();
movingPlatform4Sprite.src = "assets/images/movingrock4.png";
let movingPlatform4 = null;





// levels definition
const levels = [
    {
        backgroundSrc: "assets/images/background.png",
        walls: [
            {x: 125, y: 429, width: 2, height: 452},//boundary walls array
            {x: 135, y: 422, width: 164, height: 4},
            {x: 300, y: 266, width: 2, height: 153},
            {x: 306, y: 263, width: 182, height: 4},
            {x: 312, y: 276, width: 6, height: 6},
            {x: 488, y: 83, width: 2, height: 179},
            {x: 498, y: 92, width: 6, height: 8},    
            {x: 512, y: 80, width: 485, height: 3},
            {x: 998, y: 84, width: 2, height: 94},
            {x: 1002, y: 183, width: 358, height: 3},
            {x: 1356, y: 187, width: 4, height: 170},
            {x: 1363, y: 355, width: 265, height: 3},
            {x: 1631, y: 358, width: 1, height: 115},
            {x: 1636, y: 471, width: 139, height: 1},
            {x: 1780, y: 473, width: 1, height: 216},
            {x: 1634, y: 685, width: 146, height: 2},
            {x: 1632, y: 689, width: 3, height: 188},
            {x: 1214, y: 866, width: 413, height: 1},
            {x: 1194, y: 878, width: 4, height: 107},
            {x: 623, y: 982, width: 572, height: 3},
            {x: 619, y: 883, width: 1, height: 101},
            {x: 131, y: 876, width: 486, height: 6},
            

            {x: 1079, y: 442, width: 72, height: 50},//inside barriers
            {x: 1032, y: 428, width: 14, height: 20},
            {x: 952, y: 655, width: 60, height: 58},
            {x: 650, y: 899, width: 52, height: 52},
            {x: 143, y: 649, width: 38, height: 78},
            {x: 179, y: 477, width: 94, height: 25},
            {x: 883, y: 874, width: 86, height: 19},
            {x: 1029, y: 891, width: 104, height: 23},
            {x: 1520, y: 797, width: 48, height: 43},
            {x: 909, y: 135, width: 56, height: 62},
            {x: 992, y: 211, width: 39, height: 36},
            {x: 1206, y: 255, width: 82, height: 26},
            {x: 1551, y: 400, width: 35, height: 39},
            {x: 351, y: 306, width: 155, height: 26},
            {x: 352, y: 333, width: 36, height: 15},
            
            

        ],
        key: { x: 800, y: 200, size: 30, collected: false },//key postion
        exitWall: {x: 1780, y: 473, width: 1, height: 216}//exit wall location
    },
    {
        backgroundSrc: "assets/images/background2.png",
        walls: [
            {x: 249, y: 592, width: 2, height: 108},//boundary walls array lvl 2
            {x: 255, y: 598, width: 69, height: 2},
            {x: 322, y: 237, width: 4, height: 361},
            {x: 332, y: 245, width: 139, height: 3},
            {x: 471, y: 248, width: 3, height: 173},
            {x: 477, y: 415, width: 81, height: 4},
            {x: 558, y: 239, width: 2, height: 175},
            {x: 568, y: 247, width: 145, height: 3},
            {x: 712, y: 255, width: 3, height: 166},
            {x: 719, y: 424, width: 264, height: 1},
            {x: 990, y: 419, width: 1, height: 93},
            {x: 477, y: 511, width: 519, height: 1},
            {x: 475, y: 509, width: 4, height: 92},
            {x: 482, y: 600, width: 778, height: 1},
            {x: 1258, y: 601, width: 3, height: 96},
            {x: 1155, y: 698, width: 103, height: 4},
            {x: 1150, y: 703, width: 2, height: 61},
            {x: 1152, y: 761, width: 166, height: 3},
            {x: 1317, y: 517, width: 1, height: 243},
            {x: 1079, y: 513, width: 236, height: 4},
            {x: 1075, y: 419, width: 3, height: 97},
            {x: 1077, y: 423, width: 241, height: 3},
            {x: 1313, y: 367, width: 4, height: 55},
            {x: 780, y: 366, width: 532, height: 4},
            {x: 777, y: 235, width: 3, height: 131},
            {x: 790, y: 242, width: 858, height: 4},
            {x: 1646, y: 247, width: 2, height: 209},
            {x: 1649, y: 458, width: 48, height: 3},
            {x: 1710, y: 468, width: 1, height: 82},
            {x: 1531, y: 552, width: 180, height: 2},
            {x: 1520, y: 366, width: 4, height: 186},
            {x: 1471, y: 361, width: 53, height: 6},
            {x: 1467, y: 361, width: 4, height: 241},
            {x: 1473, y: 601, width: 180, height: 2},
            {x: 1651, y: 602, width: 2, height: 91},
            {x: 1469, y: 694, width: 185, height: 1},
            {x: 1468, y: 696, width: 4, height: 68},
            {x: 1472, y: 762, width: 168, height: 2},
            {x: 1642, y: 764, width: 3, height: 99},
            {x: 302, y: 864, width: 1343, height: 2},
            {x: 297, y: 758, width: 5, height: 105},
            {x: 305, y: 757, width: 669, height: 6},
            {x: 971, y: 698, width: 3, height: 62},
            {x: 247, y: 697, width: 722, height: 2}
        
            
        ],
        key: { x: 1110, y: 450, size: 30, collected: false },//key position
        exitWall: {x: 1710, y: 468, width: 1, height: 82}//exit wall location
    },

    {
        backgroundSrc: "assets/images/background_3.png",
        walls: [
            {x: 197, y: 370, width: 4, height: 357},//boundary walls array lvl 3
            {x: 206, y: 371, width: 228, height: 6},
            {x: 432, y: 247, width: 2, height: 127},
            {x: 437, y: 245, width: 222, height: 4},
            {x: 659, y: 109, width: 2, height: 140},
            {x: 665, y: 109, width: 600, height: 6},
            {x: 1261, y: 114, width: 4, height: 134},
            {x: 1268, y: 247, width: 220, height: 2},
            {x: 1486, y: 251, width: 4, height: 121},
            {x: 1485, y: 370, width: 236, height: 9},
            {x: 1725, y: 380, width: 4, height: 345},
            {x: 1490, y: 726, width: 241, height: 1},
            {x: 1488, y: 728, width: 2, height: 128},
            {x: 1263, y: 852, width: 225, height: 6},
            {x: 1260, y: 856, width: 3, height: 122},
            {x: 660, y: 974, width: 600, height: 4},
            {x: 659, y: 857, width: 1, height: 114},
            {x: 432, y: 851, width: 226, height: 7},
            {x: 430, y: 732, width: 5, height: 119},
            {x: 190, y: 725, width: 242, height: 10},

        ],
        key: { x: 1110, y: 443, size: 30, collected: false },//key position
        bow: { x: 800, y: 450, size: 60, collected: false },//bow position
        exitWall: {x: 1725, y: 380, width: 4, height: 345}
    },

    {
    backgroundSrc: "assets/images/caveOne.png",//background lvl 4
        walls: [
            {x: 132, y: 418, width: 3, height: 194},
            {x: 145, y: 619, width: 152, height: 3},
            {x: 406, y: 618, width: 150, height: 4},
            {x: 672, y: 620, width: 124, height: 3},
            {x: 912, y: 667, width: 119, height: 2},
            {x: 1158, y: 667, width: 137, height: 3},
            {x: 1400, y: 613, width: 119, height: 6},
            {x: 1632, y: 585, width: 143, height: 2},
            {x: 1796, y: 406, width: 3, height: 176},

            {x: 160, y: 860, width: 1604, height: 3},// lava hit box
   
        ],
        key: {},
        exitWall: {x: 1796, y: 406, width: 3, height: 176}
    },

    {
    backgroundSrc: "assets/images/caveTwo.png",//background lvl 5
        walls: [
            {x: 132, y: 418, width: 3, height: 194},
            {x: 144, y: 619, width: 175, height: 3},
            {x: 534, y: 702, width: 140, height: 3},
            {x: 859, y: 653, width: 141, height: 4},
            {x: 1243, y: 640, width: 171, height: 3},
            {x: 1608, y: 586, width: 167, height: 5},
            {x: 1788, y: 434, width: 5, height: 143},

        ],
        key: {},
        exitWall: {x: 1788, y: 434, width: 5, height: 143}
    },

    {
    backgroundSrc: "assets/images/caveThree.png",//background lvl 6
        walls: [
            {x: 132, y: 400, width: 3, height: 194},
            {x: 144, y: 586, width: 146, height: 3},
            {x: 1617, y: 615, width: 158, height: 3},
            {x: 1782, y: 392, width: 4, height: 215},

        ],
        key: {},
        exitWall: {x: 1782, y: 392, width: 4, height: 215}
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

    //spawn points for player in different levels
    //for level 4 and 5
    if (levelIndex === 3 || levelIndex === 4) {
    player.x = 177;
    player.y = 540;
    } 
    //spawn for level 6
    else if (levelIndex === 5) {
    player.x = 177;
    player.y = 520;
    }
    else {
    //first three levels so far
    player.x = 291;
    player.y = 625;
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

    // spawn level 4 bat
    if (levelIndex === 3) {
        batLevelFour = {
            x: 1721,
            y: 510,
            startX: 1721,
            endX: 155,
            size: 100,
            speed: 8,
            direction: "left"
        };

        batLevelFourFrameIndex = 0;
        batLevelFourFrameCounter = 0;
    } else {
        batLevelFour = null;
    }


    movingPlatform1 = {
        // base position for sprite + hitbox
        baseX: 400,
        x: 400,
        y: 650,

        // hitbox 
        width: 40,
        height: 20,

        // sprite scale
        spriteScale: 0.5,

        // movement
        startX: 400,
        endX: 600,
        speed: 3,
        direction: "right"
    };

        // level 6 second moving platform 
        movingPlatform2 = {
        x: movingPlatform1.endX + 120, // to the right of platform 1
        y: movingPlatform1.y,
        baseY: movingPlatform1.y,

        // hitbox
        width: 40,
        height: 20,

        // sprite scale
        spriteScale: 0.5,

        // vertical movement
        startY: movingPlatform1.y,
        endY: movingPlatform1.y - 180, // how high it goes
        speed: 2,
        direction: "up"
    };


        //third moving platform
        movingPlatform3 = {
        x: 900,
        y: 500,  

        //hitbox
        width: 40,
        height: 20,

        spriteScale: 0.5,

        startX: 900,
        endX: 1150,
        speed: 3,
        direction: "right"
    };

        //fourth moving platform
        movingPlatform4 = {
        x: movingPlatform3.endX + 50, //to the right of platform 3 end point on X axis      
        y: movingPlatform3.y + 150, //below platform 3

        width: 40,
        height: 20,

        spriteScale: 0.5,

        startX: movingPlatform3.endX + 50, // start here
        endX: movingPlatform3.endX + 400, // move further right
        speed: 3,
        direction: "right"
    };



    // calculate sprite draw width from image + scale
    const spriteDrawWidth =
    movingPlatformSprite.width * movingPlatform1.spriteScale;

    // center hitbox under the sprite
    movingPlatform1.x =
    movingPlatform1.baseX +
    (spriteDrawWidth - movingPlatform1.width) / 2;

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

function update(deltaTime) {
    let moving = false;
    let nextX = player.x;
    let nextY = player.y;

    // movement for level 4
if (currentLevel === 3 || currentLevel === 4 || currentLevel === 5) {
    // left or right only
    if (pressedKeys["a"]) {
        nextX -= player.speed * deltaTime;
        player.direction = "left";
        moving = true;
    }
    if (pressedKeys["d"]) {
        nextX += player.speed * deltaTime;
        player.direction = "right";
        moving = true;
    }

    // jump is space
    if (pressedKeys[" "] && isOnGround) {
        velocityY = jumpPower;
        isOnGround = false;
    }

} else {
    // normal movement for other levels
    if (pressedKeys["w"]) {
        nextY -= player.speed * deltaTime;
        player.direction = "up";
        moving = true;
    } else if (pressedKeys["s"]) {
        nextY += player.speed * deltaTime;
        player.direction = "down";
        moving = true;
    }

    if (pressedKeys["a"]) {
        nextX -= player.speed * deltaTime;
        player.direction = "left";
        moving = true;
    } else if (pressedKeys["d"]) {
        nextX += player.speed * deltaTime;
        player.direction = "right";
        moving = true;
    }
}
    // gravity for parkour level
    if (currentLevel === 3 || currentLevel === 4 || currentLevel === 5) {
        velocityY += gravity * deltaTime;
        nextY += velocityY * deltaTime;
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

    // animate lava background (level 4)
    if (currentLevel === 3 || currentLevel === 4 || currentLevel === 5) {
        lavaFrameCounter++;

        if (lavaFrameCounter >= lavaFrameDelay) {
            lavaFrameCounter = 0;
            lavaFrameIndex++;

            if (lavaFrameIndex >= lavaFrames.length) {
                lavaFrameIndex = 0;
            }
        }
    }


    // collision with walls for level 4
if (currentLevel === 3 || currentLevel === 4 || currentLevel === 5) {

    isOnGround = false;

    for (let wall of walls) {
        const w = wall.width || wall.size;
        const h = wall.height || wall.size;

        // horizontal collision
        if (
            nextX < wall.x + w &&
            nextX + player.size > wall.x &&
            player.y < wall.y + h &&
            player.y + player.size > wall.y
        ) {
            nextX = player.x;
        }

        // landing on platform
        if (
            player.x < wall.x + w &&
            player.x + player.size > wall.x &&
            nextY + player.size > wall.y &&
            player.y + player.size <= wall.y
        ) {
            nextY = wall.y - player.size;
            velocityY = 0;
            isOnGround = true;
        }
    }

    player.x = nextX;
    player.y = nextY;

} else {
    // wall collision lvls other than 4
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
}

        // collision with moving platform 1
    if (currentLevel === 5 && movingPlatform1) {
        const p = movingPlatform1;

        if (
            player.x < p.x + p.width &&
            player.x + player.size > p.x &&
            player.y + player.size <= p.y + 10 &&
            nextY + player.size >= p.y
        ) {
            // keep player on platform
            player.y = p.y - player.size;
            velocityY = 0;
            isOnGround = true;

            // carry player with platform
            if (p.direction === "right") {
                player.x += p.speed * deltaTime;
            } else {
                player.x -= p.speed * deltaTime;
            }
        }
    }

        // collision with moving platform 2
    if (currentLevel === 5 && movingPlatform2) {
        const p = movingPlatform2;

        if (
            velocityY >= 0 &&
            player.x < p.x + p.width &&
            player.x + player.size > p.x &&
            player.y + player.size <= p.y + 10 &&
            nextY + player.size >= p.y
        ) {
            player.y = p.y - player.size;
            velocityY = 0;
            isOnGround = true;
        }
    }

       // collision with moving platform 3
    if (currentLevel === 5 && movingPlatform3) {
        const p = movingPlatform3;

        if (
            velocityY >= 0 &&
            player.x < p.x + p.width &&
            player.x + player.size > p.x &&
            player.y + player.size <= p.y + 10 &&
            nextY + player.size >= p.y
        ) {
            player.y = p.y - player.size;
            velocityY = 0;
            isOnGround = true;
            standingOnPlatform = true;

            // carry player horizontally
            if (p.direction === "right") {
                player.x += p.speed * deltaTime;
            } else {
                player.x -= p.speed * deltaTime;
            }
        }
    }

        //collision with moving platform 4
    if (currentLevel === 5 && movingPlatform4) {
        const p = movingPlatform4;

        if (
            velocityY >= 0 &&
            player.x < p.x + p.width &&
            player.x + player.size > p.x &&
            player.y + player.size <= p.y + 10 &&
            nextY + player.size >= p.y
        ) {
            player.y = p.y - player.size;
            velocityY = 0;
            isOnGround = true;

            // carry player horizontally again
            if (p.direction === "right") {
                player.x += p.speed * deltaTime;
            } else {
                player.x -= p.speed * deltaTime;
            }
        }
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
            enemy1 = { x: 1518, y: 398, startX: 1518, startY: 398, size: 70, speed: 0.2, frameX: 0, maxFrame: 7, frameCounter: 0, frameDelay: 10 };
            enemy2 = { x: 1518, y: 506, startX: 1518, startY: 506, size: 70, speed: 0.5, frameX: 0, maxFrame: 7, frameCounter: 0, frameDelay: 10 };
            enemy3 = { x: 1518, y: 597, startX: 1518, startY: 597, size: 55, speed: 1, frameX: 0, maxFrame: 4, frameCounter: 0, frameDelay: 10 };
        }
    }

    // enemy animation and movement
    if (enemy1) { moveEnemy(enemy1); animateEnemy(enemy1); }
    if (enemy2) { moveEnemy(enemy2); animateEnemy(enemy2); }
    if (enemy3) { moveEnemy(enemy3); animateEnemy(enemy3); }

    // level 4 bat movement + lava-style animation
    if (batLevelFour && currentLevel === 3) {

        // movement
        if (batLevelFour.direction === "left") {
            batLevelFour.x -= batLevelFour.speed * deltaTime;
        } else {
            batLevelFour.x += batLevelFour.speed * deltaTime;
        }

        // turn around
        if (batLevelFour.x <= batLevelFour.endX) {
            batLevelFour.direction = "right";
        }
        if (batLevelFour.x >= batLevelFour.startX) {
            batLevelFour.direction = "left";
        }

        // animation for bat
        batLevelFourFrameCounter++;

        if (batLevelFourFrameCounter >= batLevelFourFrameDelay) {
            batLevelFourFrameCounter = 0;
            batLevelFourFrameIndex++;

            if (batLevelFourFrameIndex >= batLevelFourFrames.length) {
                batLevelFourFrameIndex = 0;
            }
        }
    }

    // move platform 1 lvl 6
    if (currentLevel === 5 && movingPlatform1) {
        if (movingPlatform1.direction === "right") {
            movingPlatform1.x += movingPlatform1.speed * deltaTime;
        } else {
            movingPlatform1.x -= movingPlatform1.speed * deltaTime;
        }
        // turn around
        if (movingPlatform1.x >= movingPlatform1.endX) {
            movingPlatform1.direction = "left";
        }
        if (movingPlatform1.x <= movingPlatform1.startX) {
            movingPlatform1.direction = "right";
        }
    }

    // move platform 2 lvl 6 
    if (currentLevel === 5 && movingPlatform2) {

        if (movingPlatform2.direction === "up") {
            movingPlatform2.y -= movingPlatform2.speed * deltaTime;
        } else {
            movingPlatform2.y += movingPlatform2.speed * deltaTime;
        }

        if (movingPlatform2.y <= movingPlatform2.endY) {
            movingPlatform2.direction = "down";
        }

        if (movingPlatform2.y >= movingPlatform2.startY) {
            movingPlatform2.direction = "up";
        }
    }

    // move platform 3 lvl 6
    if (currentLevel === 5 && movingPlatform3) {

        if (movingPlatform3.direction === "right") {
            movingPlatform3.x += movingPlatform3.speed * deltaTime;
        } else {
            movingPlatform3.x -= movingPlatform3.speed * deltaTime;
        }

        // turn around
        if (movingPlatform3.x >= movingPlatform3.endX) {
            movingPlatform3.direction = "left";
        }

        if (movingPlatform3.x <= movingPlatform3.startX) {
            movingPlatform3.direction = "right";
        }
    }

    // move platform 4 lvl 6
    if (currentLevel === 5 && movingPlatform4) {
        if (movingPlatform4.direction === "right") {
            movingPlatform4.x += movingPlatform4.speed * deltaTime;
        } else {
            movingPlatform4.x -= movingPlatform4.speed * deltaTime;
        }

        if (movingPlatform4.x >= movingPlatform4.endX) {
            movingPlatform4.direction = "left";
        }
        if (movingPlatform4.x <= movingPlatform4.startX) {
            movingPlatform4.direction = "right";
        }
    }





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
        if (arrow.direction === "right") arrow.x += arrow.speed * deltaTime;
        else if (arrow.direction === "left") arrow.x -= arrow.speed * deltaTime;
        else if (arrow.direction === "up") arrow.y -= arrow.speed * deltaTime;
        else if (arrow.direction === "down") arrow.y += arrow.speed * deltaTime;

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
            enemy.x += (dx / dist) * enemy.speed * deltaTime; 
            enemy.y += (dy / dist) * enemy.speed * deltaTime; 
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

    const exit = levels[currentLevel].exitWall;

    let touchingExit = false;

    if (exit && exit.width && exit.height) {
        const exitHitbox = {
            x: exit.x - 10,
            y: exit.y - 10,
            width: exit.width + 20,
            height: exit.height + 20
        };

        touchingExit = isColliding(player, exitHitbox);
    }


    if (
        touchingExit &&
        !wasTouchingExit &&
        (
            (currentLevel === 3 || currentLevel === 4 || currentLevel === 5) ||
            (key.collected)
        )
    ) {
        levelCompleteSound.currentTime = 0;
        levelCompleteSound.play();

        currentLevel++;

        if (currentLevel < levels.length) {
            loadLevel(currentLevel);
        } else {
            if (showEnding) {
                endGameSplashes();
            } else {
                currentLevel = levels.length - 1;
            }
        }
    }

    wasTouchingExit = touchingExit;

    // level 4 bat collision
    if (batLevelFour && currentLevel === 3) {

        const playerHitbox = {
            x: player.x + 15,
            y: player.y + 15,
            size: player.size - 30
        };

        const batHitbox = {
            x: batLevelFour.x + 20,
            y: batLevelFour.y + 20,
            size: batLevelFour.size - 40
        };

        if (isColliding(playerHitbox, batHitbox)) {
            player.x = 177;
            player.y = 540;
            velocityY = 0;
        }
    }



    // lava death level 4 AND 5
    if (currentLevel === 3 || currentLevel === 4 || currentLevel === 5) {
        if (player.y + player.size >= 860) { // lava Y
            player.x = 177;
            player.y = 474;
            velocityY = 0;
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

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    dragStart.x = Math.round((e.clientX - rect.left) * scaleX);
    dragStart.y = Math.round((e.clientY - rect.top) * scaleY);


    currentDrag = { x: dragStart.x, y: dragStart.y, width: 0, height: 0 };
});

canvas.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const rect = canvas.getBoundingClientRect();
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const currentX = Math.round((e.clientX - rect.left) * scaleX);
    const currentY = Math.round((e.clientY - rect.top) * scaleY);

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

    // draw background if loaded
    if (background.complete) {
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    } else {
        // so screen isn't white when error loading
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }


    // draw lava strip 
    if (
        (currentLevel === 3 || currentLevel === 4 || currentLevel === 5) &&
        lavaFrames[lavaFrameIndex] &&
        lavaFrames[lavaFrameIndex].complete //loading check
    ) {
        const lavaHeight = 105;
        const lavaRaiseAmount = 180;
        const lavaY = canvas.height - lavaHeight - lavaRaiseAmount; // raise lava and set sprite hight

        const lavaWidth = canvas.width - 285; // squash image inwards
        const lavaX = (canvas.width - lavaWidth) / 2; // center the lava

        ctx.drawImage(
            lavaFrames[lavaFrameIndex],//draw animated lava
            lavaX, lavaY,
            lavaWidth, lavaHeight 
        );
    }

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
    ctx.strokeStyle = "red";  // outline color
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

        // draw moving platform 1 level 6
    if (currentLevel === 5 && movingPlatform1 && movingPlatformSprite.complete) {

        const scale = movingPlatform1.spriteScale;
        // calculate draw size from sprite + scale
        const drawWidth  = movingPlatformSprite.width  * scale;
        const drawHeight = movingPlatformSprite.height * scale;

        const spriteYOffset = 36; // moves sprite down to line up with hitbox

        // center sprite on hitbox
        const spriteX =
            movingPlatform1.x - (drawWidth - movingPlatform1.width) / 2;

        const spriteY =
            movingPlatform1.y - (drawHeight - movingPlatform1.height) + spriteYOffset;

        ctx.drawImage(
            movingPlatformSprite,
            spriteX,
            spriteY,
            drawWidth,
            drawHeight
        );

        // debug hitbox
        ctx.strokeRect(
            movingPlatform1.x,
            movingPlatform1.y,
            movingPlatform1.width,
            movingPlatform1.height
        );

    }

    // draw moving platform 2 level 6
    if (currentLevel === 5 && movingPlatform2 && movingPlatform2Sprite.complete) {

        const scale = movingPlatform2.spriteScale;

        const drawWidth  = movingPlatform2Sprite.width  * scale;
        const drawHeight = movingPlatform2Sprite.height * scale;

        const spriteYOffset = 39;// moves sprite down

        const spriteX =
            movingPlatform2.x - (drawWidth - movingPlatform2.width) / 2;

        const spriteY =
            movingPlatform2.y - (drawHeight - movingPlatform2.height) + spriteYOffset;

        ctx.drawImage(
            movingPlatform2Sprite,
            spriteX,
            spriteY,
            drawWidth,
            drawHeight
        );

        // debug hitbox
        ctx.strokeStyle = "cyan";
        ctx.strokeRect(
            movingPlatform2.x,
            movingPlatform2.y,
            movingPlatform2.width,
            movingPlatform2.height
        );
    }

    // draw moving platform 3 level 6
    if (currentLevel === 5 && movingPlatform3 && movingPlatform3Sprite.complete) {

        const scale = movingPlatform3.spriteScale;

        const drawWidth  = movingPlatform3Sprite.width * scale;
        const drawHeight = movingPlatform3Sprite.height * scale;

        spriteYOffset = 47; // moves sprite down
        
        const spriteX =
            movingPlatform3.x - (drawWidth - movingPlatform3.width) / 2;// center sprite on hitbox

        const spriteY =
            movingPlatform3.y - (drawHeight - movingPlatform3.height) + spriteYOffset;

        ctx.drawImage(
            movingPlatform3Sprite,
            spriteX,
            spriteY,
            drawWidth,
            drawHeight
        );

        // debug hitbox
        ctx.strokeStyle = "cyan";
        ctx.strokeRect(
            movingPlatform3.x,
            movingPlatform3.y,
            movingPlatform3.width,
            movingPlatform3.height
        );
    }

    // draw moving platform 4 level 6
    if (currentLevel === 5 && movingPlatform4 && movingPlatform4Sprite.complete) {

        const scale = movingPlatform4.spriteScale;
        const drawWidth  = movingPlatform4Sprite.width * scale;
        const drawHeight = movingPlatform4Sprite.height * scale;

        const spriteYOffset = 44; // moves sprite down

        const spriteX =
            movingPlatform4.x - (drawWidth - movingPlatform4.width) / 2;

        const spriteY =
            movingPlatform4.y - (drawHeight - movingPlatform4.height) + spriteYOffset;

        ctx.drawImage(
            movingPlatform4Sprite,
            spriteX,
            spriteY,
            drawWidth,
            drawHeight
        );

        // debug hitbox
        ctx.strokeStyle = "cyan";
        ctx.strokeRect(
            movingPlatform4.x,
            movingPlatform4.y,
            movingPlatform4.width,
            movingPlatform4.height
        );
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

    // draw level 4 bat
    if (
        batLevelFour &&
        batLevelFourFrames[batLevelFourFrameIndex] &&
        batLevelFourFrames[batLevelFourFrameIndex].complete
    ) {
        ctx.save();

        // flip when moving right
        if (batLevelFour.direction === "right") {
            ctx.translate(batLevelFour.x + batLevelFour.size, batLevelFour.y);
            ctx.scale(-1, 1);

            ctx.drawImage(
                batLevelFourFrames[batLevelFourFrameIndex],
                0,
                0,
                batLevelFour.size,
                batLevelFour.size
            );
        } else {
            ctx.drawImage(
                batLevelFourFrames[batLevelFourFrameIndex],
                batLevelFour.x,
                batLevelFour.y,
                batLevelFour.size,
                batLevelFour.size
            );
        }

        ctx.restore();
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
function gameLoop(time) {
    const deltaTime = (time - lastTime) / 16.67;// for consistent movement across different devices
    lastTime = time;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === "playing") {
        update(deltaTime);
        draw();
        hint.style.display = "block";
    } else {
        hint.style.display = "none";
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
