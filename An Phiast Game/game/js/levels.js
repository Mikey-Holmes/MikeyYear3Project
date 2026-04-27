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
        hintBox.textContent = "Watch out for the sea creatures, defeat the octopus by shooting water vortices, collect the crown and swim to the top to escape!";
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
        key.spawned = false; // key won't appear until score >= 50
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
