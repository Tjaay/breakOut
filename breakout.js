"use strict";

(function () {

    const canvas = document.getElementById("canvas"),
        ctx = canvas.getContext("2d"),
        ballRadius = 10,
        paddleHeight = 10,
        paddleWidth = 75,
        brickRowCount = 3,
        brickColumnCount = 7,
        brickWidth = 65,
        brickHeight = 20,
        brickPadding = 10,
        brickOffsetTop = 40,
        brickOffsetLeft = 40,
        bricks = [];

    let x = canvas.width / 2,
        y = canvas.height - 30,
        rightPressed = false,
        leftPressed = false,
        isPaused = false,
        hardmode = document.getElementById("hardmode"),
        dx = Math.floor((Math.random() * 10) - 3), // ball starts out randomly from -3 to 5
        dy = -6,
        paddleX = (canvas.width - paddleWidth) / 2,
        score = 0,
        lives = 3,
        gameStart = false,
        hard = false;

    for (let c = 0; c < brickRowCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickColumnCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }


    hardmode.addEventListener("click", hardMode, false);
    document.addEventListener("click", mouseClickHandler, false);
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    function mouseClickHandler(e) {
        if (!gameStart) {
            gameStart = true;
        }
        // if game is already started second click flips bool isPaused
        else if (gameStart) {
            isPaused = true;
            gameStart = false;
            alert("game is paused click anywhere on page to resum")
        }
    };

    // hard mode speed increase
    function hardMode(e) {
        hard = true;
        dy = -12;
    }

    function mouseMoveHandler(e) {
        if (gameStart) {
            const relativeX = e.clientX - canvas.offsetLeft;
            if (relativeX > 0 && relativeX < canvas.width) {
                paddleX = relativeX - paddleWidth / 2;
            }
        }
    };

    function keyDownHandler(e) {
        if (e.keyCode === 39) {
            rightPressed = true;
        }
        else if (e.keyCode === 37) {
            leftPressed = true;
        }
        else if (e.keyCode === 80) {
            pPressed = true;
        }
    };

    function keyUpHandler(e) {
        if (e.keyCode === 39) {
            rightPressed = false;
        }
        else if (e.keyCode === 37) {
            leftPressed = false;
        }
        else if (e.keyCode === 80) {
            pPressed = false;
        }
    };

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    };

    function drawBricks() {
        for (let c = 0; c < brickRowCount; c++) {
            for (let r = 0; r < brickColumnCount; r++) {
                if (bricks[c][r].status === 1) {
                    const brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                    const brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#0095DD";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    };

    function drawPaddle() {
        ctx.beginPath();
        // makes paddle smaller for hard mode
        if (hard) {
            ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth / 2, paddleHeight);
        }
        else {
            ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        }
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    };

    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Score: " + score, 8, 20);
    };

    function drawLives() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
    };




    function collisionDetection() {
        for (let c = 0; c < brickRowCount; c++) {
            for (let r = 0; r < brickColumnCount; r++) {
                const b = bricks[c][r];
                if (b.status === 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        // ballHit = true;
                        if (score === brickRowCount * brickColumnCount) {
                            alert("YOU WIN, CONGRATS!");
                            document.location.reload();
                        }
                    }
                }
            }
        }
    };

    // if (ballHit) {
    //     function hit() {
    //         ballHit = false;
    //         renderCanvas = true;
    //     };
    // }


    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawBricks();
        drawPaddle();
        drawScore();
        drawLives();
        collisionDetection();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        }
        else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                // dy += 2;
                // dx += 2;
                dy = -dy;

            }
            else {
                lives--;
                if (!lives) {
                    alert("GAME OVER");
                    document.location.reload();
                }
                else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    if (hard) {
                        dy = -12;
                    }
                    else {
                        dx = Math.floor((Math.random() * 10) - 3);
                        dy = -6;
                    }
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }

        if (gameStart) {
            if (rightPressed && paddleX < canvas.width - paddleWidth) {
                paddleX += 7;
            }
            else if (leftPressed && paddleX > 0) {
                paddleX -= 7;
            }


            x += dx;
            y += dy;

        }

        requestAnimationFrame(draw);

        // if isPaused true cancel animation
        if (isPaused) {
            cancelAnimationFrame(requestAnimationFrame(draw));
        }

    };
    return draw();

})();


