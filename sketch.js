/*
Creative Coding
Author: Cillian Tighe
Student No: N00152737
*/

// Variables for the inputs
let radiusSlider;
let claritySlider;
let txtInput;
let txtSizeDrop;
let txtStyleDrop;
let shapeDrop;
let shapeFillDrop;

// Array Variables
let startArray = [];
let endArray = [];

// Variables for the lerp value and the distance from the start and end point
let lerpDis = 0;
let distance = 100;

//Image loaded in
let img;
let load_image = 'image_3.jpg';

// letiable that holds the txtGraphic
let txtG;

// Variables for changing the text
let pixelD = 8;
let shape = 'Ellipse';
let shapeFill = 'Fill';
let shapeOpacity = 200;
let shapeSize = 10;
let txtSize = 250;
let txtStyle;
let mouseDis = 100;
let txtTyped = 'REDRUM';

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
  radiusSlider = createSlider(1, 20, shapeSize);
  radiusSlider.parent('radiusSlider');
  radiusSlider.class('input slider');
  radiusSlider.changed(update);

  // Slider for changing the clarity of the image
  claritySlider = createSlider(2, 20, pixelD);
  claritySlider.parent('claritySlider');
  claritySlider.class('input slider');
  claritySlider.changed(update);

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

  // Applying default styling to sketch
  noStroke();
  noFill();
  textAlign(CENTER);
  rectMode(CENTER);
}

// The 'draw' function is called in a loop. Everything that is in the function is executed continuously
function draw() {
  // Setting the background to a lower opacity to allow a bleed effect on the moving shapes
  background(255, 55);
  randomSeed(1);

  // Updating the array of points of the text graphic
  // Drawing the points
  updatePoints();
  drawPoints();
  /*
  Increasing the lerpDis value on each iteration to move the points from the
  startArray to their goal in the endArray. When the value has reached over 1, the
  lerpDis is explicity set to 1 as this represents their desired position
  */
  if (lerpDis < 1) {
    lerpDis = lerpDis + 0.02;
  } else {
    lerpDis = 1;
  }
}

// Function for updating the arrays for start and end points
function updatePoints() {
  startArray = [];
  endArray = [];

  //Looping through the pixels array of the graphic
  for (let y = 0; y < txtG.height; y += pixelD) {
    for (let x = 0; x < txtG.width; x += pixelD) {
      // Getting the index value for the graphic that was created
      // Getting the index value for the image that was imported
      let graphicIndex = (x + y * txtG.width) * 4;
      let imgIndex = (x + y * img.width) * 4;
      if (txtG.pixels[graphicIndex] <= 128) {
        // Pushing a random start point for each item
        startArray.push({
          x: x + random(-distance, distance),
          y: y + random(-distance, distance)
        });
        // Pushing the destination point for each item with the fill colour
        endArray.push({
          x: x,
          y: y,
          fill: color(img.pixels[imgIndex], img.pixels[imgIndex + 1], img.pixels[imgIndex + 2], shapeOpacity)
        });
      }
    }
  }
}

/*
Function that draws each point from the startArray position and gradually
moves each point to their destination using the lerp function. The lerpDis variable
determines where the point is between it's start and end.
*/
function drawPoints() {
  for (let i = 0; i < endArray.length; i++) {
    // Calculating the current x & y point
    let x = lerp(startArray[i].x, endArray[i].x, lerpDis);
    let y = lerp(startArray[i].y, endArray[i].y, lerpDis);

    // Checking whether there a fill, stroke or both is selected
    if (shapeFill === 'Fill') {
      noStroke();
      fill(endArray[i].fill);
    } else if (shapeFill === 'Stroke') {
      noFill();
      stroke(endArray[i].fill);
    } else if (shapeFill === 'Both') {
      stroke(endArray[i].fill);
      fill(endArray[i].fill);
    }
    // Checking what shape is to be drawn
    if (shape === 'Ellipse') {
      ellipse(x, y, shapeSize, shapeSize);
    } else if (shape === 'Rectangle') {
      rect(x, y, shapeSize, shapeSize);
    } else if (shape === 'Triangle') {
      triangle(x - shapeSize / 2, y + shapeSize / 2, x, y - shapeSize / 3, x + shapeSize / 2, y + shapeSize / 2);
    } else if (shape === 'Type') {
      textSize(shapeSize);
      text(txtTyped[floor(random(txtTyped.length + 1))], x, y);
    }
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
  shapeSize = radiusSlider.value();
  pixelD = claritySlider.value();
  shape = shapeDrop.value();
  shapeFill = shapeFillDrop.value();
  txtTyped = txtInput.value();
  txtStyle = txtStyleDrop.value();
  let size = txtSizeDrop.value();
  txtSize = int(size);
  txtGraphic();
  lerpDis = 0;
}

// Function to save an image of the canvas
function keyPressed() {
  if (keyCode === DOWN_ARROW) saveCanvas(canvas, 'GD_CA2', 'png');
}
