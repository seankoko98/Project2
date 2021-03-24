/***********************************************************************************
  AllFeatures
  by Scott Kildall

  Uses the p5.debugScreen.js library to allocate and output simple mouse-clicked
  messages on the screen. Shows all accessors

------------------------------------------------------------------------------------
	To use:
	Add this line to the index.html

  <script src="p5.debugScreen.js"></script>
***********************************************************************************/

// global var for the debug screen object
var debugScreen;
var lineCount;      // # of lines for the screen

// drawing vars
var yTextPos = 30;
var lineHeight = 18;


// Setup code goes here
function setup() {
  createCanvas(windowWidth, windowHeight);

  textAlign(CENTER);
  textSize(lineHeight);

  debugScreen = new DebugScreen();
  lineCount = debugScreen.getNumLines();
 }


// Draw code goes here
function draw() {
  background(128);

  // draw text instuctions
  fill(255);
  textAlign(LEFT)
  let textX = width/2;
  text( "Click on mouse to add debug text", textX, yTextPos);  
  text( "Press [t] to switch to top-screen debug screen", textX, yTextPos + lineHeight); 
  text( "Press [b] to switch to bottom-screen debug screen", textX, yTextPos + lineHeight*2); 
  text( "Press [a] to turn ON autoscroll", textX, yTextPos + lineHeight*3); 
  text( "Press [m] to turn OFF autoscroll", textX, yTextPos + lineHeight*4); 
  text( "Press [x] to turn OFF background rect", textX, yTextPos + lineHeight*5); 
  text( "Press [y] to turn ON background rect", textX, yTextPos + lineHeight*6); 
  text( "Press [r] to change color to RED", textX, yTextPos + lineHeight*7); 
  text( "Press [g] to change color to GREEN", textX, yTextPos + lineHeight*8); 
  text( "Press UP ARROW to increase font size", textX, yTextPos + lineHeight*9);
  text( "Press DOWN ARROW to decrease font size", textX, yTextPos + lineHeight*10);

  // draw debug srreen
  debugScreen.draw();
}

function keyPressed() {
  // draw from top
  if( key === 't' ) {
    debugScreen.drawFromTop();
    debugScreen.print("setting to draw from top");
    return;
  }

  // draw from bottom
  if( key === 'b' ) {
    debugScreen.drawFromBottom();
    debugScreen.print("setting to draw from bottom");
  }

  // change to red text
  if( key === 'r') {
    debugScreen.setTextColor(color(255,0,0));
  }

  // back to green text
  if( key === 'g') {
    debugScreen.setTextColor(color(255,0,0));
  }

  // hide background rect
  if( key === 'x') {
    debugScreen.setDrawBackgroundRect(false);
  }

  // show background rect
  if( key === 'y') {
    debugScreen.setDrawBackgroundRect(true);
    return;
  }

  // turn on autoscroll
  if( key === 'a' ) {
    debugScreen.setAutoScroll(true);
    return;
  }

  // turn off autoscroll
  if( key === 'm' ) {
    debugScreen.setAutoScroll(false);
    return;
  }
  
  // increase font size
  if (keyCode === UP_ARROW) {
    lineCount++;
    debugScreen.setLineCount(lineCount);
    debugScreen.setTextSize(debugScreen.getTextSize()+1);
  }

  // decrease font size
  if (keyCode === DOWN_ARROW) {
    lineCount--;
    debugScreen.setLineCount(lineCount);
    debugScreen.setTextSize(debugScreen.getTextSize()-1);
  }

  // if wr are on autoscroll, output to specific line
  if( debugScreen.getAutoScroll() === false ) {
    // output to line #2
    debugScreen.print("keyPressed | keyPressed = " + key, 1 );
  }
  else {
    // show keycode on the screen
    debugScreen.print("keyPressed | keyPressed = " + key );
  }
}

function mousePressed() {
  // Form a long string with this mouse clicked information
  debugScreen.print("mouse clicked, x = " + mouseX + " | y = " + mouseY + " | millis() = " + Math.round(millis()) );
}

