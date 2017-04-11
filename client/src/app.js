var canvas,
    ctx,
    width = 600,
    height = 600,
    ship_x = (width / 2) - 25, ship_y = height - 75, ship_w = 50, ship_h = 50,
    rightKey = false,
    leftKey = false,
    upKey = false,
    downKey = false,
    enemyTotal = 5,
    enemies = [],
    enemy_x = 50,
    enemy_y = -45,
    enemy_w = 50,
    enemy_h = 50,
    speed = 3,
    enemy,
    ship,
    laserTotal = 2,
    lasers = [],
    score = 0,
    alive = true,
    lives = 3;

    for (var i = 0; i < enemyTotal; i++) {
      enemies.push([enemy_x, enemy_y, enemy_w, enemy_h, speed]);
      enemy_x += enemy_w + 60;
    }

    function clearCanvas() {
      ctx.clearRect(0,0,width,height);
    }

    function init() {
      canvas = document.getElementById('canvas');
      console.log("canvas object at init", canvas);
      ctx = canvas.getContext('2d');
      console.log("ctx object at init");
      enemy = new Image();
      enemy.src = 'red_enemy_ship.png';
      ship = new Image();
      ship.src = '8_bit_ship_sprite.png';
      document.addEventListener('keydown', keyDown, false);
      document.addEventListener('keyup', keyUp, false);
      gameLoop();
    }

    function keyDown(e) {
      if (e.keyCode == 39) rightKey = true;
      else if (e.keyCode == 37) leftKey = true;
      if (e.keyCode == 38) upKey = true;
      else if (e.keyCode == 40) downKey = true;
      if (e.keyCode == 88 && lasers.length <= laserTotal) lasers.push([ship_x + 25, ship_y - 20, 4, 20]);
    }

    function keyUp(e) {
      if (e.keyCode == 39) rightKey = false;
      else if (e.keyCode == 37) leftKey = false;
      if (e.keyCode == 38) upKey = false;
      else if (e.keyCode == 40) downKey = false;
    }

    function drawShip() {
      if (rightKey) ship_x += 5;
      else if (leftKey) ship_x -= 5;
      if (upKey) ship_y -= 5;
      else if (downKey) ship_y += 5;
      if (ship_x <= 0) ship_x = 0;
      if ((ship_x + ship_w) >= width) ship_x = width - ship_w;
      if (ship_y <= 0) ship_y = 0;
      if ((ship_y + ship_h) >= height) ship_y = height - ship_h;
      ctx.drawImage(ship, ship_x, ship_y);
    }

    function drawEnemies() {
      for (var i = 0; i < enemies.length; i++) {
        ctx.drawImage(enemy, enemies[i][0], enemies[i][1]);
      }
    }

    function drawLaser() {
      if (lasers.length)
        for (var i = 0; i < lasers.length; i++) {
          ctx.fillStyle = '#f00';
          ctx.fillRect(lasers[i][0],lasers[i][1],lasers[i][2],lasers[i][3])
        }
    }

    function moveEnemies() {
      for (var i = 0; i < enemies.length; i++) {
        if (enemies[i][1] < height) {
          enemies[i][1] += enemies[i][4];
        } else if (enemies[i][1] > height - 1) {
          enemies[i][1] = -45;
        }
      }
    }

    function moveLaser() {
      for (var i = 0; i < lasers.length; i++) {
        if (lasers[i][1] > -11) {
          lasers[i][1] -= 10;
        } else if (lasers[i][1] < -10) {
          lasers.splice(i, 1);
        }
      }
    }

    function hitTest() {
      var remove = false;
      for (var i = 0; i < lasers.length; i++) {
        for (var j = 0; j < enemies.length; j++) {
          if (lasers[i][1] <= (enemies[j][1] + enemies[j][3]) && lasers[i][0] >= enemies[j][0] && lasers[i][0] <= (enemies[j][0] + enemies[j][2])) {
            remove = true;
            enemies.splice(j, 1);
            score += 10;
          }
        }
        if (remove == true) {
          lasers.splice(i, 1);
          remove = false;
        }
      }
    }

    function shipCollision() {
      var ship_xw = ship_x + ship_w,
          ship_yh = ship_y + ship_h;
      for (var i = 0; i < enemies.length; i++) {

          if (ship_x > enemies[i][0] && ship_x < enemies[i][0] + enemy_w && ship_y > enemies[i][1] && ship_y < enemies[i][1] + enemy_h) {
            checkLives();
          }
          if (ship_xw < enemies[i][0] + enemy_w && ship_xw > enemies[i][0] && ship_y > enemies[i][1] && ship_y < enemies[i][1] + enemy_h) {
            checkLives();
          }
          if (ship_yh > enemies[i][1] && ship_yh < enemies[i][1] + enemy_h && ship_x > enemies[i][0] && ship_x < enemies[i][0] + enemy_w) {
            checkLives();
          }
          if (ship_yh > enemies[i][1] && ship_yh < enemies[i][1] + enemy_h && ship_xw < enemies[i][0] + enemy_w && ship_xw > enemies[i][0]) {
            checkLives();
          }
        }
      }
    

    function scoreTotal() {
      ctx.font = 'bold 18px Arial';
      ctx.fillStyle = '#fff';
      ctx.fillText('Score: ', 490, 30);
      ctx.fillText(score, 550, 30);
      ctx.fillText('Lives:', 10, 30);
      ctx.fillText(lives, 68, 30);
      if (!alive) {
        ctx.fillText('Game Over!', 245, height / 2);
      }
    }

    function checkLives() {
     lives -= 1;
     if (lives > 0) {
       reset();
     } else if (lives == 0) {
       alive = false;
     }
    }

    function reset() {
     var enemy_reset_x = 50;
     ship_x = (width / 2) - 25, ship_y = height - 75, ship_w = 50, ship_h = 57;
     for (var i = 0; i < enemies.length; i++) {
       enemies[i][0] = enemy_reset_x;
       enemies[i][1] = -45;
       enemy_reset_x = enemy_reset_x + enemy_w + 60;
     }
    }

    function gameLoop() {
      clearCanvas();
      if(alive){
      hitTest();
      shipCollision();
      moveEnemies();
      moveLaser();
      drawEnemies();
      drawShip();
      drawLaser();
     }
     scoreTotal();
     game = setTimeout(gameLoop, 1000 / 30);
    }


window.onload = init;