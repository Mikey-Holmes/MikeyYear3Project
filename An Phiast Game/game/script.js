const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GAME_WIDTH = 1920; // fixed game resolution
const GAME_HEIGHT = 1080;

function resizeCanvas() {
    // work out scale based on screen size
    const scaleX = window.innerWidth / GAME_WIDTH;
    const scaleY = window.innerHeight / GAME_HEIGHT;

    // keeps aspect ratio
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

// spawn area for level 3 right side
const level3SpawnArea = {
    x: 1176,
    y: 352,
    width: 137,
    height: 344
};

// spawn area for level 3 left side
const level3SpawnAreaLeft = {
    x: 471,
    y: 363,
    width: 186,
    height: 382
};

// get random spawn position within the area
function getRandomSpawn(area, size) {
    return {
        x: Math.random() * (area.width - size) + area.x,
        y: Math.random() * (area.height - size) + area.y
    };
}

// get random spawn position either on the left or right side of level 3
function getRandomSpawnEitherSide(size) {

    let chosenArea;

    if (Math.random() < 0.5) {
        chosenArea = level3SpawnArea;// right side
    } else {
        chosenArea = level3SpawnAreaLeft;// left side
    }

    return {
        x: Math.random() * (chosenArea.width - size) + chosenArea.x,
        y: Math.random() * (chosenArea.height - size) + chosenArea.y
    };
}

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
    speed: 6.0, // 6 is default, adjusted for testing
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

// sparkle key animation
const sparkleFrames = [];

for (let i = 1; i <= 6; i++) {
    const img = new Image();
    img.src = "assets/images/sparkle_" + i + ".png";
    sparkleFrames.push(img);
}

let sparkleFrameIndex = 0;
let sparkleFrameCounter = 0;
let sparkleFrameDelay = 15;

// game state
let gameState = "menu";

let levelSkipEnabled = true; // enable/disable level skipping

// background image
const background = new Image();

let score = 0; // level 3 score
let bossScore = 0; // level 7 score
let health = 3; // player health
let invincible = false;

let showEnding = true; //end screen

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

// lava splash animation frames
const lavaSplashFrames = [];
for (let i = 1; i <= 7; i++) {
    const img = new Image();
    img.src = "assets/images/lavaSplash_" + i + ".png";
    lavaSplashFrames.push(img);
}

let lavaSplash = null;
let lavaSplashFrameIndex = 0;
let lavaSplashFrameCounter = 0;
let lavaSplashFrameDelay = 6;

// dragon animation frames
const dragonFrames = [];

for (let i = 1; i <= 4; i++) {
    const img = new Image();
    img.src = "assets/images/dragonfly_" + i + ".png";
    dragonFrames.push(img);
}

let dragon = null;
let dragonFrameIndex = 0;
let dragonFrameCounter = 0;
let dragonFrameDelay = 15;

// fireball animation frames
const fireballFrames = [];

for (let i = 1; i <= 8; i++) {
    const img = new Image();
    img.src = "assets/images/fireball_" + i + ".png";
    fireballFrames.push(img);
}

let fireball = null;
let fireballFrameIndex = 0;
let fireballFrameCounter = 0;
let fireballFrameDelay = 6;

let fireballShootCounter = 0;
let fireballShootDelay = 110;

// falling rock animation frames
const fallingRockFrames = [];

for (let i = 1; i <= 6; i++) {
    const img = new Image();
    img.src = "assets/images/fallingrock_" + i + ".png";
    fallingRockFrames.push(img);
}

let fallingRock = null;
let fallingRockFrameIndex = 0;
let fallingRockFrameCounter = 0;
let fallingRockFrameDelay = 12;

let fallingRockRespawnCounter = 0;
let fallingRockRespawnDelay = 20;

let fallingRock2 = null;
let fallingRock2FrameIndex = 0;
let fallingRock2FrameCounter = 0;
let fallingRock2RespawnCounter = 0;

let fallingRock3 = null;
let fallingRock3FrameIndex = 0;
let fallingRock3FrameCounter = 0;
let fallingRock3RespawnCounter = 0;

let fallingRock4 = null;
let fallingRock4FrameIndex = 0;
let fallingRock4FrameCounter = 0;
let fallingRock4RespawnCounter = 0;

// green boss animation frames
const greenBossFrames = [];

for (let i = 1; i <= 6; i++) {
    const img = new Image();
    img.src = "assets/images/greenboss_" + i + ".png";
    greenBossFrames.push(img);
}

let greenBoss = null;
let greenBossFrameIndex = 0;
let greenBossFrameCounter = 0;
let greenBossFrameDelay = 18;

// green boss slam animation frames (level 7)
const greenBossSlamFrames = [];

for (let i = 1; i <= 8; i++) {
    const img = new Image();
    img.src = "assets/images/bossSlamAnimation_" + i + ".png";
    greenBossSlamFrames.push(img);
}

let greenBossSlamFrameIndex = 0;
let greenBossSlamFrameCounter = 0;

let bossSlamCooldown = 0;
let bossSlamHoldTimer = 0;
let bossSlamTriggered = false;

let bossState = "walk";


let level7Fires = [];

// level 7 fire frames
const fireLevel7Frames = [];

for (let i = 1; i <= 9; i++) {
    const img = new Image();
    img.src = "assets/images/flamesBoss7_" + i + ".png";
    fireLevel7Frames.push(img);
}

let fireLevel7FrameIndex = 0;
let fireLevel7FrameCounter = 0;
let fireLevel7FrameDelay = 13;

// level 7 boss arrow sprite
const bossArrowSprite = new Image();
bossArrowSprite.src = "assets/images/bossArrow.png";
let bossArrow = null;
let spacePressed = false;

// trophy animation
const trophyFrames = [];

for (let i = 1; i <= 8; i++) {
    const img = new Image();
    img.src = "assets/images/trophy_" + i + ".png";
    trophyFrames.push(img);
}

let trophy = null;
let trophyFrameIndex = 0;
let trophyFrameCounter = 0;
let trophyFrameDelay = 20;
let trophySpawnTimer = 0;
let trophySpawnDelay = 120;// after 2 seconds
let trophySpawning = false;



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
            {x: 127, y: 322, width: 9, height: 634},
            {x: 144, y: 586, width: 146, height: 3},
            {x: 1617, y: 615, width: 158, height: 3},
            {x: 1781, y: 391, width: 6, height: 542},
            {x: 155, y: 876, width: 1605, height: 6},

        ],
        key: {},
        exitWall: {x: 1782, y: 392, width: 4, height: 215}
    },

    {
    backgroundSrc: "assets/images/background_7.png",//background lvl 7
        walls: [

            {x: 577, y: 468, width: 787, height: 6},
            {x: 1460, y: 474, width: 8, height: 287},
            {x: 578, y: 742, width: 786, height: 6},
            {x: 438, y: 469, width: 118, height: 39},
            {x: 456, y: 507, width: 8, height: 234},
            {x: 1388, y: 474, width: 103, height: 33},

            //bottom left of circle barriers
            {x: 450, y: 721, width: 126, height: 22},
            {x: 462, y: 705, width: 70, height: 13},
            {x: 464, y: 686, width: 20, height: 16},

            //bottom right of circle barriers
            {x: 1333, y: 723, width: 126, height: 16},
            {x: 1383, y: 709, width: 75, height: 14},
            {x: 1428, y: 689, width: 36, height: 16},

        ],
        key: {},
        exitWall: {}
    }
];

