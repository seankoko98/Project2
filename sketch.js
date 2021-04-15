/***********************************************************************************
  Dr. Masque
  by Sean Ko

  Uses the p5.2DAdventure.js class 
  
------------------------------------------------------------------------------------
	To use:
	Add this line to the index.html

  <script src="p5.2DAdventure.js"></script>
***********************************************************************************/

// adventure manager global  
var adventureManager;

// p5.play
var playerSprite;
var playerAnimation;

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects

//Global variables for mask game
var maskSprites = [];
var maskCollected = [];

// indexes into the clickable array (constants)
const playGameIndex = 0;
const restartGameIndex = 1;


// some globals we use throughout...
// var screamSound = null;
var numLives = 5;
var atariFont = null;

// Global variable for final instructions screen
var allMasksCollected = false;

// Allocate Adventure Manager with states table and interaction tables
function preload() {
  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');

  // font for drawing
  atariFont = loadFont('fonts/AtariClassic-Chunky.ttf');
}

// Setup the adventure manager
function setup() {
  createCanvas(1280, 720);

  // create mask sprites
        maskSprites[0] = createSprite(1200, 350, 150, 150);
        maskSprites[1] = createSprite(600, 445, 150, 150);
        maskSprites[2] = createSprite(200, 540, 150, 150);
        maskSprites[3] = createSprite(1100, 150, 150, 150);

        // add animation for each one...
  for( let i = 0; i < maskSprites.length; i++ ) {
        maskSprites[i].addAnimation('regular', 
        loadAnimation('assets/avatars/mask1.png', 'assets/avatars/mask3.png'));
        }

  // create happy sprites 
        happySprite = createSprite(600,445,400,160);

        happySprite.addAnimation('regular', loadAnimation('assets/avatars/happy1.png', 'assets/avatars/happy4.png'));
  
  // create sad sprites       

        sadSprite = createSprite(600,445,400,160);

        sadSprite.addAnimation('regular', loadAnimation('assets/avatars/sad.png', 'assets/avatars/sad2.png'));

   // set collected for masks to false
   for( let i = 0; i < maskSprites.length; i++ ) {
        maskCollected[i] = false;
        }

  // setup the clickables = this will allocate the array
  clickables = clickablesManager.setup();

  // create a sprite and add the 3 animations
  playerSprite = createSprite(width/2, height/2, 80, 80);

  // every animation needs a descriptor, since we aren't switching animations, this string value doesn't matter
  playerSprite.addAnimation('regular', loadAnimation('assets/avatars/sprite1.png', 'assets/avatars/sprite5.png'));
  

  // use this to track movement from toom to room in adventureManager.draw()
  adventureManager.setPlayerSprite(playerSprite);

  // this is optional but will manage turning visibility of buttons on/off
  // based on the state name in the clickableLayout
  adventureManager.setClickableManager(clickablesManager);

    // This will load the images, go through state and interation tables, etc
  adventureManager.setup();

  // call OUR function to setup additional information about the p5.clickables
  // that are not in the array 
  setupClickables(); 

  //adventureManager.changeState("Aha");
}

// Adventure manager handles it all!
function draw() {
  // draws background rooms and handles movement from one to another
  adventureManager.draw();

  // draw the p5.clickables, in front of the mazes but behind the sprites 
  clickablesManager.draw();

  // No avatar for Splash screen or Instructions screen
  if( adventureManager.getStateName() !== "Splash" && 
      adventureManager.getStateName() !== "Introduction" ) {
      
    // responds to keydowns
    moveSprite();

    // draw number of lives
    fill(255);
    textFont(atariFont);
    textSize(20);
    textAlign(LEFT);
    text( "Lives: " + numLives, width-350, 50);
    textAlign(RIGHT);
    text( "collected masks: " + countCollectedMasks() + "/4", width-850, 50 );

    // this is a function of p5.js, not of this sketch
    drawSprite(playerSprite);
  } 
}

