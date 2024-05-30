let landedShapes = []; // Array to store landed shapes
let moverX; // Position of the horizontally moving shape
let moveMinX;
let moveMaxX;
let moverDirection = 1; // Direction of the mover, 1 for right, -1 for left
let moverSpeed = 7; // Speed of the moving shape
let touchCount = 0; // Counter for touches on the central line

function setup() {
  createCanvas(windowWidth, windowHeight);
  b2newWorld(30, b2V(0, 5));
  new b2Body('edge', false, b2V(width / 2, height - 4), [b2V(-width / 2, 0), b2V(width / 2, 0)]);
  moverX = width / 2; // Start at the center of the screen
  moveMinX = 50; // Minimum x-value on the left
  moveMaxX = windowWidth - 50; // Maximum x-value on the right
}

function draw() {
  background(255, 205, 0);

  // Vertical Line in the center
  stroke(255, 220, 0, 80);
  strokeWeight(3);
  line(width / 2, 0, width / 2, height);

  // Display the touch count at the top right
  fill(0);
  textSize(16);
  textAlign(RIGHT, TOP);
  text("Touch Count: " + touchCount, width - 10, 10);

  // Update and draw the moving shape
  moverX += moverSpeed * moverDirection;
  if (moverX > moveMaxX || moverX < moveMinX) {
    moverDirection *= -1; // Change direction at the edges
  }

  fill(0, 102, 153);
  noStroke();
  ellipse(moverX, 90, 40, 40); // Draw moving shape

  // Draw landed shapes and check for touching the center line
  for (let shape of landedShapes) {
    fill(shape.color ? shape.color : 255);
    stroke(0);
    shape.body.draw();
  }
  
  b2Update();
  b2Draw();
}

function mouseClicked() {
  let randomColor = color(random(255), random(255), random(255));
  let newShape = new b2Body('box', true, b2V(moverX, 90), b2V(90, 50), {
    density: 5,
    restitution: 0.01
  });
  newShape.color = randomColor;
  landedShapes.push({ body: newShape, color: randomColor }); // Add the new shape to the array
}

function EndContactHandler(contactPtr) {
  let shape = b2GetUserDataFromContact(contactPtr);
  landedShapes.push({ body: shape, color: shape.color });
}
