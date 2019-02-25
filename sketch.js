/*
Creative Coding
Author: Cillian Tighe
Student No: N00152737
*/

// Variables for the inputs
let sizeSlider;
let claritySlider;
let bleedSlider;
let txtInput;
let txtSizeDrop;
let txtStyleDrop;
let shapeDrop;
let shapeFillDrop;
let saveButton;
let clearButton;

// Array for the mover objects
// Array for the mover objects end points
let particles = [];
let pointArray = [];

// Variables for changing the animation
let fall = false;
let follow = false;
let reset = false;

//Image loaded in
let img;
let load_image = 'image_6.jpg';

// letiable that holds the txtGraphic
let txtG;

// Variables for changing the text
let pixelD = 8;
let bleedEffect = 50;
let shape = 'Line';
let shapeFill = 'Fill';
let shapeOpacity = 200;
let shapeSize = 10;
let txtSize = 250;
let txtStyle;
let txtTyped = 'Generative Design';

// Loading in image
function preload() {
  img = loadImage(load_image);
}

// The 'setup' function is only called once. Everything within the function is executed once
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  // Calling the function to create the graphic
  txtG = createGraphics(width, height);
  txtStyle = NORMAL;
  txtGraphic();

  // Loading the image's pixels
  img.loadPixels();

  // Slider for changing the shape size
  sizeSlider = createSlider(1, 20, shapeSize);
  sizeSlider.parent('sizeSlider');
  sizeSlider.class('input slider');
  sizeSlider.input(update);

  // Slider for changing the clarity of the image
  claritySlider = createSlider(2, 20, pixelD);
  claritySlider.parent('claritySlider');
  claritySlider.class('input slider');
  claritySlider.input(update);

  // Slider for changing the clarity of the image
  bleedSlider = createSlider(0, 255, bleedEffect);
  bleedSlider.parent('bleedSlider');
  bleedSlider.class('input slider');
  bleedSlider.input(update);

  // Text input for the display
  txtInput = createInput(txtTyped, 'text');
  txtInput.parent('txtInput');
  txtInput.class('input');
  txtInput.input(update);

  // Dropdown list for text size
  txtSizeDrop = createSelect();
  txtSizeDrop.parent('txtSizeDrop');
  txtSizeDrop.option(250);
  txtSizeDrop.option(300);
  txtSizeDrop.option(400);
  txtSizeDrop.option(500);
  txtSizeDrop.option(750);
  txtSizeDrop.option(1000);
  txtSizeDrop.changed(update);

  // Dropdown list for text size
  txtStyleDrop = createSelect();
  txtStyleDrop.parent('txtStyleDrop');
  txtStyleDrop.option(NORMAL);
  txtStyleDrop.option(ITALIC);
  txtStyleDrop.option(BOLD);
  txtStyleDrop.option(BOLDITALIC);
  txtStyleDrop.changed(update);

  // Dropdown list for shape
  shapeDrop = createSelect();
  shapeDrop.parent('shapeDrop');
  shapeDrop.option('Line');
  shapeDrop.option('Ellipse');
  shapeDrop.option('Rectangle');
  shapeDrop.option('Triangle');
  shapeDrop.option('Type');
  shapeDrop.changed(update);

  // Dropdown list for fill
  shapeFillDrop = createSelect();
  shapeFillDrop.parent('shapeFillDrop');
  shapeFillDrop.option('Fill');
  shapeFillDrop.option('Stroke');
  shapeFillDrop.option('Both');
  shapeFillDrop.changed(update);

  // Save button for the canvas
  saveButton = createButton('Save');
  saveButton.parent('saveButton');
  saveButton.class('button is-link');
  saveButton.mousePressed(saveGraphic);

  // Save button for the canvas
  clearButton = createButton('Clear');
  clearButton.parent('clearButton');
  clearButton.class('button is-text');
  clearButton.mousePressed(clearCanvas);

  // Applying default styling to sketch
  noStroke();
  noFill();
  textAlign(CENTER);
  rectMode(CENTER);
}

