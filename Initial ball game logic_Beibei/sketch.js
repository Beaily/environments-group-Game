// 基础形状类
class Shape {
  constructor(x, y, size, speed, col) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.col = col;
  }

  move() {
    this.y += this.speed;
  }

  // 这是一个通用方法，可能会被子类重写
  display() {
    fill(this.col);
  }
}

// 方形类
class Rectangle extends Shape {
  display() {
    super.display();
    rect(this.x, this.y, this.size, this.size);
  }
}

// 圆形类
class Circle extends Shape {
  display() {
    super.display();
    ellipse(this.x, this.y, this.size, this.size);
  }
}

// 三角形类
class Triangle extends Shape {
  display() {
    super.display();
    triangle(
      this.x, this.y - this.size / 2, 
      this.x - this.size / 2, this.y + this.size / 2, 
      this.x + this.size / 2, this.y + this.size / 2
    );
  }
}

// 游戏逻辑
let shapes = [];
let startTime;
let duration = 15;
let fixedSpeed = 6;
let rectCount = 0;
let triangleCount = 0;
let currentState = "playing";
let resultStartTime;

function setup() {
  createCanvas(600, 600);
  startTime = millis();
}

function draw() {
  background(255);
  
  fill(0);
  noStroke();
  textSize(24);
  text("Move the mouse", 80, 40);

  let currentMillis = millis();
  if (currentState === "playing" && currentMillis - startTime < duration * 1000) {
    if (frameCount % 30 == 0) {
      let shapesToAdd = floor(random(1, 4));
      for (let i = 0; i < shapesToAdd; i++) {
        addRandomShape();
      }
    }
    let timeLeft = duration - ((currentMillis - startTime) / 1000);
    drawTimer(floor(timeLeft)); 
  } else if (currentState === "playing") {
    currentState = "showRects";
    resultStartTime = currentMillis;
  }

  shapes.forEach(shape => {
    shape.move();
    shape.display();
  });

  // 根据当前状态显示计时器或结果
  if (currentState === "showRects" && currentMillis - resultStartTime < 10000) {
    drawCount(rectCount, "Rectangles: ");
  } else if (currentState === "showRects") {
    currentState = "showTriangles";
    resultStartTime = currentMillis;
  } else if (currentState === "showTriangles" && currentMillis - resultStartTime < 2000) {
    drawCount(triangleCount, "Triangles: ");
  } else if (currentState === "showTriangles") {
    currentState = "showResult";
    resultStartTime = currentMillis;
  } else if (currentState === "showResult" && currentMillis - resultStartTime < 2000) {
    showResult();
  } else if (currentState === "showResult") {
    resetGame();
  }
}

function addRandomShape() {
  let centerX = width / 2 + mouseX / 4;
  let range = 200;
  let x = random(centerX - range / 2, centerX + range / 2);
  let y = -50;
  let size = random(20, 50);
  let col = color(random(255), random(255), random(255));
  let type = mouseX > 300 ? random([0, 0, 1, 2, 2, 2]) : random([0, 0, 0, 1, 2, 2]);

  if (type === 0) {
    shapes.push(new Rectangle(x, y, size, fixedSpeed, col));
     
  } else if (type === 1) {
    shapes.push(new Circle(x, y, size, fixedSpeed, col));
  } else if (type === 2) {
    shapes.push(new Triangle(x, y, size, fixedSpeed, col));
    triangleCount++;
  }
}

function drawTimer(timeLeft) {
  fill(0);
  textSize(24);
  text(`Time: ${timeLeft}s`, width - 170, height - 60);
}

function drawCount(count, label) {
  textAlign(CENTER, CENTER);
  fill(0);
  textSize(32);
  text(`${label}${count}`, width / 2, height / 2);
}

function showResult() {
  textAlign(CENTER, CENTER);
  textSize(32);
  let resultText = triangleCount > rectCount ? "GOOD" : "BAD";
  fill(resultText === "GOOD" ? 'gold' : 'red');
  text(resultText, width / 2, height / 2);
}

function resetGame() {
  shapes = [];
  rectCount = 0;
  triangleCount = 0;
  startTime = millis();
  currentState = "playing";
}
