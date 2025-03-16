const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

const box = 20; // Size of each block
let snake = [{ x: 200, y: 200 }]; // Initial snake position
let direction = null; // Wait until the player presses a key
let egg = getRandomEggPosition();
let gameOver = false;
let speed; // Speed of the game

// Start game when a difficulty is selected
function startGame(difficulty) {
    if (difficulty === "easy") {
        speed = 150; // Slow
    } else if (difficulty === "medium") {
        speed = 100; // Normal
    } else if (difficulty === "hard") {
        speed = 60; // Fast
    }

    document.getElementById("difficulty").style.display = "none"; // Hide buttons
    canvas.style.display = "block"; // Show canvas
    gameLoop();
}

// Generate a random position for the egg
function getRandomEggPosition() {
    let position;
    let isOnSnake;
    
    do {
        position = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box
        };
        isOnSnake = snake.some(segment => segment.x === position.x && segment.y === position.y);
    } while (isOnSnake); // Ensure the egg is not placed on the snake

    return position;
}

// Listen for keyboard inputs (WASD + Arrow Keys)
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const key = event.key.toLowerCase();

    if ((key === "arrowup" || key === "w") && direction !== "DOWN") {
        direction = "UP";
    } else if ((key === "arrowdown" || key === "s") && direction !== "UP") {
        direction = "DOWN";
    } else if ((key === "arrowleft" || key === "a") && direction !== "RIGHT") {
        direction = "LEFT";
    } else if ((key === "arrowright" || key === "d") && direction !== "LEFT") {
        direction = "RIGHT";
    }
}

// Update the game state
function update() {
    if (gameOver || direction === null) return; // Wait until the player presses a key

    let newHead = { ...snake[0] };

    if (direction === "UP") newHead.y -= box;
    if (direction === "DOWN") newHead.y += box;
    if (direction === "LEFT") newHead.x -= box;
    if (direction === "RIGHT") newHead.x += box;

    // Check if snake collides with walls
    if (newHead.x < 0 || newHead.x >= canvas.width || newHead.y < 0 || newHead.y >= canvas.height) {
        gameOver = true;
    }

    // Check if snake collides with itself
    for (let i = 1; i < snake.length; i++) {
        if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
            gameOver = true;
        }
    }

    if (gameOver) {
        alert("Game Over! Press OK to restart.");
        document.location.reload();
        return;
    }

    // Check if snake eats the egg
    if (newHead.x === egg.x && newHead.y === egg.y) {
        egg = getRandomEggPosition(); // Spawn a new egg
    } else {
        snake.pop(); // Remove the last part of the snake if no food was eaten
    }

    snake.unshift(newHead); // Add new head
}

// Draw everything on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    ctx.fillStyle = "lime";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, box, box);
    });

    // Draw the egg
    ctx.fillStyle = "red";
    ctx.fillRect(egg.x, egg.y, box, box);
}

// Main game loop
function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        setTimeout(gameLoop, speed); // Adjust speed based on difficulty
    }
}
