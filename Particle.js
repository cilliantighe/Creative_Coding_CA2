class Particle {

  // Constructor for the particle class
  constructor(_xLoc, _yLoc, _txtTyped, _shape, _color, _fill, _size, _mass) {
    this.location = createVector(_xLoc, _yLoc);
    this.desiredLoc = createVector(0, 0);
    this.txtTyped = _txtTyped;
    this.shape = _shape;
    this.color = _color;
    this.fill = _fill;
    this.size = _size;
    this.mass = _mass;
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.maxSpeed = 5;
    this.follow = false;
  }

  // Update function for changing the particle's position
  update() {
    if (this.follow) {
      let mouse = createVector(mouseX, mouseY);
      let dir = p5.Vector.sub(mouse, this.location);
      dir.normalize();
      dir.mult(0.05);
      this.acceleration = dir;

      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxSpeed);
      this.location.add(this.velocity);
    } else {
      this.velocity.add(this.acceleration);
      this.velocity.limit(10);
      this.location.add(this.velocity);
      this.acceleration.mult(0);
    }
  }

  // Function that draws the desired shape, size and color of the particle
  draw() {
    push();
    translate(this.location.x, this.location.y);
    if (this.follow) {
      let angle = this.acceleration.heading();
      rotate(angle);
    }
    if (this.fill === 'Fill') {
      noStroke();
      fill(this.color);
    } else if (this.fill === 'Stroke') {
      noFill();
      stroke(this.color);
    } else if (this.fill === 'Both') {
      stroke(this.color);
      fill(this.color);
    }
    // Checking what shape is to be drawn
    if (this.shape === 'Ellipse') {
      ellipse(0, 0, this.size, this.size);
    } else if (this.shape === 'Rectangle') {
      rect(0, 0, this.size, this.size);
    } else if (this.shape === 'Triangle') {
      triangle(0 - this.size / 2, 0 + this.size / 2, 0, 0 - this.size / 3, 0 + this.size / 2, 0 + this.size / 2);
    } else if (this.shape === 'Line') {
      stroke(this.color);
      let randPos = random(1);
      if (randPos < .5) {
        line(0 - this.size / 2, 0 - this.size / 2, 0 + this.size / 2, 0 + this.size / 2);
      } else {
        line(0 + this.size / 2, 0 - this.size / 2, 0 - this.size / 2, 0 + this.size / 2);
      }
    } else if (this.shape === 'Type') {
      textSize(this.size);
      text(this.txtTyped[floor(random(this.txtTyped.length + 1))], 0, 0);
    }
    pop();
  }

  // Function for applying a force to the particle
  applyForce(force) {
    let f = p5.Vector.div(force, this.size);
    this.acceleration.add(f);
  }

  // Function for checking the boundaries of the canvas
  checkEdges() {
    if (this.location.x - (this.size / 2) <= 0 || this.location.x + (this.size / 2) >= width) {
      this.velocity.x = this.velocity.x * -1;
    }
    if (this.location.y - (this.size / 2) <= 0 || this.location.y + (this.size / 2) >= height) {
      this.velocity.y = this.velocity.y * -1;
    }
  }

  // Function that resets the current location of the particle to the desired location
  reset() {
    let distance = sqrt(pow((this.location.x - this.desiredLoc.x), 2) + pow((this.location.y - this.desiredLoc.y), 2));

    if (distance > 20) {
      let dir = p5.Vector.sub(this.desiredLoc, this.location);
      dir.normalize();
      dir.mult(1);
      this.acceleration = dir;

      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxSpeed);
      this.location.add(this.velocity);
    } else {
      this.location = this.desiredLoc;
      this.velocity = createVector(0, 0);
      this.acceleration = createVector(0, 0);
    }
  }

  // Set function for follow
  setFollow(_follow) {
    this.follow = _follow;
  }

  // Set function for the desired location
  setDesiredLoc(_desLoc) {
    this.desiredLoc = _desLoc;
  }
}
