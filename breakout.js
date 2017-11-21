"use strict";

(function () {

  const canvas = document.getElementById("canvas"),
        ctx = canvas.getContext("2d"),
        ballRadius = 10,
        paddleHeight = 10,
        paddleWidth = 75,
        brickRowCount = 3,
        brickColumnCount = 11,
        brickWidth = 30,
        brickHeight = 20,
        brickPadding = 10,
        brickOffsetTop = 30,
        brickOffsetLeft = 30,
        bricks = [];

   let  x = canvas.width/2,
        y = canvas.height-30,
        rightPressed = false,
        leftPressed = false,
        dx = 3,
        dy = -3,
        paddleX = (canvas.width-paddleWidth)/2,
        score = 0,
        lives = 3,
        gameStart = false;

  for(let c=0; c<brickRowCount; c++) {
      bricks[c] = [];
      for(let r=0; r<brickColumnCount; r++) {
          bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
  }

  document.addEventListener("click", mouseClickHandler, false);
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseClickHandler(e) {
    if(!gameStart) {
        gameStart = true;
    }
};

  function mouseMoveHandler(e) {
    if(gameStart) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}
};

function keyDownHandler(e) {
    if(e.keyCode === 39) {
        rightPressed = true;
    }
    else if(e.keyCode === 37) {
        leftPressed = true;
    }
};

function keyUpHandler(e) {
    if(e.keyCode === 39) {
        rightPressed = false;
    }
    else if(e.keyCode === 37) {
        leftPressed = false;
    }
};

  function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
};

function drawBricks() {
    for(let c=0; c<brickRowCount; c++) {
        for(let r=0; r<brickColumnCount; r++) {
            if(bricks[c][r].status === 1) {
                const brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                const brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
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
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
};

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
};

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
};

  function collisionDetection() {
    for(let c=0; c<brickRowCount; c++) {
        for(let r=0; r<brickColumnCount; r++) {
            const b = bricks[c][r];
            if(b.status === 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score === brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
};

  function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBall();
      drawBricks();
      drawPaddle();
      drawScore();
      drawLives();
      collisionDetection();
    
      if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
          dx = -dx;
      }
      if(y + dy < ballRadius) {
          dy = -dy;
      }
      else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy += 2;
            dx += 2;
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 3;
                dy = -3;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        } 
      }

      if(gameStart){
        if(rightPressed && paddleX < canvas.width-paddleWidth) {
            paddleX += 7;
        }
        else if(leftPressed && paddleX > 0) {
            paddleX -= 7;
        }    
      x += dx;
      y += dy;
      }
      requestAnimationFrame(draw);
      
  };

  return draw();
  
})();