const hintBox = document.getElementById("hintBox");// hint box element
const hint = document.getElementById("hint");

// update hint text based on level
function updateHintText() {
    if (currentLevel === 0) {
        hintBox.textContent = "Find something lying around and follow the path!";
    } else if (currentLevel === 1) {
        hintBox.textContent = "It's dark... find the key and the exit to escape!";
    } else if (currentLevel === 2) {
        hintBox.textContent = "Grab the bow and shoot the enemies! A key will appear when you reach a score of 50!";
    } else if (currentLevel === 3) {
        hintBox.textContent = "Lava ahead! Be careful, beware of the bat.. !";
    } else if (currentLevel === 4) {
        hintBox.textContent = "Watch out for falling rocks and time your jumps!";
    } else if (currentLevel === 5) {
        hintBox.textContent = "Ah moving platforms! Time your jumps carefully and watch out for the dragon attacks!";
    } else if (currentLevel === 6) {
        hintBox.textContent = "Final level! Beware of the green boss and his attacks, keep your distance, shoot the boss and defeat him to escape the cave!";
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
    else if (levelIndex === 6) {
    // level 7
    player.x = 928;
    player.y = 605;
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

    if (levelIndex === 2 || levelIndex === 6) {
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

    //dragon for level 6
    if (levelIndex === 5) {

        dragon = {
            x: 1360,
            y: 288,
            startY: 288,
            endY: 360,
            speed: 2,
            direction: "down"
        };

        dragonFrameIndex = 0;
        dragonFrameCounter = 0;

        fireball = null;
        fireballShootCounter = 0;
        fireballFrameIndex = 0;
        fireballFrameCounter = 0;

    } else {
        dragon = null;
    }

    // falling rocks for level 5
    if (levelIndex === 4) {

        fallingRock = {
            x: 742,
            y: 212,
            size: 50,
            speed: 8
        };

        fallingRock2 = {
            x: 1090,
            y: 212,
            size: 50,
            speed: 9
        };

        fallingRock3 = {
            x: 398,
            y: 212,
            size: 50,
            speed: 7
        };

        fallingRock4 = {
            x: 1495,
            y: 212,
            size: 50,
            speed: 7
        };


        fallingRockFrameIndex = 0;
        fallingRockFrameCounter = 0;
        fallingRockRespawnCounter = 0;

        fallingRock2FrameIndex = 0;
        fallingRock2FrameCounter = 0;
        fallingRock2RespawnCounter = 0;

        fallingRock3FrameIndex = 0;
        fallingRock3FrameCounter = 0;
        fallingRock3RespawnCounter = 0;

        fallingRock4FrameIndex = 0;
        fallingRock4FrameCounter = 0;
        fallingRock4RespawnCounter = 0;

    } else {
        fallingRock = null;
        fallingRock2 = null;
        fallingRock3 = null;
        fallingRock4 = null;
    }

    // green boss + fire for level 7
    if (levelIndex === 6) {

        greenBoss = {
            x: 521,
            y: 570,
            size: 180,
            speed: 1.2,
            direction: "right"
        };

        greenBossFrameIndex = 0;
        greenBossFrameCounter = 0;

        // trophy soawns after boss dies
        trophy = {
                x: 1300,
                y: 500,
                size: 120,//scaled up
                spawned: false
            };

        trophyFrameIndex = 0;
        trophyFrameCounter = 0;
        trophySpawnTimer = 0;
        trophySpawning = false;

        // reset slam attack
        bossIsSlamming = false;
        bossSlamCooldown = 0;
        greenBossSlamFrameIndex = 0;
        greenBossSlamFrameCounter = 0;
        bossSlamTriggered = false;
        bossState = "walk";
        
        //heal and score for boss fight
        health = 3;
        bossScore = 0;

        // spawn level 7 fires
        level7Fires = [
            { x: 370, y: 400, size: 110 },
            { x: 215, y: 470, size: 140 },
            { x: 1475, y: 440, size: 90 },
            { x: 1580, y: 470, size: 140 }
        ];

        fireLevel7FrameIndex = 0;
        fireLevel7FrameCounter = 0;

    } else {
        greenBoss = null;
        level7Fires = [];
        trophy = null;
    }

}

function skipLevel() {

    if (currentLevel < levels.length - 1) {
        currentLevel++;
        velocityY = 0;
        loadLevel(currentLevel);
        console.log("Skipped to level:", currentLevel + 1);
    }

}

function previousLevel() {

    if (currentLevel > 0) {
        currentLevel--;
        velocityY = 0;
        loadLevel(currentLevel);
        console.log("Went back to level:", currentLevel + 1);
    }

}

//load first level
loadLevel(currentLevel);

// key listeners
window.addEventListener("keydown", function(event) {
    let key = event.key.toLowerCase();
    pressedKeys[key] = true;

    // level skip debug controls
    if (levelSkipEnabled) {

        if (key === "t") {
            skipLevel();
        }

        if (key === "r") {
            previousLevel();
        }

    }

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

    // movement for levels 4 - 6
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

    // animate lava background level 4 - 6
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

    // animate sparkle while key exists
    if (key.spawned && !key.collected) {

        sparkleFrameCounter++;

        if (sparkleFrameCounter >= sparkleFrameDelay) {
            sparkleFrameCounter = 0;
            sparkleFrameIndex++;

            if (sparkleFrameIndex >= sparkleFrames.length) {
                sparkleFrameIndex = 0;
            }
        }

    }
    
    // animate lava splash if active
    if (lavaSplash) {

        lavaSplashFrameCounter++;

        if (lavaSplashFrameCounter >= lavaSplashFrameDelay) {
            lavaSplashFrameCounter = 0;
            lavaSplashFrameIndex++;
        }

        if (lavaSplashFrameIndex >= lavaSplashFrames.length) {
            lavaSplash = null;
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

    
    // fireball hits player level 6
    if (fireball && currentLevel === 5) {

        const hitboxPadding = 33;// make hitbox smaller for better feel

        const fireballHitbox = {
            x: fireball.x + hitboxPadding,
            y: fireball.y + hitboxPadding,
            size: fireball.size - hitboxPadding * 2
        };

        if (isColliding(player, fireballHitbox)) {

            // play hit sound
            playerHitSound.currentTime = 0;
            playerHitSound.play();

            fireball = null;

            // respawn player
            player.x = 177;
            player.y = 520;
            velocityY = 0;
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
    if (key.spawned && !key.collected && isColliding(player, key)) {
        key.collected = true;
        console.log("Key collected!");

        keyPickupSound.currentTime = 0;
        keyPickupSound.play();
    }

    // pick up bow and spawn enemies in level 3
    if (bow && !bow.collected && isColliding(player, bow)) {
        bow.collected = true;

        if (currentLevel === 2) {

            let s1 = getRandomSpawnEitherSide(70);
            let s2 = getRandomSpawnEitherSide(70);
            let s3 = getRandomSpawnEitherSide(55);

            enemy1 = { x: s1.x, y: s1.y, size: 100, speed: 0.9, frameX: 0, maxFrame: 7, frameCounter: 0, frameDelay: 10 };
            enemy2 = { x: s2.x, y: s2.y, size: 100, speed: 1.2, frameX: 0, maxFrame: 7, frameCounter: 0, frameDelay: 10 };
            enemy3 = { x: s3.x, y: s3.y, size: 85, speed: 1.6, frameX: 0, maxFrame: 4, frameCounter: 0, frameDelay: 10 };
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

    // level 6 dragon movement + animation
    if (dragon && currentLevel === 5) {

        // move dragon
        if (dragon.direction === "down") {
            dragon.y += dragon.speed * deltaTime;

            if (dragon.y >= dragon.endY) {
                dragon.direction = "up";
            }
        } 
        else {
            dragon.y -= dragon.speed * deltaTime;

            if (dragon.y <= dragon.startY) {
                dragon.y = dragon.startY;
                dragon.direction = "down";
            }
        }

        // animate dragon
        dragonFrameCounter++;

        if (dragonFrameCounter >= dragonFrameDelay) {
            dragonFrameCounter = 0;
            dragonFrameIndex++;
        }

        if (dragonFrameIndex >= dragonFrames.length) {
            dragonFrameIndex = 0;
        }
    }

   // dragon fireball shooting level 6
    if (dragon && currentLevel === 5) {

        fireballShootCounter++;

        if (fireballShootCounter >= fireballShootDelay && !fireball) {

            let dx = player.x - dragon.x;
            let dy = player.y - dragon.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 0) {
                dx = dx / dist;
                dy = dy / dist;
            }

            fireball = {
                x: dragon.x,
                y: dragon.y + 40,
                dx: dx,
                dy: dy,
                size: 60,
                speed: 8
            };

            fireballFrameIndex = 0;
            fireballFrameCounter = 0;
            fireballShootCounter = 0;
        }
    }

    // update fireball
    if (fireball) {

        fireball.x += fireball.dx * fireball.speed * deltaTime;
        fireball.y += fireball.dy * fireball.speed * deltaTime;

        // animate fireball
        fireballFrameCounter++;

        if (fireballFrameCounter >= fireballFrameDelay) {
            fireballFrameCounter = 0;
            fireballFrameIndex++;
        }

        if (fireballFrameIndex >= fireballFrames.length) {
            fireballFrameIndex = 0;
        }
    }

    // fireball hits walls
    if (fireball) {

        for (let wall of walls) {

            if (
                fireball.x < wall.x + (wall.width || wall.size) &&
                fireball.x + fireball.size > wall.x &&
                fireball.y < wall.y + (wall.height || wall.size) &&
                fireball.y + fireball.size > wall.y
            ) {
                fireball = null;
                break;
            }
        }
    }

    // green boss movement + animations level 7
    if (greenBoss && currentLevel === 6) {

        let playerCenterX = player.x + player.size / 2;
        let playerCenterY = player.y + player.size / 2;

        let bossCenterX = greenBoss.x + greenBoss.size / 2;
        let bossCenterY = greenBoss.y + greenBoss.size / 2;

        let dx = playerCenterX - bossCenterX;
        let dy = playerCenterY - bossCenterY;
        let dist = Math.sqrt(dx * dx + dy * dy);

        // slam cooldown timer
        if (bossSlamCooldown > 0) {
            bossSlamCooldown -= 1 * deltaTime;
        }

        // start slam if close
        if (bossState === "walk" && dist < 200 && bossSlamCooldown <= 0) {
            bossState = "slam";
            greenBossSlamFrameIndex = 0;
            greenBossSlamFrameCounter = 0;
        }

        // slam state
        if (bossState === "slam") {

            greenBossSlamFrameCounter += 1 * deltaTime;

            if (greenBossSlamFrameCounter >= 6) {
                greenBossSlamFrameCounter = 0;
                greenBossSlamFrameIndex++;

                // hit only on frame 6
                if (greenBossSlamFrameIndex === 5 && !bossSlamTriggered) {

                    bossSlamTriggered = true;

                    let playerCenterX = player.x + player.size / 2;
                    let playerCenterY = player.y + player.size / 2;

                    let bossCenterX = greenBoss.x + greenBoss.size / 2;
                    let bossCenterY = greenBoss.y + greenBoss.size / 2;

                    let dx = playerCenterX - bossCenterX;
                    let dy = playerCenterY - bossCenterY;
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    // if player within slam radius
                    if (dist < 300 && !invincible) {

                        health -= 1;

                        playerHitSound.currentTime = 0;
                        playerHitSound.play();

                        invincible = true;
                        setTimeout(() => invincible = false, 1000);

                        console.log("Boss slam hit! Health:", health);
                    }
                }
            }

            // when all frames played go back to walking
            if (greenBossSlamFrameIndex >= greenBossSlamFrames.length) {
                bossState = "walk";
                bossSlamCooldown = 30;
                greenBossSlamFrameIndex = 0;
                bossSlamTriggered = false;
            }
        }

        // walk state
        else if (bossState === "walk") {

            let bossStopDistance = 90;

            // stop movement when close
            if (dist > bossStopDistance) {

                dx /= dist;
                dy /= dist;

                greenBoss.x += dx * greenBoss.speed * deltaTime;
                greenBoss.y += dy * greenBoss.speed * deltaTime;

                if (Math.abs(dx) > 0.1) {
                    if (dx < 0) {
                        greenBoss.direction = "left";
                    } else {
                        greenBoss.direction = "right";
                    }
                }
            }

            // play walk animation
            greenBossFrameCounter++;

            if (greenBossFrameCounter >= greenBossFrameDelay) {
                greenBossFrameCounter = 0;
                greenBossFrameIndex++;

                if (greenBossFrameIndex >= greenBossFrames.length) {
                    greenBossFrameIndex = 0;
                }
            }
        }
}

    // shoot boss arrow level 7
    if (currentLevel === 6 && pressedKeys[" "] && !bossArrow && !spacePressed) {

        spacePressed = true;
        let arrowSpeed = 12;
        let arrowWidth = 60;
        let arrowHeight = 40;

        let playerCenterX = player.x + player.size / 2;
        let playerCenterY = player.y + player.size / 2;

        bossArrow = {
            x: playerCenterX - arrowWidth / 2,
            y: playerCenterY - arrowHeight / 2,
            width: arrowWidth,
            height: arrowHeight,
            speed: arrowSpeed,
            direction: player.direction
        };

        shootSound.currentTime = 0;
        shootSound.play();
    }

    // move boss arrow level 7
    if (bossArrow) {

        if (bossArrow.direction === "right") bossArrow.x += bossArrow.speed * deltaTime;
        else if (bossArrow.direction === "left") bossArrow.x -= bossArrow.speed * deltaTime;
        else if (bossArrow.direction === "up") bossArrow.y -= bossArrow.speed * deltaTime;
        else if (bossArrow.direction === "down") bossArrow.y += bossArrow.speed * deltaTime;

        // remove if off screen
        if (
            bossArrow.x > canvas.width ||
            bossArrow.x + bossArrow.width < 0 ||
            bossArrow.y > canvas.height ||
            bossArrow.y + bossArrow.height < 0
        ) {
            bossArrow = null;
        }
    }

    // boss arrow hits green boss
    if (currentLevel === 6 && greenBoss && bossArrow && isColliding(bossArrow, greenBoss)) {

        enemyHitSound.currentTime = 0;
        enemyHitSound.play();

        bossScore += 5;
        bossArrow = null;

        // boss defeated
        if (bossScore >= 150) {

            greenBoss = null;
            bossState = "walk";

            // start delayed trophy spawn
            if (!trophySpawning) {
                trophySpawning = true;
                trophySpawnTimer = 0;
            }
        }
    }


    // delayed trophy spawn after boss dies
    if (currentLevel === 6 && trophySpawning && trophy && !trophy.spawned) {

        trophySpawnTimer++;

        if (trophySpawnTimer >= trophySpawnDelay) {

            trophy.spawned = true;
            trophySpawning = false;
        }
    }


    // animate trophy level 7
    if (currentLevel === 6 && trophy && trophy.spawned) {

        trophyFrameCounter++;

        if (trophyFrameCounter >= trophyFrameDelay) {
            trophyFrameCounter = 0;
            trophyFrameIndex++;

            if (trophyFrameIndex >= trophyFrames.length) {
                trophyFrameIndex = 0;
            }
        }
    }


    // player collects trophy and ends game
    if (currentLevel === 6 && trophy && trophy.spawned) {

        // smaller centred player hitbox
        const playerHitbox = {
            x: player.x + 15,
            y: player.y + 15,
            size: player.size - 30
        };

        // smaller centred trophy hitbox
        const trophyPadding = 35;

        const trophyHitbox = {
            x: trophy.x + trophyPadding,
            y: trophy.y + trophyPadding,
            size: trophy.size - trophyPadding * 2
        };

        if (isColliding(playerHitbox, trophyHitbox)) {

            trophy.spawned = false;

            // play level up sound
            levelCompleteSound.currentTime = 0;
            levelCompleteSound.play();

            if (showEnding) {
                endGameSplashes();
            }
        }
    }

    // animate level 7 fires
    if (currentLevel === 6 && level7Fires.length > 0) {

        fireLevel7FrameCounter++;

        if (fireLevel7FrameCounter >= fireLevel7FrameDelay) {
            fireLevel7FrameCounter = 0;
            fireLevel7FrameIndex++;

            if (fireLevel7FrameIndex >= fireLevel7Frames.length) {
                fireLevel7FrameIndex = 0;
            }
        }

    }


    // falling rock level 5
    if (currentLevel === 4) {

        // if rock exists make it fall
        if (fallingRock) {

            fallingRock.y += fallingRock.speed * deltaTime;

            // animate rock
            fallingRockFrameCounter++;

            if (fallingRockFrameCounter >= fallingRockFrameDelay) {
                fallingRockFrameCounter = 0;
                fallingRockFrameIndex++;
            }

            if (fallingRockFrameIndex >= fallingRockFrames.length) {
                fallingRockFrameIndex = 0;
            }

            // hit lava , remove rock
            if (fallingRock.y >= 850) {
                fallingRock = null;
                fallingRockRespawnCounter = 0;
            }
        }

        // respawn after delay
        else {
            fallingRockRespawnCounter++;

            if (fallingRockRespawnCounter >= fallingRockRespawnDelay) {

                fallingRock = {
                    x: 742,
                    y: 212,
                    size: 50,
                    speed: 6
                };

                fallingRockFrameIndex = 0;
                fallingRockFrameCounter = 0;
                fallingRockRespawnCounter = 0;
            }
        }

        // falling rock hits player 
    if (currentLevel === 4 && fallingRock) {

        const hitboxPadding = 20; // hitbox smaller

        const rockHitbox = {
            x: fallingRock.x + hitboxPadding,
            y: fallingRock.y + hitboxPadding,
            size: fallingRock.size - hitboxPadding * 2
        };

        if (isColliding(player, rockHitbox)) {

            // play hit sound
            playerHitSound.currentTime = 0;
            playerHitSound.play();

            // remove rock
            fallingRock = null;
            fallingRockRespawnCounter = 0;

            // respawn player 
            player.x = 177;
            player.y = 540;
            velocityY = 0;
        }
    }

    }

    // second falling rock level 5
    if (currentLevel === 4) {

        if (fallingRock2) {

            fallingRock2.y += fallingRock2.speed * deltaTime;

            fallingRock2FrameCounter++;

            if (fallingRock2FrameCounter >= fallingRockFrameDelay) {
                fallingRock2FrameCounter = 0;
                fallingRock2FrameIndex++;
            }

            if (fallingRock2FrameIndex >= fallingRockFrames.length) {
                fallingRock2FrameIndex = 0;
            }

            if (fallingRock2.y >= 850) {
                fallingRock2 = null;
                fallingRock2RespawnCounter = 0;
            }
        }
        else {
            fallingRock2RespawnCounter++;

            if (fallingRock2RespawnCounter >= fallingRockRespawnDelay) {
                fallingRock2 = {
                    x: 1090,
                    y: 212,
                    size: 50,
                    speed: 9
                };

                fallingRock2FrameIndex = 0;
                fallingRock2FrameCounter = 0;
                fallingRock2RespawnCounter = 0;
            }
        }

        // second falling rock hits player
        if (currentLevel === 4 && fallingRock2) {

            const hitboxPadding = 20;

            const rockHitbox = {
                x: fallingRock2.x + hitboxPadding,
                y: fallingRock2.y + hitboxPadding,
                size: fallingRock2.size - hitboxPadding * 2
            };

            if (isColliding(player, rockHitbox)) {

                // play hit sound
                playerHitSound.currentTime = 0;
                playerHitSound.play();

                fallingRock2 = null;
                fallingRock2RespawnCounter = 0;

                player.x = 177;
                player.y = 540;
                velocityY = 0;
            }
        }

    }

    // third falling rock level 5
    if (currentLevel === 4) {

        if (fallingRock3) {

            fallingRock3.y += fallingRock3.speed * deltaTime;

            fallingRock3FrameCounter++;

            if (fallingRock3FrameCounter >= fallingRockFrameDelay) {
                fallingRock3FrameCounter = 0;
                fallingRock3FrameIndex++;
            }

            if (fallingRock3FrameIndex >= fallingRockFrames.length) {
                fallingRock3FrameIndex = 0;
            }

            if (fallingRock3.y >= 850) {
                fallingRock3 = null;
                fallingRock3RespawnCounter = 0;
            }
        }
        else {
            fallingRock3RespawnCounter++;

            if (fallingRock3RespawnCounter >= fallingRockRespawnDelay) {
                fallingRock3 = {
                    x: 398,
                    y: 212,
                    size: 50,
                    speed: 7
                };

                fallingRock3FrameIndex = 0;
                fallingRock3FrameCounter = 0;
                fallingRock3RespawnCounter = 0;
            }
        }

        // third falling rock hits player
        if (fallingRock3) {

            const hitboxPadding = 20;

            const rockHitbox = {
                x: fallingRock3.x + hitboxPadding,
                y: fallingRock3.y + hitboxPadding,
                size: fallingRock3.size - hitboxPadding * 2
            };

            if (isColliding(player, rockHitbox)) {

                // play hit sound
                playerHitSound.currentTime = 0;
                playerHitSound.play();

                fallingRock3 = null;
                fallingRock3RespawnCounter = 0;

                player.x = 177;
                player.y = 540;
                velocityY = 0;
            }
        }
    }

    // fourth falling rock level 5
    if (currentLevel === 4) {

        if (fallingRock4) {

            fallingRock4.y += fallingRock4.speed * deltaTime;

            fallingRock4FrameCounter++;

            if (fallingRock4FrameCounter >= fallingRockFrameDelay) {
                fallingRock4FrameCounter = 0;
                fallingRock4FrameIndex++;
            }

            if (fallingRock4FrameIndex >= fallingRockFrames.length) {
                fallingRock4FrameIndex = 0;
            }

            if (fallingRock4.y >= 850) {
                fallingRock4 = null;
                fallingRock4RespawnCounter = 0;
            }
        }
        else {
            fallingRock4RespawnCounter++;

            if (fallingRock4RespawnCounter >= fallingRockRespawnDelay) {
                fallingRock4 = {
                    x: 1495,
                    y: 212,
                    size: 50,
                    speed: 7
                };

                fallingRock4FrameIndex = 0;
                fallingRock4FrameCounter = 0;
                fallingRock4RespawnCounter = 0;
            }
        }

        // rock 4 hits player
        if (fallingRock4) {

            const hitboxPadding = 20;

            const rockHitbox = {
                x: fallingRock4.x + hitboxPadding,
                y: fallingRock4.y + hitboxPadding,
                size: fallingRock4.size - hitboxPadding * 2
            };

            if (isColliding(player, rockHitbox)) {

                // play hit sound
                playerHitSound.currentTime = 0;
                playerHitSound.play();

                fallingRock4 = null;
                fallingRock4RespawnCounter = 0;

                player.x = 177;
                player.y = 540;
                velocityY = 0;
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
    if (bow && bow.collected && pressedKeys[" "] && !arrow && !spacePressed) {

        spacePressed = true;
        let arrowSpeed = 12;
        let arrowWidth = 80;
        let arrowHeight = 40;

        // get player centre
        let playerCenterX = player.x + player.size / 2;
        let playerCenterY = player.y + player.size / 2;

        // spawn arrow centred on player
        let arrowX = playerCenterX - arrowWidth / 2;
        let arrowY = playerCenterY - arrowHeight / 2;

        arrow = {
            x: arrowX,
            y: arrowY,
            width: arrowWidth,
            height: arrowHeight,
            speed: arrowSpeed,
            direction: player.direction
        };

        shootSound.currentTime = 0;
        shootSound.play();
    }

    // reset tap shoot
    if (!pressedKeys[" "]) {
        spacePressed = false;
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

                if (currentLevel === 2) {
                    let s = getRandomSpawnEitherSide(e.size);
                    e.x = s.x;
                    e.y = s.y;
                }
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

            if (dx > 0) {
                enemy.direction = "right";
            } else {
                enemy.direction = "left";
            }

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

    // level 7 death (boss fight)
    if (currentLevel === 6 && health <= 0) {

        playerDeathSound.currentTime = 0;
        playerDeathSound.play();

        setTimeout(() => {

            bossScore = 0;
            health = 3;

            currentLevel = 5;
            loadLevel(5);

            // show text after loads
            setTimeout(() => {

                textBox.innerHTML = "<p>I have been defeated! ... wait NOT AGAIN!!!</p>";
                textBox.classList.remove("hidden");

                setTimeout(() => {
                    textBox.classList.add("hidden");
                }, 2000);

            }, 200);

        }, 500);
    }

    // remove enemies and spawn key if score hits 50 in level 3
    if (currentLevel === 2 && score >= 50 && !key.spawned) {
        enemy1 = null;
        enemy2 = null;
        enemy3 = null;

        // spawn key fixed
        key = {
            x: 1500,
            y: 450,
            size: 30,
            collected: false,
            spawned: true
        };

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


        if ( touchingExit && !wasTouchingExit &&
        (
            // levels 0 - 2 need key
            ((currentLevel === 0 || currentLevel === 1 || currentLevel === 2) && key.collected) ||

            // parkour levels auto exit
            (currentLevel === 3 || currentLevel === 4 || currentLevel === 5) ||

            // level 7 needs boss score
            (currentLevel === 6 && bossScore >= 150)
        )
    ) 
    {
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

            //play hit sound
            playerHitSound.currentTime = 0;
            playerHitSound.play();

            player.x = 177;
            player.y = 540;
            velocityY = 0;
        }
    }

    // lava death level 4 ,5 and 6
    if (currentLevel === 3 || currentLevel === 4 || currentLevel === 5) {

    if (player.y + player.size >= 860) {

        //play hit sound
        playerHitSound.currentTime = 0;
        playerHitSound.play();

        // create splash where player died
        lavaSplash = {
            x: player.x - 30,
            y: 860 - 80,
            size: 120
        };

        lavaSplashFrameIndex = 0;
        lavaSplashFrameCounter = 0;

        // respawn player immediately
        player.x = 177;

        if (currentLevel === 5) {
            player.y = 520;
        } else {
            player.y = 540;
        }

        velocityY = 0;
    }
}

}


let isDragging = false;
let dragStart = { x: 0, y: 0 };
let currentDrag = null; 
let debugMode = false;

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

    // textbox above player
    const rect = canvas.getBoundingClientRect();

    const scaleX = rect.width / canvas.width;
    const scaleY = rect.height / canvas.height;

    textBox.style.left =
        rect.left + (player.x + player.size / 2) * scaleX + "px";

    textBox.style.top =
        rect.top + (player.y - 15) * scaleY + "px";

    textBox.style.transform = "translate(-50%, -100%)";


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

    // draw lava splash if player just died in lava
    if (
        lavaSplash &&
        lavaSplashFrames[lavaSplashFrameIndex] &&
        lavaSplashFrames[lavaSplashFrameIndex].complete
    ) 
    
    {
        ctx.drawImage(
            lavaSplashFrames[lavaSplashFrameIndex],
            lavaSplash.x,
            lavaSplash.y,
            lavaSplash.size,
            lavaSplash.size
        );
    }

    // draw dragon for level 6
    if (
    dragon &&
    dragonFrames[dragonFrameIndex] &&
    dragonFrames[dragonFrameIndex].complete

    ) {
        ctx.drawImage(
            dragonFrames[dragonFrameIndex],
            dragon.x,
            dragon.y,
            220,
            180
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

    // draw sparkle near key
    if (
        key.spawned &&
        !key.collected &&
        sparkleFrames[sparkleFrameIndex] &&
        sparkleFrames[sparkleFrameIndex].complete
    ) {

        ctx.drawImage(
            sparkleFrames[sparkleFrameIndex],
            key.x - 20,
            key.y - 35,
            key.size * 3,
            key.size * 3
        );
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
if (debugMode && currentDrag) {
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
        if (debugMode) {
            ctx.strokeRect(
                movingPlatform1.x,
                movingPlatform1.y,
                movingPlatform1.width,
                movingPlatform1.height
            );
    }

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

        if (debugMode) {
            ctx.strokeRect(
                movingPlatform1.x,
                movingPlatform1.y,
                movingPlatform1.width,
                movingPlatform1.height
            );
        }
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
       if (debugMode) {
            ctx.strokeRect(
                movingPlatform1.x,
                movingPlatform1.y,
                movingPlatform1.width,
                movingPlatform1.height
            );
        }
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
        if (debugMode) {
            ctx.strokeRect(
                movingPlatform1.x,
                movingPlatform1.y,
                movingPlatform1.width,
                movingPlatform1.height
            );
        }
    }

    // draw falling rock level 5
    if (
        currentLevel === 4 &&
        fallingRock &&
        fallingRockFrames[fallingRockFrameIndex] &&
        fallingRockFrames[fallingRockFrameIndex].complete
    ) {
        ctx.drawImage(
            fallingRockFrames[fallingRockFrameIndex],
            fallingRock.x,
            fallingRock.y,
            fallingRock.size,
            fallingRock.size
        );
    }

    // draw falling rock 2 level 5
    if (
        currentLevel === 4 &&
        fallingRock2 &&
        fallingRockFrames[fallingRock2FrameIndex] &&
        fallingRockFrames[fallingRock2FrameIndex].complete
    ) 
    
    {
        ctx.drawImage(
            fallingRockFrames[fallingRock2FrameIndex],
            fallingRock2.x,
            fallingRock2.y,
            fallingRock2.size,
            fallingRock2.size
        );
    }

    // draw falling rock 3 level 5
    if (
        currentLevel === 4 &&
        fallingRock3 &&
        fallingRockFrames[fallingRock3FrameIndex] &&
        fallingRockFrames[fallingRock3FrameIndex].complete
    ) {
        ctx.drawImage(
            fallingRockFrames[fallingRock3FrameIndex],
            fallingRock3.x,
            fallingRock3.y,
            fallingRock3.size,
            fallingRock3.size
        );
    }

    // draw falling rock 4 level 5
    if (
        currentLevel === 4 &&
        fallingRock4 &&
        fallingRockFrames[fallingRock4FrameIndex] &&
        fallingRockFrames[fallingRock4FrameIndex].complete
    ) {
        ctx.drawImage(
            fallingRockFrames[fallingRock4FrameIndex],
            fallingRock4.x,
            fallingRock4.y,
            fallingRock4.size,
            fallingRock4.size
        );
    }




    if (
        fireball &&
        fireballFrames[fireballFrameIndex] &&
        fireballFrames[fireballFrameIndex].complete
    ) 
    
        {
            ctx.drawImage(
                fireballFrames[fireballFrameIndex],
                fireball.x,
                fireball.y,
                fireball.size,
                fireball.size
        );
    }

    // draw green boss level 7
    if (greenBoss) {

        ctx.save();

        let bossCenterX = greenBoss.x + greenBoss.size / 2;
        let bossCenterY = greenBoss.y + greenBoss.size / 2;

        ctx.translate(bossCenterX, bossCenterY);

        let bossImage;
        let bossDrawSize = greenBoss.size;

        // slam frames are bigger than walk frames so it looks better
        if (bossState === "slam") {
            bossImage = greenBossSlamFrames[greenBossSlamFrameIndex];
            bossDrawSize = greenBoss.size * 1.55;
        }
        else {
            bossImage = greenBossFrames[greenBossFrameIndex];
        }

        // flip logic
        if (bossState === "slam") {

            if (greenBoss.direction === "right") {
                ctx.scale(-1, 1);
            }

        } else {

            if (greenBoss.direction === "left") {
                ctx.scale(-1, 1);
            }

        }

        if (bossImage && bossImage.complete) {

            ctx.drawImage(
                bossImage,
                -bossDrawSize / 2,
                -bossDrawSize / 2,
                bossDrawSize,
                bossDrawSize
            );
        }

        ctx.restore();
    }

    // draw level 7 fires
    if (currentLevel === 6) {

        for (let fire of level7Fires) {

            if (
                fireLevel7Frames[fireLevel7FrameIndex] &&
                fireLevel7Frames[fireLevel7FrameIndex].complete
            ) {

                ctx.drawImage(
                    fireLevel7Frames[fireLevel7FrameIndex],
                    fire.x,
                    fire.y,
                    fire.size,
                    fire.size
                );
            }
        }

    }

    // draw boss arrow level 7
    if (bossArrow) {

        ctx.save();
        ctx.translate(bossArrow.x + bossArrow.width / 2, bossArrow.y + bossArrow.height / 2);

        if (bossArrow.direction === "left") ctx.rotate(Math.PI);
        else if (bossArrow.direction === "up") ctx.rotate(-Math.PI/2);
        else if (bossArrow.direction === "down") ctx.rotate(Math.PI/2);

        ctx.drawImage(
            bossArrowSprite,
            -bossArrow.width / 2,
            -bossArrow.height / 2,
            bossArrow.width,
            bossArrow.height
        );

        ctx.restore();
    }

    // draw trophy level 7
    if (
        currentLevel === 6 &&
        trophy &&
        trophy.spawned &&
        trophyFrames[trophyFrameIndex] &&
        trophyFrames[trophyFrameIndex].complete
    ) {

        ctx.drawImage(
            trophyFrames[trophyFrameIndex],
            trophy.x,
            trophy.y,
            trophy.size,
            trophy.size
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

        ctx.save();

        if (enemy1.direction === "right") {
            ctx.translate(enemy1.x + enemy1.size, enemy1.y);
            ctx.scale(-1, 1);
            ctx.drawImage(
                enemy1Sprite,
                enemy1.frameX * frameWidth1, 0, frameWidth1, frameHeight1,
                0, 0, enemy1.size, enemy1.size
            );
        } else {
            ctx.drawImage(
                enemy1Sprite,
                enemy1.frameX * frameWidth1, 0, frameWidth1, frameHeight1,
                enemy1.x, enemy1.y, enemy1.size, enemy1.size
            );
        }

        ctx.restore();
    }
    // draw enemy 2
    if (enemy2) {
        const frameWidth2 = enemy2Sprite.width / (enemy2.maxFrame + 1);
        const frameHeight2 = enemy2Sprite.height;

        ctx.save();

        if (enemy2.direction === "right") {
            ctx.translate(enemy2.x + enemy2.size, enemy2.y);
            ctx.scale(-1, 1);
            ctx.drawImage(
                enemy2Sprite,
                enemy2.frameX * frameWidth2, 0, frameWidth2, frameHeight2,
                0, 0, enemy2.size, enemy2.size
            );
        } else {
            ctx.drawImage(
                enemy2Sprite,
                enemy2.frameX * frameWidth2, 0, frameWidth2, frameHeight2,
                enemy2.x, enemy2.y, enemy2.size, enemy2.size
            );
        }

        ctx.restore();
    }
    // draw enemy 3
    if (enemy3) {
        const frameWidth3 = enemy3Sprite.width / (enemy3.maxFrame + 1);
        const frameHeight3 = enemy3Sprite.height;

        ctx.save();

        if (enemy3.direction === "right") {
            ctx.translate(enemy3.x + enemy3.size, enemy3.y);
            ctx.scale(-1, 1);
            ctx.drawImage(
                enemy3Sprite,
                enemy3.frameX * frameWidth3, 0, frameWidth3, frameHeight3,
                0, 0, enemy3.size, enemy3.size
            );
        } else {
            ctx.drawImage(
                enemy3Sprite,
                enemy3.frameX * frameWidth3, 0, frameWidth3, frameHeight3,
                enemy3.x, enemy3.y, enemy3.size, enemy3.size
            );
        }

        ctx.restore();
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


    // level 3 UI
    if (currentLevel === 2) {
        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";  
        ctx.fillText("Score: " + score, canvas.width / 2, 40);
        ctx.textAlign = "left";
    }

        if (currentLevel === 2) {
        const heartSize = 60; 
        const spacing = 10; 
        const totalWidth = health * (heartSize + spacing) - spacing;
        const startX = (canvas.width - totalWidth) / 2; 
        const y = 50;

        for (let i = 0; i < health; i++) {
            ctx.drawImage(
                heartSprite,
                startX + i * (heartSize + spacing),
                y,
                heartSize,
                heartSize
            );
        }
    }

    // level 7 UI
    if (currentLevel === 6) {

        // the score
        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Boss Score: " + bossScore + "/150", canvas.width / 2, 90);
        ctx.textAlign = "left";

        // heart sprites
        const heartSize = 60;
        const spacing = 10;
        const totalWidth = health * (heartSize + spacing) - spacing;
        const startX = (canvas.width - totalWidth) / 2;
        const y = 120;

        for (let i = 0; i < health; i++) {
            ctx.drawImage(
                heartSprite,
                startX + i * (heartSize + spacing),
                y,
                heartSize,
                heartSize
            );
        }
    }


    // lighting effect only for level 2
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
    
    // hide menu
    menuDiv.classList.add("hidden");

    // show scroll
    document.getElementById("scrollIntro").classList.remove("hidden");

    // wait then start game
    setTimeout(function(){

        document.getElementById("scrollIntro").classList.add("hidden");

        gameState = "playing";

        backgroundSound.play();

        // show first textbox
        textBox.innerHTML = "<p>How did I get here?!</p>";
        textBox.classList.remove("hidden");

        setTimeout(function() {
            textBox.classList.add("hidden");

            setTimeout(function() {
                textBox.innerHTML = "<p>I need to find a way out</p>";
                textBox.classList.remove("hidden");

                setTimeout(function() {
                    textBox.classList.add("hidden");
                }, 3000);

            }, 1000);

        }, 2000);

    }, 1000); // 18 second delay

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
