/*
This code was sourced from:
https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_draggable
*/

// JavaScript file for moving the 'controls' div
dragElement(document.getElementById('controls'));

// Function that handles the movement of the div
function dragElement(element) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

    // If the the id exists, then apply the function
  if (document.getElementById(element.id + 'Header')) {
    document.getElementById(element.id + 'Header').onmousedown = dragMouseDown;
  } else {
    // If not, apply it to the parent div
    element.onmousedown = dragMouseDown;
  }

  // Function that is called when the mouse is pressed
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // Gets the current mouseX and mouseY position
    pos3 = e.clientX;
    pos4 = e.clientY;
    // Binds that function 'closeDragElement' to the mouseup event
    document.onmouseup = closeDragElement;
    // Binds that function 'elementDrag' to the mousemove event
    document.onmousemove = elementDrag;
  }

  // Function for calculating the current position of the element
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // Sets the new position of the element
    element.style.top = (element.offsetTop - pos2) + 'px';
    element.style.left = (element.offsetLeft - pos1) + 'px';
  }

  function closeDragElement() {
    // Stops the element from moving when the mouse is released
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
