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
    speed: 10, // 6 is default, adjusted for testing
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

// lava trap animation frames 
const lavaTrapFrames = [];

for (let i = 1; i <= 11; i++) {
    const img = new Image();
    img.src = "assets/images/lavatrap_" + i + ".png";
    lavaTrapFrames.push(img);
}

let lavaTraps = [];

let lavaTrapFrameIndex = 0;
let lavaTrapFrameCounter = 0;
let lavaTrapFrameDelay = 40;


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

// big spike animation frames
const bigSpikeFrames = [];

for (let i = 1; i <= 8; i++) {
    const img = new Image();
    img.src = "assets/images/bigspike_" + i + ".png";
    bigSpikeFrames.push(img);
}

let bigSpikes = [];
let bigSpikeFrameIndex = 0;
let bigSpikeFrameCounter = 0;
let bigSpikeFrameDelay = 22;

// small spike animation frames
const smallSpikeFrames = [];

for (let i = 1; i <= 8; i++) {
    const img = new Image();
    img.src = "assets/images/smallspike_" + i + ".png";
    smallSpikeFrames.push(img);
}

let smallSpikes = [];
let smallSpikeFrameIndex = 0;
let smallSpikeFrameCounter = 0;
let smallSpikeFrameDelay = 25;

// falling arrows for level 8
let fallingBossArrows = [];
let fallingArrowTraps = [];

// red bat animation frames lvl 8
const redBatFrames = [];

for (let i = 1; i <= 6; i++) {
    const img = new Image();
    img.src = "assets/images/redbat_" + i + ".png";
    redBatFrames.push(img);
}

let redBat = null;

let redBatFrameIndex = 0;
let redBatFrameCounter = 0;
let redBatFrameDelay = 8;

// level 9 blue spider
const blueSpiderFrames = [];

for (let i = 1; i <= 8; i++) {
    const img = new Image();
    img.src = "assets/images/bluespider_" + i + ".png";
    blueSpiderFrames.push(img);
}

let blueSpiderFrameIndex = 0;
let blueSpiderFrameCounter = 0;
let blueSpiderFrameDelay = 10;
let level9Spider = null;

// level 9 bat one 
const batOneLvl9Frames = [];

for (let i = 1; i <= 4; i++) {
    const img = new Image();
    img.src = "assets/images/batOneLvl9_" + i + ".png";
    batOneLvl9Frames.push(img);
}

let batOneLvl9FrameIndex = 0;
let batOneLvl9FrameCounter = 0;
let batOneLvl9FrameDelay = 10;
let batOneLvl9 = null;

// level 9 green spider
const greenSpiderFrames = [];

for (let i = 1; i <= 8; i++) {
    const img = new Image();
    img.src = "assets/images/greenspider_" + i + ".png";
    greenSpiderFrames.push(img);
}

let greenSpiderFrameIndex = 0;
let greenSpiderFrameCounter = 0;
let greenSpiderFrameDelay = 10;
let greenSpiderLvl9 = null;

// level 9 green bat animation
const greenBatFrames = [];

for (let i = 1; i <= 4; i++) {
    const img = new Image();
    img.src = "assets/images/greenbat_" + i + ".png";
    greenBatFrames.push(img);
}

let greenBatFrameIndex = 0;
let greenBatFrameCounter = 0;
let greenBatFrameDelay = 10;
let greenBatLvl9 = null;

// level 9 purple spider
const purpleSpiderFrames = [];

for (let i = 1; i <= 8; i++) {
    const img = new Image();
    img.src = "assets/images/purplespider_" + i + ".png";
    purpleSpiderFrames.push(img);
}

let purpleSpiderFrameIndex = 0;
let purpleSpiderFrameCounter = 0;
let purpleSpiderFrameDelay = 10;
let purpleSpiderLvl9 = null;

// swim player sprite lvl 10
const swimFrames = [];

for (let i = 1; i <= 4; i++) {
    const img = new Image();
    img.src = "assets/images/playerswim_" + i + ".png";
    swimFrames.push(img);
}

let swimFrameIndex = 0;
let swimFrameCounter = 0;
let swimFrameDelay = 18;

// orange fish frames lvl 10
const orangeFishFrames = [];

for (let i = 1; i <= 4; i++) {
    const img = new Image();
    img.src = "assets/images/orangefish_" + i + ".png";
    orangeFishFrames.push(img);
}

let orangeFishFrameIndex = 0;
let orangeFishFrameCounter = 0;
let orangeFishFrameDelay = 25;
let orangeFish = null;

// pink fish frames lvl 10
const pinkFishFrames = [];

for (let i = 1; i <= 4; i++) {
    const img = new Image();
    img.src = "assets/images/pinkfish_" + i + ".png";
    pinkFishFrames.push(img);
}

let pinkFishFrameIndex = 0;
let pinkFishFrameCounter = 0;
let pinkFishFrameDelay = 22;
let pinkFish = null;
let pinkFish2 = null;

// blue jellyfish frames lvl 10
const blueJellyfishFrames = [];

for (let i = 1; i <= 4; i++) {
    const img = new Image();
    img.src = "assets/images/bluejellyfish_" + i + ".png";
    blueJellyfishFrames.push(img);
}

let blueJellyfishFrameIndex = 0;
let blueJellyfishFrameCounter = 0;
let blueJellyfishFrameDelay = 20;
let blueJellyfish = null;

/*
// green fish frames lvl 10
const greenFishFrames = [];

for (let i = 1; i <= 4; i++) {
    const img = new Image();
    img.src = "assets/images/greenfish_" + i + ".png";
    greenFishFrames.push(img);
}

let greenFishFrameIndex = 0;
let greenFishFrameCounter = 0;
let greenFishFrameDelay = 20;

let greenFish = null; */

// pink jellyfish frames lvl 10
const pinkJellyfishFrames = [];

for (let i = 1; i <= 4; i++) {
    const img = new Image();
    img.src = "assets/images/pinkjellyfish_" + i + ".png";
    pinkJellyfishFrames.push(img);
}

let pinkJellyfishFrameIndex = 0;
let pinkJellyfishFrameCounter = 0;
let pinkJellyfishFrameDelay = 18;
let pinkJellyfish = null;

// crown sprite for lvl 10
const crownSprite = new Image();
crownSprite.src = "assets/images/crownlvl10.png";
let crown = null;

// bubble animation lvl 10
const bubbleFrames = [];

for (let i = 1; i <= 10; i++) {
    const img = new Image();
    img.src = "assets/images/bubbles_" + i + ".png";
    bubbleFrames.push(img);
}

let bubbleFrameIndex = 0;
let bubbleFrameCounter = 0;
let bubbleFrameDelay = 12;

// octopus animation frames
const octopusFrames = [];

for (let i = 1; i <= 4; i++) {
    const img = new Image();
    img.src = "assets/images/octopus_" + i + ".png";
    octopusFrames.push(img);
}

let octopusFrameIndex = 0;
let octopusFrameCounter = 0;
let octopusFrameDelay = 20;
let octopus = null;
let octopusHealth = 150;
let octopusMaxHealth = 150;

let octopusStopTimer = 0;
let octopusStopDelay = 300; // 5 seconds
let octopusPauseTimer = 0;
let octopusPaused = false;

let octopusTargetX = 0;
let octopusTargetY = 0;

// water audio for level 10
const underwaterSound = new Audio("assets/sounds/underwater.mp3");
underwaterSound.loop = true;
underwaterSound.volume = 0.3;

//shooting water animation lvl 10
const waterShootFrames = [];

for (let i = 1; i <= 5; i++) {
    const img = new Image();
    img.src = "assets/images/watershoot_" + i + ".png";
    waterShootFrames.push(img);
}

let waterShootFrameIndex = 0;
let waterShootFrameCounter = 0;
let waterShootFrameDelay = 10;
let waterShoot = null;

// seaweed animation lvl 10
const seaweedFrames = [];

for (let i = 1; i <= 4; i++) {
    const img = new Image();
    img.src = "assets/images/seaweed_" + i + ".png";
    seaweedFrames.push(img);
}

