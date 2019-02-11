/*
Creative Coding
Author: Cillian Tighe
Student No: N00152737
*/

// Variable that holds the textGraphic
var textG;

// Variables for changing the text
var pixelD = 5;
var fontSize = 250;
var textTyped = "Generative Design";

// The 'setup' function is only called once. Everything within the function is executed once
function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  // Calling the function to create the graphic
  textGraphic();

  noStroke();
  noFill();
}

// The 'draw' function is called in a loop. Everything that is in the function is executed continuously
function draw() {
  background(255);

  //Looping through the pixels array of the graphic
  for (var y = 0; y < textG.height; y += pixelD) {
    for (var x = 0; x < textG.width; x += pixelD) {
      var index = (x + y * textG.width) * 4;
      if (textG.pixels[index] <= 128) {
        fill(0);
        ellipse(x, y, 5, 5);
      }
    }
  }
}

// Function that creates a graphic using the p5 library
function textGraphic() {
  textG = createGraphics(width, height);
  textG.pixelDensity(1);
  textG.background(255);
  textG.fill(0);
  textG.textSize(fontSize);
  textG.textAlign(CENTER);
  textG.textFont("Roboto Condensed");
  textG.text(textTyped, textG.width / 2, textG.height / 2);
  textG.loadPixels();
}
