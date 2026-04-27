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