let seaweedFrameIndex = 0;
let seaweedFrameCounter = 0;
let seaweedFrameDelay = 26;






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
    },

    {
    backgroundSrc: "assets/images/background_8.png",//background lvl 8
        walls: [
            {x: 483, y: 139, width: 965, height: 3},
            {x: 1454, y: 141, width: 3, height: 150},
            {x: 1458, y: 289, width: 266, height: 3},
            {x: 1721, y: 292, width: 2, height: 502},
            {x: 1458, y: 787, width: 266, height: 2},
            {x: 1457, y: 789, width: 1, height: 154},
            {x: 467, y: 935, width: 987, height: 3},
            {x: 467, y: 792, width: 1, height: 140},
            {x: 199, y: 785, width: 269, height: 3},
            {x: 195, y: 285, width: 1, height: 499},
            {x: 196, y: 283, width: 271, height: 9},
            {x: 466, y: 138, width: 2, height: 145},

        ],
        key: {},
        exitWall: {x: 1721, y: 292, width: 2, height: 502}
    },

    {
    backgroundSrc: "assets/images/background_9.png",//background lvl 9
        walls: [
            {x: 195, y: 327, width: 3, height: 409},
            {x: 207, y: 325, width: 260, height: 4},
            {x: 466, y: 229, width: 1, height: 95},
            {x: 464, y: 224, width: 98, height: 8},
            {x: 561, y: 142, width: 1, height: 81},
            {x: 561, y: 131, width: 791, height: 11},
            {x: 1360, y: 141, width: 3, height: 88},
            {x: 1359, y: 229, width: 95, height: 5},
            {x: 1454, y: 234, width: 4, height: 92},
            {x: 1453, y: 325, width: 274, height: 4},
            {x: 1723, y: 330, width: 3, height: 430},
            {x: 1456, y: 750, width: 264, height: 3},
            {x: 1452, y: 750, width: 2, height: 90},
            {x: 1358, y: 842, width: 90, height: 6},
            {x: 1356, y: 850, width: 2, height: 91},
            {x: 567, y: 935, width: 787, height: 4},
            {x: 561, y: 845, width: 5, height: 89},
            {x: 476, y: 840, width: 89, height: 1},
            {x: 466, y: 750, width: 2, height: 94},
            {x: 189, y: 747, width: 279, height: 1}
        ],
        key: {},
        exitWall: {x: 1723, y: 330, width: 3, height: 430}
    },

    {
    backgroundSrc: "assets/images/background_10.png",//background lvl 10
        walls: [
            {x: 140, y: 174, width: 1657, height: 3},
            {x: 1788, y: 177, width: 3, height: 733},
            {x: 130, y: 903, width: 1657, height: 6},
            {x: 133, y: 175, width: 3, height: 727}
        ],
        key: {},
        exitWall: {x: 140, y: 174, width: 1657, height: 3}
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
        hintBox.textContent = "Beware of the green boss and his attacks, keep your distance, shoot the boss and defeat him to escape the cave!";
    } else if (currentLevel === 7) {
        hintBox.textContent = "Make your way to the exit... but beware of the traps and enemies lurking!";
    } else if (currentLevel === 8) {
        hintBox.textContent = "Try cross to the exit if you dare... but beware of fast enemies who can damage you!";
    } else if (currentLevel === 9) {
        hintBox.textContent = "Swim for your life! Avoid the fish and jellyfish, pick up the crown and swim to the surface to escape!";
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
    else if (levelIndex === 7) {
    // level 8
    player.x = 291;
    player.y = 565;
    }
    else if (levelIndex === 8) {
    // level 9
    player.x = 236;
    player.y = 540;
    }
    else if (levelIndex === 9) {
    // level 10
    player.x = 190;
    player.y = 540;
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

    if (levelIndex === 2 || levelIndex === 6 || levelIndex === 9) {
    health = 3; // reset health
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

    if (levelIndex === 7) {

    //lava traps locations and random index for animation
    lavaTraps = [

        { x: 222, y: 670, size: 120, frameOffset: Math.floor(Math.random() * lavaTrapFrames.length) },
        { x: 633, y: 450, size: 120, frameOffset: Math.floor(Math.random() * lavaTrapFrames.length) },
        { x: 1070, y: 532, size: 120, frameOffset: Math.floor(Math.random() * lavaTrapFrames.length) },
        { x: 1530, y: 381, size: 120, frameOffset: Math.floor(Math.random() * lavaTrapFrames.length) }

    ];
    } else {
        lavaTraps = [];
    }

    // spawn falling arrows level 8
    if (levelIndex === 7) {

        fallingBossArrows = [];

        fallingArrowTraps = [

            { x: 537,  y: 216, width: 35, height: 18, speed: 8, playerInRange: false },

            { x: 886,  y: 211, width: 35, height: 18, speed: 8, playerInRange: false },

            { x: 982,  y: 212, width: 35, height: 18, speed: 8, playerInRange: false },

            { x: 1254, y: 220, width: 35, height: 18, speed: 8, playerInRange: false },

            { x: 1348, y: 268, width: 35, height: 18, speed: 8, playerInRange: false }

        ];

        // spawn red bat
            redBat = {
                x: 499,
                y: 330,
                startX: 499,
                endX: 1406,
                size: 110,
                speed: 4,
                direction: "right"
            };

            redBatFrameIndex = 0;
            redBatFrameCounter = 0;

        } else {

            fallingBossArrows = [];
            redBat = null;

        }

    //big spike positions and random index for animation
    bigSpikes = [

        { x: 575, y: 600, size: 100, frameOffset: Math.floor(Math.random() * bigSpikeFrames.length) },
        { x: 960, y: 366, size: 100, frameOffset: Math.floor(Math.random() * bigSpikeFrames.length) },
        { x: 1599, y: 522, size: 100, frameOffset: Math.floor(Math.random() * bigSpikeFrames.length) },
        { x: 530, y: 762, size: 100, frameOffset: Math.floor(Math.random() * bigSpikeFrames.length) }

    ];

    bigSpikeFrameIndex = 0;
    bigSpikeFrameCounter = 0;

    //small spike positions and random index for animation
    smallSpikes = [

        { x: 672, y: 618, size: 70, frameOffset: Math.floor(Math.random() * smallSpikeFrames.length) },
        { x: 895, y: 370, size: 70, frameOffset: Math.floor(Math.random() * smallSpikeFrames.length) },
        { x: 1050, y: 370, size: 70, frameOffset: Math.floor(Math.random() * smallSpikeFrames.length) },
        { x: 602, y: 742, size: 70, frameOffset: Math.floor(Math.random() * smallSpikeFrames.length) },
        { x: 656, y: 804, size: 70, frameOffset: Math.floor(Math.random() * smallSpikeFrames.length) },
        { x: 1265, y: 580, size: 70, frameOffset: Math.floor(Math.random() * smallSpikeFrames.length) },
        { x: 1332, y: 595, size: 70, frameOffset: Math.floor(Math.random() * smallSpikeFrames.length) }

    ];

    smallSpikeFrameIndex = 0;
    smallSpikeFrameCounter = 0;
    
    // level 9 enemies load
    if (levelIndex === 8) {
        level9Spider = {
            x: 410,
            y: 322,
            size: 100,
            speed: Math.floor(Math.random() * 5) + 4,
            startY: 322,
            endY: 672,
            direction: "down"
        };


        batOneLvl9 = {
            x: 702,
            y: 154,
            size: 100,
            speed: Math.floor(Math.random() * 6) + 9,
            startY: 154,
            endY: 865,
            direction: "down"
        };

        greenSpiderLvl9 = {
            x: 952, 
            y: 154,  
            size: 100,
            speed: Math.floor(Math.random() * 5) + 9,
            startY: 154,
            endY: 865,
            direction: "down"
        };

        greenBatLvl9 = {
            x: 1200,
            y: 154,
            size: 100,
            speed: Math.floor(Math.random() * 5) + 8,
            startY: 154,
            endY: 865,
            direction: "down"
        };

        purpleSpiderLvl9 = {
            x: 1420, 
            y: 322,  
            size: 100,
            speed: Math.floor(Math.random() * 5) + 4,
            startY: 322,
            endY: 672,
            direction: "down"
        };

        }

        else {
            level9Spider = null;
            batOneLvl9 = null;
            greenSpiderLvl9 = null;
            greenBatLvl9 = null;
            purpleSpiderLvl9 = null;
    }

    
    // level 10 fish
    if (levelIndex === 9) {

        orangeFish = {
            x: 315,
            y: 260,
            baseY: 260,

            size: 90,

            speed: 5,
            direction: "right",

            startX: 315,
            endX: 920,

            waveOffset: 0 // up down motion
        };

        pinkFish = {
            x: 170,
            y: 800,
            baseY: 800,

            size: 90,

            speed: 4,
            direction: "right",

            startX: 170,
            endX: 880,

            waveOffset: 0 // up down motion
        };

        pinkFish2 = {
            x: 1090,
            y: 330,
            baseY: 330,

            size: 90,

            speed: 4,
            direction: "right",

            startX: 1090,
            endX: 1690,

            waveOffset: 0
        };

        blueJellyfish = {
            x: 928,
            y: 750,
            baseX: 928,

            size: 100,

            speed: 3,
            direction: "up",

            startY: 750,
            endY: 343,

            waveOffset: 0
        };

        /*
        greenFish = {
            x: 1200,
            y: 595,
            baseY: 595,

            size: 90,

            speed: 8,
            direction: "right",

            startX: 1200,
            endX: 1700,

            waveOffset: 0
        }; */

        pinkJellyfish = {
            x: 1147,
            y: 818,
            baseX: 1147,

            size: 100,

            speed: 6,
            direction: "up",

            startY: 818,
            endY: 450,

            waveOffset: 0
        };

        crown = {
            x: 1620,
            y: 800,
            size: 80,
            collected: false
        };

        octopus = {
            x: 1560,
            y: 550,
            size: 180,
            speed: 1.5
        };

        //reset octopus attack
        octopusStopTimer = 0;
        octopusPauseTimer = 0;
        octopusPaused = false;

    } else {
        orangeFish = null;
        pinkFish = null;
        pinkFish2 = null;
        blueJellyfish = null;
        /* greenFish = null; */
        pinkJellyfish = null;
        crown = null;
        octopus = null;
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

    // debug controls
    if (levelSkipEnabled) {

        if (key === "t") {
            skipLevel();
        }

        if (key === "r") {
            previousLevel();
        }

    }

    if (key === " " && currentLevel === 9 && !waterShoot) {

        let direction = "right";

        if (player.direction === "left") {
            direction = "left";
        }   

        waterShoot = {
            x: player.x + player.size / 2,
            y: player.y + player.size / 2,
            size: 60,
            speed: 12,
            direction: direction
        };

        shootSound.currentTime = 0;
        shootSound.play();

        // reset animation
        waterShootFrameIndex = 0;
        waterShootFrameCounter = 0;
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

    // lvl 10 sounds
    if (currentLevel === 9) {

    // stop cave background
    if (!backgroundSound.paused) {
        backgroundSound.pause();
    }

    // stop walking sound
    if (!walkingSound.paused) {
        walkingSound.pause();
    }

    // play underwater sound
    if (underwaterSound.paused) {
        underwaterSound.currentTime = 0;
        underwaterSound.play();
    }

} else {

    // stop underwater sound
    if (!underwaterSound.paused) {
        underwaterSound.pause();
    }

    // play cave background
    if (backgroundSound.paused) {
        backgroundSound.play();
    }

    // walking sound when moving
    if (moving) {
        if (walkingSound.paused) {
            walkingSound.currentTime = 0;
            walkingSound.play();
        }
    } else {
        if (!walkingSound.paused) {
            walkingSound.pause();
        }
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

    // animate lava traps
    lavaTrapFrameCounter++;

    if (lavaTrapFrameCounter >= lavaTrapFrameDelay) {
        lavaTrapFrameCounter = 0;
        lavaTrapFrameIndex++;

        if (lavaTrapFrameIndex >= lavaTrapFrames.length) {
            lavaTrapFrameIndex = 0;
        }
    }

    // animate big spikes
    bigSpikeFrameCounter++;

    if (bigSpikeFrameCounter >= bigSpikeFrameDelay) {

        bigSpikeFrameCounter = 0;
        bigSpikeFrameIndex++;

        if (bigSpikeFrameIndex >= bigSpikeFrames.length) {
            bigSpikeFrameIndex = 0;
        }

    }

    // animate small spikes
    smallSpikeFrameCounter++;

    if (smallSpikeFrameCounter >= smallSpikeFrameDelay) {

        smallSpikeFrameCounter = 0;
        smallSpikeFrameIndex++;

        if (smallSpikeFrameIndex >= smallSpikeFrames.length) {
            smallSpikeFrameIndex = 0;
        }

    }

    // lava trap damage level 8
    if (currentLevel === 7) {

        for (let trap of lavaTraps) {

            let frameIndex =
                (lavaTrapFrameIndex + trap.frameOffset) % lavaTrapFrames.length;

               //smaller hitbox when trap is fully open
            if (frameIndex >= 3 && frameIndex <= 7) {

                const trapHitbox = {
                    x: trap.x + 20,
                    y: trap.y + 20,
                    size: trap.size - 40
                };

                if (isColliding(player, trapHitbox)) {

                    playerHitSound.currentTime = 0;
                    playerHitSound.play();

                    // reset player
                    player.x = 291;
                    player.y = 565;
                    velocityY = 0;

                    return; // stop checking traps
                }
            }
        }
    }

    // big spike damage level 8
    if (currentLevel === 7) {

        for (let spike of bigSpikes) {

            let frameIndex =
                (bigSpikeFrameIndex + spike.frameOffset) % bigSpikeFrames.length;

            //damage frames
            if (frameIndex >= 3 && frameIndex <= 5) {

                let paddingX = 30;
                let paddingTop = 25;
                let paddingBottom = 10;

                let spikeHitbox = {
                    x: spike.x + paddingX,
                    y: spike.y + paddingTop,
                    width: spike.size - paddingX * 2,
                    height: spike.size - paddingTop - paddingBottom
                };

                if (isColliding(player, spikeHitbox)) {

                    playerHitSound.currentTime = 0;
                    playerHitSound.play();

                    //respawn player
                    player.x = 291;
                    player.y = 565;
                    velocityY = 0;

                    return;
                }
            }
        }
    }

    // small spike damage level 8
    if (currentLevel === 7) {

        for (let spike of smallSpikes) {

            let frameIndex =
                (smallSpikeFrameIndex + spike.frameOffset) % smallSpikeFrames.length;

            if (frameIndex >= 3 && frameIndex <= 5) {

                let paddingX = 25;
                let paddingTop = 20;
                let paddingBottom = 12;

                let spikeHitbox = {
                    x: spike.x + paddingX,
                    y: spike.y + paddingTop,
                    width: spike.size - paddingX * 2,
                    height: spike.size - paddingTop - paddingBottom
                };

                if (isColliding(player, spikeHitbox)) {

                    playerHitSound.currentTime = 0;
                    playerHitSound.play();

                    player.x = 291;
                    player.y = 565;
                    velocityY = 0;

                    return;
                }
            }
        }
    }


    // level 9 spider movement

    if (currentLevel === 8 && level9Spider) {

    // movement
    if (currentLevel === 8 && level9Spider) {

        if (level9Spider.direction === "down") {

            level9Spider.y += level9Spider.speed * deltaTime;

            if (level9Spider.y >= level9Spider.endY) {
                level9Spider.y = level9Spider.endY;
                level9Spider.direction = "up";

                level9Spider.speed = Math.floor(Math.random() * 5) + 4;
            }

        } else {

            level9Spider.y -= level9Spider.speed * deltaTime;

            if (level9Spider.y <= level9Spider.startY) {
                level9Spider.y = level9Spider.startY;
                level9Spider.direction = "down";

                level9Spider.speed = Math.floor(Math.random() * 5) + 4;
            }
        }
    }

        // animate blue spider
        if (currentLevel === 8 && level9Spider) {

            blueSpiderFrameCounter++;

            if (blueSpiderFrameCounter >= blueSpiderFrameDelay) {
                blueSpiderFrameCounter = 0;
                blueSpiderFrameIndex++;

                if (blueSpiderFrameIndex >= blueSpiderFrames.length) {
                    blueSpiderFrameIndex = 0;
                }
            }
        }

        // level 9 spider collision
        if (currentLevel === 8 && level9Spider) {

            // smaller hitbox for player
            const playerHitbox = {
                x: player.x + 15,
                y: player.y + 15,
                size: player.size - 30
            };

            // smaller hitbox for spider
            const spiderHitbox = {
                x: level9Spider.x + 20,
                y: level9Spider.y + 20,
                size: level9Spider.size - 40
            };

            if (isColliding(playerHitbox, spiderHitbox)) {

                // play hit sound
                playerHitSound.currentTime = 0;
                playerHitSound.play();

                // respawn player
                player.x = 236;
                player.y = 540;
                velocityY = 0;

                return;
            }
        }
    }

    // level 9 bat movement
    if (currentLevel === 8 && batOneLvl9) {

        if (batOneLvl9.direction === "down") {

            batOneLvl9.y += batOneLvl9.speed * deltaTime;

            if (batOneLvl9.y >= batOneLvl9.endY) {
                batOneLvl9.y = batOneLvl9.endY;
                batOneLvl9.direction = "up";

                batOneLvl9.speed = Math.floor(Math.random() * 6) + 9;
            }

        } else {

            batOneLvl9.y -= batOneLvl9.speed * deltaTime;

            if (batOneLvl9.y <= batOneLvl9.startY) {
                batOneLvl9.y = batOneLvl9.startY;
                batOneLvl9.direction = "down";

                batOneLvl9.speed = Math.floor(Math.random() * 6) + 9;
            }
        }
    }

    // animate level 9 bat
    if (currentLevel === 8 && batOneLvl9) {

        batOneLvl9FrameCounter++;

        if (batOneLvl9FrameCounter >= batOneLvl9FrameDelay) {
            batOneLvl9FrameCounter = 0;
            batOneLvl9FrameIndex++;

            if (batOneLvl9FrameIndex >= batOneLvl9Frames.length) {
                batOneLvl9FrameIndex = 0;
            }
        }
    }

    // level 9 bat collision
    if (currentLevel === 8 && batOneLvl9) {

        const playerHitbox = {
            x: player.x + 15,
            y: player.y + 15,
            size: player.size - 30
        };

        const batHitbox = {
            x: batOneLvl9.x + 20,
            y: batOneLvl9.y + 20,
            size: batOneLvl9.size - 40
        };

        if (isColliding(playerHitbox, batHitbox)) {

            playerHitSound.currentTime = 0;
            playerHitSound.play();

            player.x = 236;
            player.y = 540;
            velocityY = 0;

            return;
        }
    }

    // level 9 green spider movement
    if (currentLevel === 8 && greenSpiderLvl9) {

        if (greenSpiderLvl9.direction === "down") {

            greenSpiderLvl9.y += greenSpiderLvl9.speed * deltaTime;

            if (greenSpiderLvl9.y >= greenSpiderLvl9.endY) {
                greenSpiderLvl9.y = greenSpiderLvl9.endY;
                greenSpiderLvl9.direction = "up";

                greenSpiderLvl9.speed = Math.floor(Math.random() * 5) + 9;
            }

        } else {

            greenSpiderLvl9.y -= greenSpiderLvl9.speed * deltaTime;

            if (greenSpiderLvl9.y <= greenSpiderLvl9.startY) {
                greenSpiderLvl9.y = greenSpiderLvl9.startY;
                greenSpiderLvl9.direction = "down";

                greenSpiderLvl9.speed = Math.floor(Math.random() * 5) + 9;
            }
        }
    }

    // animate green spider
    if (currentLevel === 8 && greenSpiderLvl9) {

        greenSpiderFrameCounter++;

        if (greenSpiderFrameCounter >= greenSpiderFrameDelay) {
            greenSpiderFrameCounter = 0;
            greenSpiderFrameIndex++;

            if (greenSpiderFrameIndex >= greenSpiderFrames.length) {
                greenSpiderFrameIndex = 0;
            }
        }
    }

    // level 9 green spider collision
    if (currentLevel === 8 && greenSpiderLvl9) {

        // smaller hitbox for player
        const playerHitbox = {
            x: player.x + 15,
            y: player.y + 15,
            size: player.size - 30
        };

        // smaller hitbox for spider
        const spiderHitbox = {
            x: greenSpiderLvl9.x + 20,
            y: greenSpiderLvl9.y + 20,
            size: greenSpiderLvl9.size - 40
        };

        if (isColliding(playerHitbox, spiderHitbox)) {

            playerHitSound.currentTime = 0;
            playerHitSound.play();

            player.x = 236;
            player.y = 540;
            velocityY = 0;

            return;
        }
    }

    // level 9 green bat movement
    if (currentLevel === 8 && greenBatLvl9) {

        if (greenBatLvl9.direction === "down") {

            greenBatLvl9.y += greenBatLvl9.speed * deltaTime;

            if (greenBatLvl9.y >= greenBatLvl9.endY) {
                greenBatLvl9.y = greenBatLvl9.endY;
                greenBatLvl9.direction = "up";

                greenBatLvl9.speed = Math.floor(Math.random() * 5) + 8;
            }

        } else {

            greenBatLvl9.y -= greenBatLvl9.speed * deltaTime;

            if (greenBatLvl9.y <= greenBatLvl9.startY) {
                greenBatLvl9.y = greenBatLvl9.startY;
                greenBatLvl9.direction = "down";

                greenBatLvl9.speed = Math.floor(Math.random() * 5) + 8;
            }
        }
    }

    // animate green bat
    if (currentLevel === 8 && greenBatLvl9) {

        greenBatFrameCounter++;

        if (greenBatFrameCounter >= greenBatFrameDelay) {
            greenBatFrameCounter = 0;
            greenBatFrameIndex++;

            if (greenBatFrameIndex >= greenBatFrames.length) {
                greenBatFrameIndex = 0;
            }
        }
    }

    // level 9 green bat collision
    if (currentLevel === 8 && greenBatLvl9) {

        const playerHitbox = {
            x: player.x + 15,
            y: player.y + 15,
            size: player.size - 30
        };

        const batHitbox = {
            x: greenBatLvl9.x + 20,
            y: greenBatLvl9.y + 20,
            size: greenBatLvl9.size - 40
        };

        if (isColliding(playerHitbox, batHitbox)) {

            playerHitSound.currentTime = 0;
            playerHitSound.play();

            player.x = 236;
            player.y = 540;
            velocityY = 0;

            return;
        }
    }

    // level 9 purple spider movement
    if (currentLevel === 8 && purpleSpiderLvl9) {

        if (purpleSpiderLvl9.direction === "down") {

            purpleSpiderLvl9.y += purpleSpiderLvl9.speed * deltaTime;

            if (purpleSpiderLvl9.y >= purpleSpiderLvl9.endY) {
                purpleSpiderLvl9.y = purpleSpiderLvl9.endY;
                purpleSpiderLvl9.direction = "up";

                purpleSpiderLvl9.speed = Math.floor(Math.random() * 5) + 4;
            }

        } else {

            purpleSpiderLvl9.y -= purpleSpiderLvl9.speed * deltaTime;

            if (purpleSpiderLvl9.y <= purpleSpiderLvl9.startY) {
                purpleSpiderLvl9.y = purpleSpiderLvl9.startY;
                purpleSpiderLvl9.direction = "down";

                purpleSpiderLvl9.speed = Math.floor(Math.random() * 5) + 4;
            }
        }
    }

    // animate purple spider
    if (currentLevel === 8 && purpleSpiderLvl9) {

        purpleSpiderFrameCounter++;

        if (purpleSpiderFrameCounter >= purpleSpiderFrameDelay) {
            purpleSpiderFrameCounter = 0;
            purpleSpiderFrameIndex++;

            if (purpleSpiderFrameIndex >= purpleSpiderFrames.length) {
                purpleSpiderFrameIndex = 0;
            }
        }
    }

    // level 9 purple spider collision
    if (currentLevel === 8 && purpleSpiderLvl9) {

        const playerHitbox = {
            x: player.x + 15,
            y: player.y + 15,
            size: player.size - 30
        };

        const spiderHitbox = {
            x: purpleSpiderLvl9.x + 20,
            y: purpleSpiderLvl9.y + 20,
            size: purpleSpiderLvl9.size - 40
        };

        if (isColliding(playerHitbox, spiderHitbox)) {

            playerHitSound.currentTime = 0;
            playerHitSound.play();

            player.x = 236;
            player.y = 540;
            velocityY = 0;

            return;
        }
    }

    // orange fish movement lvl 10
    if (currentLevel === 9 && orangeFish) {

        // move left and right
        if (orangeFish.direction === "right") {
            orangeFish.x += orangeFish.speed * deltaTime;
        } else {
            orangeFish.x -= orangeFish.speed * deltaTime;
        }

        // turn around
        if (orangeFish.x >= orangeFish.endX) {
            orangeFish.direction = "left";
        }

        if (orangeFish.x <= orangeFish.startX) {
            orangeFish.direction = "right";
        }

        // up down motion
        orangeFish.waveOffset += 0.1 * deltaTime;

        orangeFish.y = orangeFish.baseY + Math.sin(orangeFish.waveOffset) * 10;
    }

    // fish animation
    if (currentLevel === 9 && orangeFish) {

        orangeFishFrameCounter++;

        if (orangeFishFrameCounter >= orangeFishFrameDelay) {
            orangeFishFrameCounter = 0;
            orangeFishFrameIndex++;

            if (orangeFishFrameIndex >= orangeFishFrames.length) {
                orangeFishFrameIndex = 0;
            }
        }
    }

    // pink fish movement
    if (currentLevel === 9 && pinkFish) {

        if (pinkFish.direction === "right") {
            pinkFish.x += pinkFish.speed * deltaTime;
        } else {
            pinkFish.x -= pinkFish.speed * deltaTime;
        }

        if (pinkFish.x >= pinkFish.endX) {
            pinkFish.direction = "left";
        }

        if (pinkFish.x <= pinkFish.startX) {
            pinkFish.direction = "right";
        }

        // bob up and down motion
        pinkFish.waveOffset += 0.1 * deltaTime;

        pinkFish.y = pinkFish.baseY + Math.sin(pinkFish.waveOffset) * 10;
    }

    // pink fish 2 movement
    if (currentLevel === 9 && pinkFish2) {

        if (pinkFish2.direction === "right") {
            pinkFish2.x += pinkFish2.speed * deltaTime;
        } else {
            pinkFish2.x -= pinkFish2.speed * deltaTime;
        }

        if (pinkFish2.x >= pinkFish2.endX) {
            pinkFish2.direction = "left";
        }

        if (pinkFish2.x <= pinkFish2.startX) {
            pinkFish2.direction = "right";
        }

        // bob motion
        pinkFish2.waveOffset += 0.1 * deltaTime;

        pinkFish2.y = pinkFish2.baseY + Math.sin(pinkFish2.waveOffset) * 10;
    }

    // pink fish animation
    if (currentLevel === 9 && pinkFish) {

        pinkFishFrameCounter++;

        if (pinkFishFrameCounter >= pinkFishFrameDelay) {
            pinkFishFrameCounter = 0;
            pinkFishFrameIndex++;

            if (pinkFishFrameIndex >= pinkFishFrames.length) {
                pinkFishFrameIndex = 0;
            }
        }
    }

    // pink fish 2 animation
    if (currentLevel === 9 && pinkFish2) {

        pinkFishFrameCounter++;

        if (pinkFishFrameCounter >= pinkFishFrameDelay) {
            pinkFishFrameCounter = 0;
            pinkFishFrameIndex++;

            if (pinkFishFrameIndex >= pinkFishFrames.length) {
                pinkFishFrameIndex = 0;
            }
        }
    }

    // blue jellyfish movement
    if (currentLevel === 9 && blueJellyfish) {

        // move up and down
        if (blueJellyfish.direction === "up") {
            blueJellyfish.y -= blueJellyfish.speed * deltaTime;

            if (blueJellyfish.y <= blueJellyfish.endY) {
                blueJellyfish.direction = "down";
            }

        } else {
            blueJellyfish.y += blueJellyfish.speed * deltaTime;

            if (blueJellyfish.y >= blueJellyfish.startY) {
                blueJellyfish.direction = "up";
            }
        }

        // side-to-side float 
        blueJellyfish.waveOffset += 0.08 * deltaTime;

        blueJellyfish.x =
            blueJellyfish.baseX + Math.sin(blueJellyfish.waveOffset) * 5;
    }

    // blue jellyfish animation
    if (currentLevel === 9 && blueJellyfish) {

        blueJellyfishFrameCounter++;

        if (blueJellyfishFrameCounter >= blueJellyfishFrameDelay) {
            blueJellyfishFrameCounter = 0;
            blueJellyfishFrameIndex++;

            if (blueJellyfishFrameIndex >= blueJellyfishFrames.length) {
                blueJellyfishFrameIndex = 0;
            }
        }
    }

    /*
    // green fish movement
    if (currentLevel === 9 && greenFish) {

        if (greenFish.direction === "right") {
            greenFish.x += greenFish.speed * deltaTime;
        } else {
            greenFish.x -= greenFish.speed * deltaTime;
        }

        if (greenFish.x >= greenFish.endX) {
            greenFish.direction = "left";
        }

        if (greenFish.x <= greenFish.startX) {
            greenFish.direction = "right";
        }

        // bob motion
        greenFish.waveOffset += 0.1 * deltaTime;

        greenFish.y =
            greenFish.baseY + Math.sin(greenFish.waveOffset) * 10;
    }

    // green fish animation
    if (currentLevel === 9 && greenFish) {

        greenFishFrameCounter++;

        if (greenFishFrameCounter >= greenFishFrameDelay) {
            greenFishFrameCounter = 0;
            greenFishFrameIndex++;

            if (greenFishFrameIndex >= greenFishFrames.length) {
                greenFishFrameIndex = 0;
            }
        }
    }

    */

    // pink jellyfish movement
    if (currentLevel === 9 && pinkJellyfish) {

        // move up and down
        if (pinkJellyfish.direction === "up") {
            pinkJellyfish.y -= pinkJellyfish.speed * deltaTime;

            if (pinkJellyfish.y <= pinkJellyfish.endY) {
                pinkJellyfish.direction = "down";
            }

        } else {
            pinkJellyfish.y += pinkJellyfish.speed * deltaTime;

            if (pinkJellyfish.y >= pinkJellyfish.startY) {
                pinkJellyfish.direction = "up";
            }
        }

        // side to side float
        pinkJellyfish.waveOffset += 0.08 * deltaTime;

        pinkJellyfish.x =
            pinkJellyfish.baseX + Math.sin(pinkJellyfish.waveOffset) * 5;
    }

    // pink jellyfish animation
    if (currentLevel === 9 && pinkJellyfish) {

        pinkJellyfishFrameCounter++;

        if (pinkJellyfishFrameCounter >= pinkJellyfishFrameDelay) {
            pinkJellyfishFrameCounter = 0;
            pinkJellyfishFrameIndex++;

            if (pinkJellyfishFrameIndex >= pinkJellyfishFrames.length) {
                pinkJellyfishFrameIndex = 0;
            }
        }
    }
    // octopus animation
    if (currentLevel === 9 && octopus) {

        octopusFrameCounter++;

        if (octopusFrameCounter >= octopusFrameDelay) {
            octopusFrameCounter = 0;
            octopusFrameIndex++;

            if (octopusFrameIndex >= octopusFrames.length) {
                octopusFrameIndex = 0;
            }
        }
    }

    // octopus movement and attack
    if (currentLevel === 9 && octopus) {

        // octopus dies
        if (octopusHealth <= 0) {
            octopus = null;
            return;
        }

        // increase timer
        if (!octopusPaused && octopusTargetX === 0 && octopusTargetY === 0) {
                octopusStopTimer++;
            }

        // every 5 seconds pause
        if (octopusStopTimer >= octopusStopDelay && !octopusPaused) {

            octopusPaused = true;
            octopusPauseTimer = 60; // 1 second

            // save player position
            octopusTargetX = player.x;
            octopusTargetY = player.y;

            octopusStopTimer = 0;
        }

        // if paused count down
        if (octopusPaused) {

            octopusPauseTimer--;

            if (octopusPauseTimer <= 0) {
                octopusPaused = false;
            }

        } else {

            // movement

            let targetX = player.x;
            let targetY = player.y;

            // if it just finished pausing go to saved position
            if (octopusTargetX !== 0 || octopusTargetY !== 0) {
                targetX = octopusTargetX;
                targetY = octopusTargetY;
            }

            let dx = targetX - octopus.x;
            let dy = targetY - octopus.y;

            let distance = Math.sqrt(dx * dx + dy * dy);

            let moveSpeed = octopus.speed;

            // if it has a saved target 
            if (octopusTargetX !== 0 || octopusTargetY !== 0) {
                moveSpeed = 10; // fast dash speed
            }

            if (distance > 1) {
                octopus.x += (dx / distance) * moveSpeed * deltaTime;
                octopus.y += (dy / distance) * moveSpeed * deltaTime;
            }

            // once it reaches saved position clear target
            if (Math.abs(octopus.x - octopusTargetX) < 5 &&
                Math.abs(octopus.y - octopusTargetY) < 5) {

                octopusTargetX = 0;
                octopusTargetY = 0;
            }
        }

        const playerHitbox = {
            x: player.x + 32,
            y: player.y + 35,
            size: player.size - 30
        };

        const octopusHitbox = {
            x: octopus.x + 55,
            y: octopus.y + 30,
            width: octopus.size - 100,
            height: octopus.size - 70
        };


        // collision with player
        if (isColliding(playerHitbox, octopusHitbox)) {

            playerHitSound.currentTime = 0;
            playerHitSound.play();

            health--;

            if (health <= 0) {
                currentLevel = 7;
                loadLevel(currentLevel);
                octopusHealth = 150;

                playerDeathSound.currentTime = 0;
                playerDeathSound.play();

                return;
            }

            // reset player
            player.x = 190;
            player.y = 540;

            // reset octopus
            octopus.x = 1560;
            octopus.y = 550;

            octopusTargetX = 0;
            octopusTargetY = 0;
            octopusPaused = false;

            return;
        }
    }

    // water shoot movement and animation
    if (currentLevel === 9 && waterShoot) {

        // movement
        if (waterShoot.direction === "right") {
            waterShoot.x += waterShoot.speed * deltaTime;
        } else {
            waterShoot.x -= waterShoot.speed * deltaTime;
        }

        // animation
        waterShootFrameCounter++;

        if (waterShootFrameCounter >= waterShootFrameDelay) {
            waterShootFrameCounter = 0;
            waterShootFrameIndex++;

            if (waterShootFrameIndex >= waterShootFrames.length) {
                waterShootFrameIndex = 0;
            }
        }

        // collision with walls
        for (let wall of walls) {
            if (isColliding(waterShoot, wall)) {
                waterShoot = null;
                break;
            }
        }
    }

    // lvl 10 collisions for all fish and jellyfish
    if (currentLevel === 9) {

        // player hitbox
        const playerHitbox = {
            x: player.x + 25,
            y: player.y + 25,
            size: player.size - 40
        };

        // function to check enemy collision
        function checkFishCollision(enemy) {

            if (!enemy) return false;

            const enemyHitbox = {
                x: enemy.x + 20,
                y: enemy.y + 20,
                size: enemy.size - 40
            };

            if (isColliding(playerHitbox, enemyHitbox)) {

                playerHitSound.currentTime = 0;
                playerHitSound.play();

                health--; // lose life

                // if no lives left go to lvl 8
                if (health <= 0) {
                    currentLevel = 7;
                    loadLevel(currentLevel);
                    octopusHealth = 150;

                    playerDeathSound.currentTime = 0;
                    playerDeathSound.play();

                    return true;
                }

                // respawn player
                player.x = 190;
                player.y = 540;
                velocityY = 0;

                return true;
            }

            return false;
        }

        // check all enemies
        if (
            checkFishCollision(orangeFish) ||
            checkFishCollision(pinkFish) ||
            checkFishCollision(pinkFish2) ||
            /* checkFishCollision(greenFish) || */
            checkFishCollision(blueJellyfish) ||
            checkFishCollision(pinkJellyfish)
        ) {
            return;
        }
    }

        // level 10 water shoot system
    if (currentLevel === 9 && waterShoot) {

        // move water shoot
        if (waterShoot.direction === "right") {
            waterShoot.x += waterShoot.speed * deltaTime;
        } else {
            waterShoot.x -= waterShoot.speed * deltaTime;
        }

        // better collision
        if (octopus) {

            const shootHitbox = {
                x: waterShoot.x + 15,
                y: waterShoot.y + 15,
                size: waterShoot.size - 30
            };

            const octopusHitbox = {
                x: octopus.x + 40,
                y: octopus.y + 20,          
                width: octopus.size - 80,
                height: octopus.size - 40   
            };

            if (isColliding(shootHitbox, octopusHitbox)) {

                octopusHealth -= 10;

                if (octopusHealth < 0) {
                    octopusHealth = 0;
                }

                // remove projectile after hit
                waterShoot = null;

                enemyHitSound.currentTime = 0;
                enemyHitSound.play();
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

    // swimming animation lvl 10
    if (currentLevel === 9) {

        swimFrameCounter++;

        if (swimFrameCounter >= swimFrameDelay) {
            swimFrameCounter = 0;
            swimFrameIndex++;

            if (swimFrameIndex >= swimFrames.length) {
                swimFrameIndex = 0;
            }
        }
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

    // crown collection lvl 10
    if (currentLevel === 9 && octopusHealth <= 0 && crown && !crown.collected) {

        const playerHitbox = {
            x: player.x + 15,
            y: player.y + 15,
            size: player.size - 30
        };

        const crownPadding = 25;

        const crownHitbox = {
            x: crown.x + crownPadding,
            y: crown.y + crownPadding,
            size: crown.size - crownPadding * 2
        };

        if (isColliding(playerHitbox, crownHitbox)) {

            crown.collected = true;

            console.log("Crown collected!");

            keyPickupSound.currentTime = 0;
            keyPickupSound.play();
        }
    }

    // animate bubbles lvl 10
    if (currentLevel === 9 && octopusHealth <= 0) {

        bubbleFrameCounter++;

        if (bubbleFrameCounter >= bubbleFrameDelay) {
            bubbleFrameCounter = 0;
            bubbleFrameIndex++;

            if (bubbleFrameIndex >= bubbleFrames.length) {
                bubbleFrameIndex = 0;
            }
        }
}

    // animate seaweed level 10
    if (currentLevel === 9) {

        seaweedFrameCounter++;

        if (seaweedFrameCounter >= seaweedFrameDelay) {
            seaweedFrameCounter = 0;
            seaweedFrameIndex++;

            if (seaweedFrameIndex >= seaweedFrames.length) {
                seaweedFrameIndex = 0;
            }
        }
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

            levelCompleteSound.currentTime = 0;
            levelCompleteSound.play();

            // go to next level
            currentLevel++;
            loadLevel(currentLevel);
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
            (currentLevel === 6 && bossScore >= 150) ||

            //level 8 wall auto exit
            (currentLevel === 7) ||

            // level 9 wall auto exit
            (currentLevel === 8) ||

            // level 10 needs crown
            (currentLevel === 9 && crown && crown.collected)


        )
    ) 
    {
        levelCompleteSound.currentTime = 0;
        levelCompleteSound.play();

        // lvl 10 ending
        if (currentLevel === 9) {

            showEnding = true;
            endGameSplashes();

        } else {

            // normal level progression
            currentLevel++;

            if (currentLevel < levels.length) {
                loadLevel(currentLevel);
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

    // falling boss arrows level 8
    if (currentLevel === 7) {

        // check traps and spawn arrows
        for (let trap of fallingArrowTraps) {

            let playerCenterX = player.x + player.size / 2;
            let trapCenterX = trap.x + trap.width / 2;

            let triggerDistance = 35;

            let inRange = Math.abs(playerCenterX - trapCenterX) <= triggerDistance;

            // player entered trigger
            if (inRange && !trap.playerInRange) {

                fallingBossArrows.push({
                    x: trap.x,
                    y: trap.y,
                    width: trap.width,
                    height: trap.height,
                    speed: trap.speed,
                    shooting: true,
                    playerInRange: false
                });

            }

            trap.playerInRange = inRange;
        }

        for (let i = 0; i < fallingBossArrows.length; i++) {

            let arrow = fallingBossArrows[i];

            if (!arrow) continue;

            // player centre
            let playerCenterX = player.x + player.size / 2;

            let arrowCenterX = arrow.x + arrow.width / 2;

            // trigger distance from arrow 
            let triggerDistance = 35;

            let inRange = Math.abs(playerCenterX - arrowCenterX) <= triggerDistance;

            // player entered the range
            if (inRange && !arrow.playerInRange) {
                arrow.shooting = true;
            }

            // update range state 
            arrow.playerInRange = inRange;

            // move arrow only after triggered
            if (arrow.shooting) {
                arrow.y += arrow.speed * deltaTime;
            }

            // smaller hitbox
            const arrowHitbox = {
                x: arrow.x + 12,
                y: arrow.y + 4,
                width: arrow.width - 24,
                height: arrow.height - 8
            };

            // hit player
            if (isColliding(player, arrowHitbox)) {

                playerHitSound.currentTime = 0;
                playerHitSound.play();

                // reset arrow
                arrow.y = 216;
                arrow.shooting = false;
                arrow.playerInRange = false;

                // respawn player
                player.x = 291;
                player.y = 565;
                velocityY = 0;
            }

            // hit wall reset arrow
            for (let wall of walls) {

                if (arrow && isColliding(arrowHitbox, wall)) {

                    arrow.y = 216;
                    arrow.shooting = false;
                    arrow.playerInRange = false;

                    break;
                }

            }

        }

    }



    // red bat movement level 8
    if (redBat && currentLevel === 7) {

        if (redBat.direction === "right") {
            redBat.x += redBat.speed * deltaTime;
        } else {
            redBat.x -= redBat.speed * deltaTime;
        }

        // turn around
        if (redBat.x >= redBat.endX) {
            redBat.direction = "left";
        }

        if (redBat.x <= redBat.startX) {
            redBat.direction = "right";
        }

        // animation
        redBatFrameCounter++;

        if (redBatFrameCounter >= redBatFrameDelay) {
            redBatFrameCounter = 0;
            redBatFrameIndex++;

            if (redBatFrameIndex >= redBatFrames.length) {
                redBatFrameIndex = 0;
            }
        }
    }

    // red bat collision level 8
    if (redBat && currentLevel === 7) {

        const playerHitbox = {
            x: player.x + 15,
            y: player.y + 15,
            size: player.size - 30
        };

        const batHitbox = {
            x: redBat.x + 20,
            y: redBat.y + 20,
            size: redBat.size - 40
        };

        if (isColliding(playerHitbox, batHitbox)) {

            playerHitSound.currentTime = 0;
            playerHitSound.play();

            // respawn player
            player.x = 291;
            player.y = 565;
            velocityY = 0;

            return; 
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
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;

    for (let wall of walls) {

        let w = wall.width;
        let h = wall.height;

        if (w === undefined) w = wall.size;
        if (h === undefined) h = wall.size;

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
    
    //draw lava traps level 8
    if (currentLevel === 7) {

        for (let trap of lavaTraps) {

            let frame =
                lavaTrapFrames[
                    (lavaTrapFrameIndex + trap.frameOffset) % lavaTrapFrames.length
                ];

            ctx.drawImage(
                frame,
                trap.x,
                trap.y,
                trap.size,
                trap.size
            );

        }

    }

    // draw big spikes level 8
    if (currentLevel === 7) {

        for (let spike of bigSpikes) {

            let frame =
                bigSpikeFrames[
                    (bigSpikeFrameIndex + spike.frameOffset) % bigSpikeFrames.length
                ];

            ctx.drawImage(
                frame,
                spike.x,
                spike.y,
                spike.size,
                spike.size
            );

        }

    }

    // draw small spikes level 8
    if (currentLevel === 7) {

        for (let spike of smallSpikes) {

            let frame =
                smallSpikeFrames[
                    (smallSpikeFrameIndex + spike.frameOffset) % smallSpikeFrames.length
                ];

            ctx.drawImage(
                frame,
                spike.x,
                spike.y,
                spike.size,
                spike.size
            );

        }

    }

    // draw boss arrow
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


    // draw falling arrows level 8
    if (currentLevel === 7) {

        for (let arrow of fallingBossArrows) {

            if (!arrow) continue;
            if (!arrow.shooting) continue;

            ctx.save();

            ctx.translate(
                arrow.x + arrow.width / 2,
                arrow.y + arrow.height / 2
            );

            // rotate arrow so it faces down
            ctx.rotate(Math.PI / 2);

            ctx.drawImage(
                bossArrowSprite,
                -arrow.width / 2,
                -arrow.height / 2,
                arrow.width,
                arrow.height
            );

            ctx.restore();

            // debug hitbox
            if (debugMode) {

                ctx.strokeStyle = "yellow";

                ctx.strokeRect(
                    arrow.x + 12,
                    arrow.y + 8,
                    arrow.width - 24,
                    arrow.height - 16
                );

            }

        }

    }

        // draw red bat level 8
    if (
        redBat &&
        redBatFrames[redBatFrameIndex] &&
        redBatFrames[redBatFrameIndex].complete
    ) {

        ctx.save();

        if (redBat.direction === "left") {
            ctx.translate(redBat.x + redBat.size, redBat.y);
            ctx.scale(-1, 1);

            ctx.drawImage(
                redBatFrames[redBatFrameIndex],
                0,
                0,
                redBat.size,
                redBat.size
            );
        } else {
            ctx.drawImage(
                redBatFrames[redBatFrameIndex],
                redBat.x,
                redBat.y,
                redBat.size,
                redBat.size
            );
        }

        ctx.restore();
    }
 
    //hitbox for lava traps level 8
    if (debugMode && currentLevel === 7) {

    ctx.save();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "yellow";

    for (let trap of lavaTraps) {

        let padding = 20;

        ctx.strokeRect(
            trap.x + padding,
            trap.y + padding,
            trap.size - padding * 2,
            trap.size - padding * 2
        );
    }

        ctx.restore();
    }

    //hitbox for big spikes level 8
    if (debugMode && currentLevel === 7) {

    ctx.save();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "cyan";

    for (let spike of bigSpikes) {

        let paddingX = 30;
        let paddingTop = 25;
        let paddingBottom = 10;

        ctx.strokeRect(
            spike.x + paddingX,
            spike.y + paddingTop,
            spike.size - paddingX * 2,
            spike.size - paddingTop - paddingBottom
        );
    }

        ctx.restore();
    }

    //hitbox for small spikes level 8
        if (debugMode && currentLevel === 7) {

        ctx.save();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "lime";

        for (let spike of smallSpikes) {

            let paddingX = 25;
            let paddingTop = 20;
            let paddingBottom = 12;

            ctx.strokeRect(
            spike.x + paddingX,
            spike.y + paddingTop,
            spike.size - paddingX * 2,
            spike.size - paddingTop - paddingBottom
        );
        }

        ctx.restore();
    }

    if (
        currentLevel === 8 &&
        level9Spider &&
        blueSpiderFrames[blueSpiderFrameIndex] &&
        blueSpiderFrames[blueSpiderFrameIndex].complete
    ) {

        ctx.drawImage(
            blueSpiderFrames[blueSpiderFrameIndex],
            level9Spider.x,
            level9Spider.y,
            level9Spider.size,
            level9Spider.size
        );
    }

    if (
        currentLevel === 8 &&
        batOneLvl9 &&
        batOneLvl9Frames[batOneLvl9FrameIndex] &&
        batOneLvl9Frames[batOneLvl9FrameIndex].complete
    ) {
        ctx.drawImage(
            batOneLvl9Frames[batOneLvl9FrameIndex],
            batOneLvl9.x,
            batOneLvl9.y,
            batOneLvl9.size,
            batOneLvl9.size
        );
    }

    if (
        currentLevel === 8 &&
        greenSpiderLvl9 &&
        greenSpiderFrames[greenSpiderFrameIndex] &&
        greenSpiderFrames[greenSpiderFrameIndex].complete
    ) {
        ctx.drawImage(
            greenSpiderFrames[greenSpiderFrameIndex],
            greenSpiderLvl9.x,
            greenSpiderLvl9.y,
            greenSpiderLvl9.size,
            greenSpiderLvl9.size
        );
    }

    if (
        currentLevel === 8 &&
        greenBatLvl9 &&
        greenBatFrames[greenBatFrameIndex] &&
        greenBatFrames[greenBatFrameIndex].complete
    ) {
        ctx.drawImage(
            greenBatFrames[greenBatFrameIndex],
            greenBatLvl9.x,
            greenBatLvl9.y,
            greenBatLvl9.size,
            greenBatLvl9.size
        );
    }

    if (
        currentLevel === 8 &&
        purpleSpiderLvl9 &&
        purpleSpiderFrames[purpleSpiderFrameIndex] &&
        purpleSpiderFrames[purpleSpiderFrameIndex].complete
    ) {

        ctx.drawImage(
            purpleSpiderFrames[purpleSpiderFrameIndex],
            purpleSpiderLvl9.x,
            purpleSpiderLvl9.y,
            purpleSpiderLvl9.size,
            purpleSpiderLvl9.size
        );
    }

    // draw seaweed
    if (
        currentLevel === 9 &&
        seaweedFrames[seaweedFrameIndex] &&
        seaweedFrames[seaweedFrameIndex].complete
    ) {

        const img = seaweedFrames[seaweedFrameIndex];

        const scale = 0.6; // adjusted to fit properly

        const seaweedWidth = img.width * scale;
        const seaweedHeight = img.height * scale;

        const seaweedX = (GAME_WIDTH - seaweedWidth) / 2;
        const seaweedY = GAME_HEIGHT - seaweedHeight - 180;

        ctx.drawImage(
            img,
            seaweedX,
            seaweedY,
            seaweedWidth,
            seaweedHeight
        );
    }

    // draw orange fish level 10
    if (
        currentLevel === 9 &&
        orangeFish &&
        orangeFishFrames[orangeFishFrameIndex] &&
        orangeFishFrames[orangeFishFrameIndex].complete
    ) {

        ctx.save();

        if (orangeFish.direction === "left") {

            ctx.translate(orangeFish.x + orangeFish.size, orangeFish.y);
            ctx.scale(-1, 1);

            ctx.drawImage(
                orangeFishFrames[orangeFishFrameIndex],
                0,
                0,
                orangeFish.size,
                orangeFish.size
            );

        } else {

            ctx.drawImage(
                orangeFishFrames[orangeFishFrameIndex],
                orangeFish.x,
                orangeFish.y,
                orangeFish.size,
                orangeFish.size
            );
        }

        ctx.restore();
    }

    // draw pink fish level 10
    if (
        currentLevel === 9 &&
        pinkFish &&
        pinkFishFrames[pinkFishFrameIndex] &&
        pinkFishFrames[pinkFishFrameIndex].complete
    ) {

        ctx.save();

        if (pinkFish.direction === "left") {

            ctx.translate(pinkFish.x + pinkFish.size, pinkFish.y);
            ctx.scale(-1, 1);

            ctx.drawImage(
                pinkFishFrames[pinkFishFrameIndex],
                0,
                0,
                pinkFish.size,
                pinkFish.size
            );

        } else {

            ctx.drawImage(
                pinkFishFrames[pinkFishFrameIndex],
                pinkFish.x,
                pinkFish.y,
                pinkFish.size,
                pinkFish.size
            );
        }

        ctx.restore();
    }

    // draw pink fish 2 level 10
    if (
        currentLevel === 9 &&
        pinkFish2 &&
        pinkFishFrames[pinkFishFrameIndex] &&
        pinkFishFrames[pinkFishFrameIndex].complete
    ) {

        ctx.save();

        if (pinkFish2.direction === "left") {

            ctx.translate(pinkFish2.x + pinkFish2.size, pinkFish2.y);
            ctx.scale(-1, 1);

            ctx.drawImage(
                pinkFishFrames[pinkFishFrameIndex],
                0,
                0,
                pinkFish2.size,
                pinkFish2.size
            );

        } else {

            ctx.drawImage(
                pinkFishFrames[pinkFishFrameIndex],
                pinkFish2.x,
                pinkFish2.y,
                pinkFish2.size,
                pinkFish2.size
            );
        }

        ctx.restore();
    }

    // draw blue jellyfish level 10
    if (
        currentLevel === 9 &&
        blueJellyfish &&
        blueJellyfishFrames[blueJellyfishFrameIndex] &&
        blueJellyfishFrames[blueJellyfishFrameIndex].complete
    ) {

        ctx.drawImage(
            blueJellyfishFrames[blueJellyfishFrameIndex],
            blueJellyfish.x,
            blueJellyfish.y,
            blueJellyfish.size,
            blueJellyfish.size
        );
    }

    /*
    // draw green fish level 10
    if (
        currentLevel === 9 &&
        greenFish &&
        greenFishFrames[greenFishFrameIndex] &&
        greenFishFrames[greenFishFrameIndex].complete
    ) {

        ctx.save();

        if (greenFish.direction === "left") {

            ctx.translate(greenFish.x + greenFish.size, greenFish.y);
            ctx.scale(-1, 1);

            ctx.drawImage(
                greenFishFrames[greenFishFrameIndex],
                0,
                0,
                greenFish.size,
                greenFish.size
            );

        } else {

            ctx.drawImage(
                greenFishFrames[greenFishFrameIndex],
                greenFish.x,
                greenFish.y,
                greenFish.size,
                greenFish.size
            );
        }

        ctx.restore();
    }
    */

    // draw pink jellyfish level 10
    if (
        currentLevel === 9 &&
        pinkJellyfish &&
        pinkJellyfishFrames[pinkJellyfishFrameIndex] &&
        pinkJellyfishFrames[pinkJellyfishFrameIndex].complete
    ) {

        ctx.drawImage(
            pinkJellyfishFrames[pinkJellyfishFrameIndex],
            pinkJellyfish.x,
            pinkJellyfish.y,
            pinkJellyfish.size,
            pinkJellyfish.size
        );
    }

    // draw crown level 10
    if (
        currentLevel === 9 &&
        octopusHealth <= 0 &&
        crown &&
        !crown.collected &&
        crownSprite.complete
    ) {
        ctx.drawImage(
            crownSprite,
            crown.x,
            crown.y,
            crown.size,
            crown.size
        );
    }

    // draw bubbles
    if (
        currentLevel === 9 &&
        crown &&
        !crown.collected &&
        bubbleFrames[bubbleFrameIndex] &&
        bubbleFrames[bubbleFrameIndex].complete
    ) {

        const bubbleSize = 60;

        if (currentLevel === 9 && octopusHealth <= 0) {

            ctx.drawImage(
                bubbleFrames[bubbleFrameIndex],
                1628,
                760,
                bubbleSize,
                bubbleSize
            );
    }
}

    // draw octopus level 10
    if (currentLevel === 9 && octopus) {
        ctx.drawImage(
            octopusFrames[octopusFrameIndex],
            octopus.x,
            octopus.y,
            octopus.size,
            octopus.size
        );
    }

    // draw water shoot level 10
    if (currentLevel === 9 && waterShoot) {
        ctx.drawImage(
            waterShootFrames[waterShootFrameIndex],
            waterShoot.x,
            waterShoot.y,
            waterShoot.size,
            waterShoot.size
        );
    }

    // draw health and boss health bar level 10
    if (currentLevel === 9) {

        // draw hearts
        for (let i = 0; i < health; i++) {
            ctx.drawImage(heartSprite, 140 + (i * 60), 100, 70, 70);
        }

        // draw boss health bar
        let barWidth = 600;
        let barHeight = 30;

        let x = (GAME_WIDTH / 2) - (barWidth / 2);
        let y = 130;

        ctx.fillStyle = "black";
        ctx.fillRect(x, y, barWidth, barHeight);

        let currentWidth = (octopusHealth / octopusMaxHealth) * barWidth;

        ctx.fillStyle = "red";
        ctx.fillRect(x, y, currentWidth, barHeight);

        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Octopus: " + octopusHealth + " / " + octopusMaxHealth, x + 180, y + 22);
    }

        // draw player
        if (currentLevel === 9) {

        const swimImage = swimFrames[swimFrameIndex];
        const swimScale = 1.5;

        if (swimImage && swimImage.complete) {

            ctx.save();

            const drawSize = player.size * swimScale;

            // flip if moving left
            if (player.direction === "left") {
                ctx.translate(player.x + drawSize, player.y);
                ctx.scale(-1, 1);

                ctx.drawImage(
                    swimImage,
                    0,
                    0,
                    drawSize,
                    drawSize
                );
            } 
            else {
                ctx.drawImage(
                    swimImage,
                    player.x,
                    player.y,
                    drawSize,
                    drawSize
                );
            }

            ctx.restore();
        }

    } else {

        // normal player animations
        const sprite = sprites[player.direction];
        const frameWidth = sprite.width / (player.maxFrame + 1);
        const frameHeight = sprite.height;

        ctx.drawImage(
            sprite,
            player.frameX * frameWidth, 0, frameWidth, frameHeight,
            player.x, player.y, player.size, player.size
        );
    }

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

    }, 50); // scroll fade in time

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
