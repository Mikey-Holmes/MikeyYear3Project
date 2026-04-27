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
