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

// wait for all assets to load
window.addEventListener("load", function() {
    requestAnimationFrame(gameLoop);
});