function countCollectedMasks() {
        // count the collected masks

        let collectedMasks = 0;
        for( let i = 0; i < maskSprites.length; i++ ) {
           if( maskCollected[i] === true ) {
                  collectedMasks++;
           }
    }

    // check if masks have been collected 
   if(collectedMasks == 4 && allMasksCollected == false) {
      allMasksCollected = true
      window.alert("You've collected all masks! Deliver masks to the survivors in the hidden bunker!")
    }

    return collectedMasks;
}


function maskSprite1Collision() {
        window.alert("When you wear a mask, you protect others as well as yourself. Masks work best when everyone wears one!");
        maskCollected[0] = true;
}

function maskSprite2Collision() {
        window.alert("Masks should completely cover the nose and mouth and fit snugly against the sides of face without gaps.");
        maskCollected[1] = true;
}

function maskSprite3Collision() {
        window.alert("People age 2 and older should wear masks in public settings and when around people who don’t live in their household.​");
        maskCollected[2] = true;
}

function maskSprite4Collision() {
        window.alert("A mask is NOT a substitute for social distancing. Masks should still be worn in addition to staying at least 6 feet apart, especially when indoors around people who don’t live in your household.");
        maskCollected[3] = true;
}

// pass to adventure manager, this do the draw / undraw events
function keyPressed() {
  // toggle fullscreen mode
  if( key === 'f') {
    fs = fullscreen();
    fullscreen(!fs);
    return;
  }

  // dispatch key events for adventure manager to move from state to 
  // state or do special actions - this can be disabled for NPC conversations
  // or text entry   

  // dispatch to elsewhere
  adventureManager.keyPressed(key); 
}

function mouseReleased() {
  adventureManager.mouseReleased();
}

//-------------- YOUR SPRITE MOVEMENT CODE HERE  ---------------//
function moveSprite() {
  if(keyIsDown(RIGHT_ARROW))
    playerSprite.velocity.x = 10;
  else if(keyIsDown(LEFT_ARROW))
    playerSprite.velocity.x = -10;
  else
    playerSprite.velocity.x = 0;

  if(keyIsDown(DOWN_ARROW))
    playerSprite.velocity.y = 10;
  else if(keyIsDown(UP_ARROW))
    playerSprite.velocity.y = -10;
  else
    playerSprite.velocity.y = 0;
}

//-------------- CLICKABLE CODE  ---------------//

function setupClickables() {
  // All clickables to have same effects
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;
    clickables[i].onPress = clickableButtonPressed;
  }
}

// tint when mouse is over
clickableButtonHover = function () {
  this.color = "#AA33AA";
  this.noTint = false;
  this.tint = "#FF0000";
}

// color a light gray if off
clickableButtonOnOutside = function () {
  // backto our gray color
  this.color = "#AAAAAA";
}

clickableButtonPressed = function() {
  // these clickables are ones that change your state
  // so they route to the adventure manager to do this
   
  if( !checkWeirdNPCButtons(this.id) ) {
    // route to adventure manager unless you are on weird NPC screne
    adventureManager.clickablePressed(this.name);
  }
  
  // restart game with max lives
  // if( this.name === "Restart" ) {
  //   numLives = 5;
  // }

  
}

// gets called when player dies, screen and teleport back to start
// OR if you are out of lives, just dead...
function die() {
  numLives--;
  if( numLives > 0 )  {
    adventureManager.changeState("Home");
  }
  else {
    adventureManager.changeState("Home");
  }
}


//SUBCLASSES//


// Instructions screen has a backgrounnd image, loaded from the adventureStates table
// It is sublcassed from PNGRoom, which means all the loading, unloading and drawing of that
// class can be used. We call super() to call the super class's function as needed
class InstructionsScreen extends PNGRoom {
  // preload is where we define OUR variables
  preload() {
    // These are out variables in the InstructionsScreen class
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*4; 

    // hard-coded, but this could be loaded from a file if we wanted to be more elegant
    this.instructionsText = "Find WEIRDY who has a logic problem for you to solve, but first, make it past the CORONAVIRUS room";
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
    // tint down background image so text is more readable
    tint(128);
      
    // this calls PNGRoom.draw()
    super.draw();
      
    // text draw settings
    fill(255);
    textAlign(CENTER);
    textSize(30);

    // Draw text in a box
    text(this.instructionsText, width/6, height/6, this.textBoxWidth, this.textBoxHeight );
  }
}