// The 'draw' function is called in a loop. Everything that is in the function is executed continuously
function draw() {
  // Setting the background to a lower opacity to allow a bleed effect on the moving shapes
  background(255, bleedEffect);
  randomSeed(1);

  // If there are already particles in the array, don't repopulate it
  if (particles.length <= 0) {
    //Looping through the pixels array of the graphic
    for (let y = 0; y < txtG.height; y += pixelD) {
      for (let x = 0; x < txtG.width; x += pixelD) {
        // Getting the index value for the graphic that was created
        // Getting the index value for the image that was imported
        let graphicIndex = (x + y * txtG.width) * 4;
        let imgIndex = (x + y * img.width) * 4;
        if (txtG.pixels[graphicIndex] <= 128) {
          // Creating an array with all the end points for each particle
          pointArray.push({
            x: x,
            y: y
          });
          // Populating the particles array with a particle object
          particles.push(new Particle(x, y, txtTyped, shape,
            color(img.pixels[imgIndex], img.pixels[imgIndex + 1], img.pixels[imgIndex + 2], shapeOpacity), shapeFill, shapeSize, random(5, 10)));
        }
      }
    }
  }

  // Loop for rendering all the particles
  for (let i = 0; i < particles.length; i++) {
    // Applying gravity and friction to the particles
    if (fall) {
      let gravity = createVector(0, 0.1 * particles[i].mass);
      // Method for calculating the force being applied to each object
      let c = 0.5;
      let normal = 1;
      let frictionMag = c * normal;
      let friction = p5.Vector.mult(particles[i].velocity, -1);
      friction.normalize();
      friction.mult(frictionMag);
      particles[i].applyForce(friction);
      particles[i].applyForce(gravity);
      particles[i].checkEdges();
      particles[i].update();
      particles[i].draw();
    }
    // The particles will follow the mouse when the condition in met
    else if (follow) {
      particles[i].setFollow(follow);
      particles[i].checkEdges();
      particles[i].update();
      particles[i].draw();
    }
    // The canvas will be reset when the condition is met
    else if (reset) {
      particles[i].setDesiredLoc(createVector(pointArray[i].x, pointArray[i].y));
      particles[i].reset();
      particles[i].draw();
    } else {
      particles[i].setFollow(follow);
      particles[i].draw();
    }
  }
}

// Function for checking user input
function keyPressed() {
  // This will turn the forces on and off
  if (keyCode === DOWN_ARROW) {
    follow = false;
    reset = false;
    fall = fall ? false : true;
  }
  // This will turn the follow on and off
  else if (keyCode === UP_ARROW) {
    fall = false;
    reset = false;
    follow = follow ? false : true;
  }
  // This will reset the position of each particle to their end points
  else if (key === 'r' || key === 'R') {
    fall = false;
    follow = false;
    reset = reset ? false : true;
  }
}

// Function that creates a graphic using the p5 library
function txtGraphic() {
  txtG.pixelDensity(1);
  txtG.background(255);
  txtG.fill(0);
  txtG.textSize(txtSize);
  txtG.textStyle(txtStyle);
  txtG.textAlign(CENTER);
  txtG.textFont('Roboto Condensed');
  txtG.text(txtTyped, txtG.width / 2, (txtG.height / 2) + txtSize / 3);
  txtG.loadPixels();
}

// Function that is called when an input field is changed
function update() {
  shapeSize = sizeSlider.value();
  pixelD = claritySlider.value();
  shape = shapeDrop.value();
  shapeFill = shapeFillDrop.value();
  bleedEffect = bleedSlider.value();
  txtTyped = txtInput.value();
  txtStyle = txtStyleDrop.value();
  let size = txtSizeDrop.value();
  txtSize = int(size);
  clearCanvas();
  txtGraphic();
}

// Function to save an image of the canvas
function saveGraphic() {
  saveCanvas(canvas, 'GD_CA2', 'png');
}

// Function to clear the canvas
function clearCanvas() {
  clear();
  fall = false;
  follow = false;
  reset = false;
  pointArray = [];
  particles = [];
}
