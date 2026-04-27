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
    speed: 6, // 6 is default, adjusted for testing
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

let levelSkipEnabled = false; // enable/disable level skipping

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
let bossIsSlamming = false;

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

let standingOnPlatform = false;

let isDragging = false;
let dragStart = { x: 0, y: 0 };
let currentDrag = null; 
let debugMode = false;
