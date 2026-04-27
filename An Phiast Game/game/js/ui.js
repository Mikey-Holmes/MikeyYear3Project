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

    // click scroll to skip
    document.getElementById("scrollIntro").addEventListener("click", function() {
        startGame();
    });

    // wait then start game
    setTimeout(function(){
        startGame();
    }, 15000); // scroll time is 15 seconds adjusted for testing

    function startGame() {

        document.getElementById("scrollIntro").classList.add("hidden");

        if (gameState === "playing") return; // prevent running twice if clicked

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
    }

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