class MaskRoom1 extends PNGRoom {
  draw() {
    super.draw();
    if (maskCollected[0] === false) {
     drawSprite(maskSprites[0]);
    playerSprite.overlap(maskSprites[0], maskSprite1Collision);
    }
  }
}

class MaskRoom2 extends PNGRoom {
  draw() {
    super.draw();
    if (maskCollected[1] === false) {
     drawSprite(maskSprites[1]);
    playerSprite.overlap(maskSprites[1], maskSprite2Collision);
    }
  }
}

class MaskRoom3 extends PNGRoom {

preload() {
     // load the animation just one time
    this.NPCAnimation = loadAnimation('assets/NPCs/virus1.png', 'assets/NPCs/virus4.png');
    
    // this is a type from p5play, so we can do operations on all sprites
    // at once
    this.NPCgroup = new Group;

    // change this number for more or less
    this.numNPCs = 30;

    // is an array of sprites, note we keep this array because
    // later I will add movement to all of them
    this.NPCSprites = [];

    // this will place them randomly in the room
    for( let i = 0; i < this.numNPCs; i++ ) {
      // random x and random y poisiton for each sprite
      let randX  = random(100, width-100);
      let randY = random(100, height-100);

      // create the sprite
      this.NPCSprites[i] = createSprite( randX, randY, 40, 40);
    
      // add the animation to it (important to load the animation just one time)
      this.NPCSprites[i].addAnimation('regular', this.NPCAnimation );

      // add to the group
      this.NPCgroup.add(this.NPCSprites[i]);
    }

    print("DeepThoughtsRoom");
  }

  draw() {
    super.draw();

    if (maskCollected[2] === false) {
     drawSprite(maskSprites[2]);
    playerSprite.overlap(maskSprites[2], maskSprite3Collision);
    }

    this.NPCgroup.draw();

    // checks for overlap with ANY sprite in the group, if this happens
    // our die() function gets called
    playerSprite.overlap(this.NPCgroup, die);

    for( let i = 0; i < this.NPCSprites.length; i++ ) {
      this.NPCSprites[i].velocity.x = random(-1,1);
      this.NPCSprites[i].velocity.y = random(-1,1);
    

    }
  }
}

class MaskRoom4 extends PNGRoom {

  preload() {
     // load the animation just one time
    this.NPCAnimation = loadAnimation('assets/NPCs/virus1.png', 'assets/NPCs/virus4.png');
    
    // this is a type from p5play, so we can do operations on all sprites
    // at once
    this.NPCgroup = new Group;

    // change this number for more or less
    this.numNPCs = 30;

    // is an array of sprites, note we keep this array because
    // later I will add movement to all of them
    this.NPCSprites = [];

    // this will place them randomly in the room
    for( let i = 0; i < this.numNPCs; i++ ) {
      // random x and random y poisiton for each sprite
      let randX  = random(100, width-100);
      let randY = random(100, height-100);

      // create the sprite
      this.NPCSprites[i] = createSprite( randX, randY, 40, 40);
    
      // add the animation to it (important to load the animation just one time)
      this.NPCSprites[i].addAnimation('regular', this.NPCAnimation );

      // add to the group
      this.NPCgroup.add(this.NPCSprites[i]);
    }
  }

  draw() {
    super.draw();
    if (maskCollected[3] === false) {
     drawSprite(maskSprites[3]);
    playerSprite.overlap(maskSprites[3], maskSprite4Collision);
    }

        this.NPCgroup.draw();

    // checks for overlap with ANY sprite in the group, if this happens
    // our die() function gets called
    playerSprite.overlap(this.NPCgroup, die);

    for( let i = 0; i < this.NPCSprites.length; i++ ) {
      this.NPCSprites[i].velocity.x = random(-1,1);
      this.NPCSprites[i].velocity.y = random(-1,1);

    }
  }
}

class FinalRoom extends PNGRoom {
    draw() {
    super.draw();
    if (allMasksCollected === true) {
      drawSprite(happySprite);
    }
    else {
      drawSprite(sadSprite);
    }
  }
}


