import "./styles.scss";

class Snake {
  constructor() {
    this.snakeHead = document.getElementById("snake");
    this.square = document.getElementById("square");
    this.squareOuter = document.getElementById("squareOuter");
    this.apple = document.getElementById("apple");
    this.score = document.getElementById("score");
    this.bestScoreTxt = document.getElementById("best_score");
    this.info = document.getElementById("info");
    this.stepTime = 150;
    this.stepTimeDefault = 150;
    this.step = 15;
    this.tail = [];
    this.direction = "ArrowRight";
    this.newDirection = "ArrowRight";
    this.directionKeys = {
      ArrowUp: "ArrowDown",
      ArrowLeft: "ArrowRight",
      ArrowRight: "ArrowLeft",
      ArrowDown: "ArrowUp"
    };
    this.snakeIsMoving = false;
    this.snakeAte = false;
    this.snakeLost = false;
    this.snakeInterval = null;
    this.moveApple();
    this.type = "normal";
    /* ---------- */
    this.apples = 0;
    this.bestScore = 0;
    this.bestScoreChallenge = 0;
  }

  toggle() {
    if (!this.snakeIsMoving && !this.snakeLost) {
      // start
      this.move();
    } else if (this.snakeIsMoving && !this.snakeLost) {
      // pause
      this.pause();
    } else {
      // restart
      this.restart();
    }
  }
  move() {
    this.snakeIsMoving = true;
    this.info.style.visibility = "collapse";
    this.snakeInterval = setInterval(
      function() {
        this.changeDirection();
        switch (this.direction) {
          case "ArrowUp":
            this.moveUp();
            break;
          case "ArrowDown":
            this.moveDown();
            break;
          case "ArrowLeft":
            this.moveLeft();
            break;
          case "ArrowRight":
            this.moveRight();
            break;
          default:
        }
        if (!this.snakeLost && this.snakeOnSnake()) {
          this.lose();
        }
        if (!this.snakeLost) {
          this.tryEat();
          this.moveTail();
        }
      }.bind(this),
      this.stepTime
    );
  }
  moveRight() {
    if (this.snakeHead.offsetLeft < this.square.offsetWidth - this.step) {
      this.snakeHead.style.left = this.snakeHead.offsetLeft + this.step + "px";
    } else {
      this.lose();
    }
  }
  moveLeft() {
    if (this.snakeHead.offsetLeft > 0) {
      this.snakeHead.style.left = this.snakeHead.offsetLeft - this.step + "px";
    } else {
      this.lose();
    }
  }
  moveDown() {
    if (this.snakeHead.offsetTop < this.square.offsetHeight - this.step) {
      this.snakeHead.style.top = this.snakeHead.offsetTop + this.step + "px";
    } else {
      this.lose();
    }
  }
  moveUp() {
    if (this.snakeHead.offsetTop > 0) {
      this.snakeHead.style.top = this.snakeHead.offsetTop - this.step + "px";
    } else {
      this.lose();
    }
  }
  changeDirection() {
    if (
      this.newDirection !== this.direction &&
      this.newDirection !== this.directionKeys[this.direction]
    ) {
      this.direction = this.newDirection;
    }
  }
  setNewDirection(direction) {
    this.newDirection = direction;
  }
  pause() {
    this.snakeIsMoving = false;
    clearInterval(this.snakeInterval);
    this.info.style.visibility = "visible";
    this.info.textContent = "Pause";
  }
  lose() {
    clearInterval(this.snakeInterval);
    this.snakeIsMoving = false;
    this.snakeLost = true;
    this.square.classList.add("gray");
    this.info.style.visibility = "visible";
    this.info.textContent = "Try again";
    this.ifBestScore();
    if (this.type === "challenge") {
      this.stepTime = this.stepTimeDefault;
    }
  }
  restart() {
    this.pause();
    this.info.textContent = "Start";
    if (this.tail.length !== 0) {
      for (let i = 0; i < this.tail.length; i++) {
        this.square.removeChild(this.tail[i]);
      }
      this.tail = [];
    }
    this.snakeLost = false;
    this.snakeHead.style.top = "45px";
    this.snakeHead.style.left = "45px";
    this.direction = "ArrowRight";
    this.newDirection = "ArrowRight";
    this.square.classList.remove("gray");
    this.moveApple();
    this.apples = 0;
    this.score.textContent = 0;
  }
  moveTail() {
    if (this.tail.length !== 0 && !this.snakeAte) {
      this.square.removeChild(this.tail[this.tail.length - 1]);
      this.tail.pop();
    }
    let addToTail = this.snakeHead.cloneNode(true);
    addToTail.removeAttribute("id");
    this.square.appendChild(addToTail);
    this.tail.unshift(addToTail);
    this.snakeAte = false;
  }
  moveApple() {
    let max = 300 / this.step - 1;
    this.apple.style.top = this.getRandomInteger(0, max) * this.step + "px";
    this.apple.style.left = this.getRandomInteger(0, max) * this.step + "px";
    while (this.appleOnSnake()) {
      this.moveApple();
    }
  }
  tryEat() {
    if (
      this.snakeHead.offsetLeft === this.apple.offsetLeft &&
      this.snakeHead.offsetTop === this.apple.offsetTop
    ) {
      this.snakeAte = true;
      this.updateSocre();
      this.moveApple();
      this.ifChallenge();
    }
  }
  updateSocre() {
    this.apples++;
    this.score.textContent = this.apples;
  }
  ifBestScore() {
    if (this.apples > this.bestScore) {
      if (this.type === "challenge") {
        this.bestScoreChallenge = this.apples;
        this.bestScoreTxt.textContent = this.bestScoreChallenge;
      } else {
        this.bestScore = this.apples;
        this.bestScoreTxt.textContent = this.bestScore;
      }
      this.info.textContent = "Best score!";
    }
  }
  changeScore() {
    if (this.type === "challenge") {
      this.bestScoreTxt.textContent = this.bestScoreChallenge;
    } else {
      this.bestScoreTxt.textContent = this.bestScore;
    }
  }
  changeType(type) {
    switch (type) {
      case "challenge":
        this.type = "challenge";

        break;
      case "normal":
        this.type = "normal";
        this.stepTime = this.stepTimeDefault;
        break;
      default:
      // none
    }
    this.changeScore();
  }
  ifChallenge() {
    if (this.type === "challenge") {
      this.stepTime -= 2;
      clearInterval(this.snakeInterval);
      this.move();
    }
  }
  snakeOnSnake() {
    return this.onSnakeTail(this.snakeHead);
  }
  appleOnSnake() {
    if (
      this.snakeHead.offsetLeft === this.apple.offsetLeft &&
      this.snakeHead.offsetTop === this.apple.offsetTop
    ) {
      return true;
    }
    return this.onSnakeTail(this.apple);
  }
  onSnakeTail(element) {
    if (this.tail.length !== 0) {
      for (let i = 0; i < this.tail.length; i++) {
        if (
          this.tail[i].offsetLeft === element.offsetLeft &&
          this.tail[i].offsetTop === element.offsetTop
        ) {
          return true;
        }
      }
      return false;
    }
    return false;
  }
  changeSpeed(speed) {
    switch (speed) {
      case "slow":
        this.stepTime = 200;
        this.stepTimeDefault = 200;
        break;
      case "medium":
        this.stepTime = 150;
        this.stepTimeDefault = 150;
        break;
      case "fast":
        this.stepTime = 100;
        this.stepTimeDefault = 100;
        break;
      case "too_fast":
        this.stepTime = 50;
        this.stepTimeDefault = 50;
        break;
      default:
      // none
    }
    // this.pause();
  }
  getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

let snake = new Snake();
let squarePanel = document.getElementById("square");
let restartBtn = document.getElementById("restart");
let content = document.getElementById("content");
document.addEventListener("keydown", event => {
  // change snake's direction
  if (["ArrowUp", "ArrowLeft", "ArrowRight", "ArrowDown"].includes(event.key)) {
    event.preventDefault(); // don't scroll page
    snake.setNewDirection(event.key);
  }
  // start + restart + pausa: spacja
  if (event.key === " ") {
    event.preventDefault(); // don't scroll page
    snake.toggle();
  }
});
document.querySelectorAll(".item_speed").forEach(item => {
  item.addEventListener("click", event => {
    snake.changeSpeed(item.getAttribute("id"));
    document.querySelectorAll(".item_speed").forEach(item2 => {
      item2.classList.remove("selected");
    });
    item.classList.add("selected");
  });
});
document.querySelectorAll(".item_type").forEach(item => {
  item.addEventListener("click", event => {
    snake.changeType(item.getAttribute("id"));
    snake.restart();
    document.querySelectorAll(".item_type").forEach(item2 => {
      content.classList.remove(item2.getAttribute("id"));
      item2.classList.remove("selected");
    });
    content.classList.add(item.getAttribute("id"));
    item.classList.add("selected");
  });
});
restartBtn.addEventListener("click", function() {
  snake.restart();
});
squarePanel.addEventListener("click", function() {
  snake.toggle();
});
