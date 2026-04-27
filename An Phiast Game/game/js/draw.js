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
