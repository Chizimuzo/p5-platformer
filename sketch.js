/*
- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/
*/

/*//////// COMMENT: EXPLANATION OF MY CODE //////////

(1.)////EXTENTIONS.
-EsLint

(2.)////BITS I FOUND DIFFICULT.
a.)fixing my canyon, this was difficult for me at some point, 
trying to get the right placement when testing falling down the canyon,
same situation for the collectable too but it was much easier than the canyon,
cause of the tutorial video.

                    IT DOESN'T affect the game !
b.)creating my own Function for preventing me from going beyond the game,
i'm still finding it difficult to be honest, i was thinking of removing it,
totally from the code, cause the game is good either way, but i won't improve my coding skills if i don't tackelt the matter, so it's complete, but i'm certain i'll find the solution. 

3.)/////SKILLS I LEARNT.
a.)i learnt the dist function
b.)constructor function
c.)nested iteration
d.)and using the "this:", by making objects in the function refer to themselves, 

*/



var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var collectables;
var canyons;
var trees_x;
var clouds;
var mountains;
 
var game_score;
var flagpole;
var lives;
var gameState; // 'playing', 'gameover', or 'complete'
var lifeTokens_x;
var lifeTokens_y;

var gameoverSound;
var coinSound;
var levelcompleteSound;
var fallSound;
var jumpSound;

var platforms;
var enemies;
var outOfReach;

function preload()
{
    soundFormats('mp3','wav','ogg'); //load your sounds here
    
	fallSound = loadSound('assets/fall2.wav');
	fallSound.setVolume(0.1);
	
	gameoverSound = loadSound('assets/gameover.wav');
	gameoverSound.setVolume(0.1);
	
	coinSound = loadSound('assets/coin.wav');
	coinSound.setVolume(0.1);
	
	levelcompleteSound = loadSound('assets/complete.ogg');
	levelcompleteSound.setVolume(0.1);
	
	jumpSound = loadSound('assets/jump.wav');
	jumpSound.setVolume(0.2); 
}

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
	lives = 3;
	gameState = 'playing';
	startGame();
}

function draw()
{
	//background(135,206,235);
   background(100, 155, 255); // fill the sky blue.
	drawBackGround(); // draw back ground.
	noStroke();
/*1*/push();
/*1*/translate(scrollPos,0);
	drawGreenGround(); // draw green ground.
/*2*/push();
    translate(scrollPos,0);
    drawClouds(); // draw clouds.
/*2*/pop();
    drawMountains(); // draw mountains.
    drawTrees(); // draw trees.
	
	cantReach();
	
	for(var i=0; i<platforms.length; i++) //draw platforms.
	{
		platforms[i].draw();
	}
    for(var i=0; i<canyons.length; i++) // draw canyons.
    {
		drawCanyon(canyons[i]);
		if(gameChar_world_x > canyons[i].x_pos+41 
		   && gameChar_world_x < canyons[i].x_pos + canyons[i].width+120 
		   && gameChar_y >= floorPos_y-10)
		{
			checkCanyon(canyons[i]);
			console.log("Is Plummenting");
        	isPlummeting = true;
		}
		else if(isPlummeting == true)
		{
			gameChar_y += 0.5;
		}
    }	
	for(var i=0; i<collectables.length; i++) // draw collectables.
    {
        if(!collectables[i].isFound)
        {
           	drawCollectable(collectables[i]);
			checkCollectable(collectables[i]);
        }
    }
	renderFlagpole();
/*1*/pop();
        
///// Draw game character.//////////////////////////
    stroke(50);
	drawGameChar();
	
///// Display "Coins:" when collecting coins.///////
	fill(0);
	noStroke();
	textSize(36);
	textFont("Tahoma");
	text("coins: " + game_score, 20, 50);

//// The Canyon is after the game character so when,
//// it falls down into the canyon it gives the, 
//// illusion of it enteting the water!.
	
/*3*/push();
/*3*/translate(scrollPos,0);
//// A copy of my canyon code to give the illusion,
//// of the game character falling directly inside.
	
	for(var i=0; i<canyons.length; i++) // draw canyons.
    {
		drawCanyon(canyons[i]);
		if(gameChar_world_x > canyons[i].x_pos + 41 
		   && gameChar_world_x < canyons[i].x_pos + canyons[i].width+120 
		   && gameChar_y >= floorPos_y)
		{
			checkCanyon(canyons[i]);
			console.log("Is Plummenting"); 
        	isPlummeting = true;
		}
		else if(isPlummeting == true)
		{
			gameChar_y += 0.5;
		}
    }
/*3*/pop();
	
//// Displays "Game over, press retry
//// to continue.",when lives finish. 
	if(gameState == 'gameover')
	{	
		noStroke();
		fill(255);
/*4*/	push();
		textAlign(CENTER);
		textSize(45);
		textFont("Tahoma");
		text("Game over, Press R or Click to Retry.", width/2, height/2);
/*4*/	pop();
		return;
	}
	
///// Level complete, Press retry,
//// to continue when flagpole.isReached is true.	
	if(gameState == 'complete')
	{
		noStroke();
		fill(245,255,250);
/*5*/	push();
		textAlign(CENTER);
		textSize(30);
		textFont("Tahoma");
		textAlign(CENTER, BASELINE);
		text('LEVEL', width/2, height/2);
		textAlign(CENTER, BOTTOM);
		text('COMPLETE',width/2, height/2 +30);
		textFont("Tahoma");
		textSize(20);
		text('Press R or click to retry.', width/2, height/2 + 50);
/*5*/	pop();
		return;
	}
	
///// Logic to make the game character move or the background scroll.
	if(isLeft && gameChar_world_x > outOfReach.x_pos + 20) //moving to the left, stopped by the boundary.
	{
		if(gameChar_x > width * 0.2){
			gameChar_x -= 4;
		}
		else{
			scrollPos += 5;
		}
	}
	if(isRight) //moving to the right.
	{
		if(gameChar_x < width * 0.8){
			gameChar_x  += 4;
		}
		else{	// negative for moving against the background.
			scrollPos -= 5;		
		}
	}
	
	///////////////// OlD CODE, "i don't want to get rid of it" /////////////
/*	if(isFalling == true){ //falling into the canyon.
        gameChar_y -= 2;}
    else if(gameChar_y < floorPos_y){
        gameChar_y += 2;
        isPlummeting = false;} */ 

	///////////////////////////// TESTING = new code! //////////////////////
	if(isFalling == true){ //falling down the canyon.
		gameChar_y -= 2;
    }
    else if(gameChar_y < floorPos_y)
	{
		var isContact = false; //making the platforms active.
        for(var i=0; i<platforms.length; i++)
		{
			if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true)
			{
				isContact = true;
				break;
			}}
		if(isContact == false)
		{
			gameChar_y += 2;
			isFalling = false;
		}}
	
	if(isPlummeting){
		gameChar_y += 3;
	}
	
	if(flagpole.isReached == false) // for thr flag.
	{
		checkFlagpole();
	}
	
	if(outOfReach.isReached == false) // for the left boundary.
	{
		checkCantReach();
	}
	
/*6*/push();
/*6*/translate(scrollPos,0);	
	for(var i=0; i<enemies.length; i++) //making the enemies active.
		{
			enemies[i].draw();
			console.log(enemies[i]);
			
			var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);
			if(isContact)
			{
				lives -= 1;
				if(lives > 0){
					startGame();
					break;
				}
				else{
					gameState = 'gameover';
					break;
				}}}
/*6*/pop();
	checkPlayerDie();
	
///// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}
// ---------------------
// Key control functions
// ---------------------
function keyPressed() //"key"=keyboard.
{
    if(keyCode == 82 && (gameState == 'gameover' || gameState == 'complete')) // R key retries.
    {
       retryGame();
       return;
    }
    if(keyCode == 37)
    {
       console.log("left arrow");
       isLeft = true; 
	}
    if(keyCode == 39)
    {
       console.log("right arrow");
       isRight = true;
    }
    else if(keyCode == 38)
    {
       console.log("up arrow");
       isFalling = true;
    }
}

function keyReleased()
{       
    if(keyCode == 37)
    {
       console.log("left arrow");
       isLeft = false;
    }
    if(keyCode == 39)
    {
       console.log("right arrow");
       isRight = false; 
    }
    else if(keyCode == 38)
    {
       console.log("up arrow");
       isFalling = false;
    }
}

// ------------------------------
// Back ground render function
// ------------------------------
function drawBackGround()
{
	fill(95,158,160);
	rect(0,floorPos_y+50, width, height-650);
	fill(95,158,160);
	triangle(0,floorPos_y-20, 80,floorPos_y-20, 40,floorPos_y-40);
	triangle(90,floorPos_y-20, 170,floorPos_y-20, 130,floorPos_y - 40);
	triangle(170,floorPos_y - 20, 260,floorPos_y-20, 220,floorPos_y - 40);
	triangle(260,floorPos_y - 20, 350,floorPos_y-20, 310,floorPos_y - 40);
	triangle(350,floorPos_y - 20, 440,floorPos_y-20, 400,floorPos_y - 40);
	triangle(440,floorPos_y - 20, 530,floorPos_y-20, 490,floorPos_y - 40);
	triangle(530,floorPos_y - 20, 620,floorPos_y-20, 580,floorPos_y - 40);
	triangle(620,floorPos_y - 20, 710,floorPos_y-20, 670,floorPos_y - 40);
	triangle(710,floorPos_y - 20, 800,floorPos_y-20, 760,floorPos_y - 40);
	triangle(800,floorPos_y - 20, 890,floorPos_y-20, 850,floorPos_y - 40);
	triangle(890,floorPos_y - 20, 980,floorPos_y-20, 940,floorPos_y - 40);
	triangle(980,floorPos_y - 20, 1070,floorPos_y-20, 1030,floorPos_y - 40);
	
}

// ------------------------------
// Green ground render function
// ------------------------------
function drawGreenGround()
{
	fill(0,155,0);
	rect(-1920, floorPos_y, width+30, height/4); // 1st green ground.
	rect(-680, floorPos_y, width-200, height/4); // 2nd green ground.
    rect(+362, floorPos_y, width-90, height/4); // 3rd green ground. 
    rect(+1510, floorPos_y, width-100, height/4); // 4th green ground.
    rect(+2655, floorPos_y, width+550, height/4); // 5th green ground.
}

// ------------------------------
// Game character render function
// ------------------------------
function drawGameChar() // Function to draw the game character.
{   
	if(isLeft && isFalling) // jumping-left code
	{   
		fill(255,222,173);//left hand 
		rect(gameChar_x - 3,
			 gameChar_y - 85, 7, 25, 100);
		
		fill(255,222,173);//head
		ellipse(gameChar_x + 2.5,
				gameChar_y - 64, 25);
		
		fill(255,127,80);//body
		rect(gameChar_x - 5 ,
			 gameChar_y - 52, 15, 27, 2);
		
		fill(255,222,173);//right hand
		rect(gameChar_x + 1,
			 gameChar_y - 75, 7, 25, 100);
		
		fill(64,64,64);//left leg
		quad(gameChar_x - 7,gameChar_y - 9, //left bottom
			 gameChar_x - 4, gameChar_y - 24.5, //left top
			 gameChar_x + 2, gameChar_y - 24.5, //right top
			 gameChar_x - 2, gameChar_y - 9 ); //right bottom
		
		fill(264,264,264);//left shoe
		quad(gameChar_x - 9,gameChar_y - 6, //left bottom
			 gameChar_x - 7, gameChar_y - 9, //left top
			 gameChar_x - 2, gameChar_y - 9, //right top
			 gameChar_x - 2.5, gameChar_y - 6 ); //right bottom
		
		fill(64,64,64);//right leg
		quad(gameChar_x + 10.5,gameChar_y - 3, //left bottom
			 gameChar_x + 4.5, gameChar_y - 24.5, //left top
			 gameChar_x + 10, gameChar_y - 24.5, //right top
			 gameChar_x + 15.5, gameChar_y - 5 ); //right bottom
		
		fill(264,624,264);//right shoe
		quad(gameChar_x + 9,gameChar_y - 2, //left bottom
			 gameChar_x + 10, gameChar_y - 6, //left top
			 gameChar_x + 15, gameChar_y - 8, //right top
			 gameChar_x + 16, gameChar_y - 5 ); //right bottom
	}
	else if(isRight && isFalling) // jumping-right code
	{	
		fill(255,222,173);//left hand
		rect(gameChar_x + 2,
			 gameChar_y - 85, 7, 25, 100);
		
		fill(255,222,173);//head
		ellipse(gameChar_x + 2.5,
				gameChar_y - 64, 25);
		
		fill(255,127,80);//body
		rect(gameChar_x - 5 ,
			 gameChar_y - 52, 15, 27, 2);
		
		fill(255,222,173);//right hand
		rect(gameChar_x - 3,
			 gameChar_y - 75, 7, 25, 100);
		
		fill(64,64,64);//left leg
		quad(gameChar_x - 12,gameChar_y - 4, //left bottom
			 gameChar_x - 4, gameChar_y - 24.5, //left top
			 gameChar_x + 2, gameChar_y - 24.5, //right top
			 gameChar_x - 7, gameChar_y - 2 );//right bottom
		
		fill(264,264,264);//left shoe
		quad(gameChar_x - 12,gameChar_y - 4, //left bottom
			 gameChar_x - 10, gameChar_y - 7, //left top
			 gameChar_x - 6, gameChar_y - 5, //right top
			 gameChar_x - 6, gameChar_y - 1 );//right bottom
		
		fill(64,64,64);//right leg
		quad(gameChar_x + 7,gameChar_y - 9, //left bottom
			 gameChar_x + 5, gameChar_y - 24.5, //left top
			 gameChar_x + 10, gameChar_y - 24.5, //right top
			 gameChar_x + 13, gameChar_y - 9 );//right bottom
		
		fill(264,624,264);//right shoe
		quad(gameChar_x + 7,gameChar_y - 6, //left bottom
			 gameChar_x + 7, gameChar_y - 9, //left top
			 gameChar_x + 12.7, gameChar_y - 9, //right top
			 gameChar_x + 14, gameChar_y - 6 );//right bottom
	}
	else if(isLeft) //walking left code
	{	
		fill(64,64,64)//left leg
		quad(gameChar_x - 9,gameChar_y , //left bottom
			 gameChar_x - 4.5, gameChar_y - 20, //left top
			 gameChar_x + 1 , gameChar_y - 20, //right top
			 gameChar_x - 3, gameChar_y );//right bottom
		
		fill(64,64,64);//right leg
		quad
			(gameChar_x + 11, gameChar_y - 2, //left bottom
			 gameChar_x + 4.5, gameChar_y - 20, //left top
			 gameChar_x + 10, gameChar_y - 20, //right top
			 gameChar_x + 16, gameChar_y - 4 );//right bottom
		
		fill(264,264,264);//left shoe
		quad(gameChar_x - 10,gameChar_y, //left bottom
			 gameChar_x - 8, gameChar_y - 3, //left top
			 gameChar_x - 2.5, gameChar_y - 3, //right top
			 gameChar_x - 3.5, gameChar_y );//right bottom
		 
		fill(264,624,264);//right shoe
		quad(gameChar_x + 9,gameChar_y - 1, //left bottom
			 gameChar_x + 10, gameChar_y - 5, //left top
			 gameChar_x + 15, gameChar_y - 7, //right top
			 gameChar_x + 16, gameChar_y - 4 );//right bottom
		
		fill(255,127,80);//body
		rect(gameChar_x - 5,
			 gameChar_y - 52, 15, 32, 2);  
		
		fill(255,222,173);//right hand
		rect(gameChar_x - 1,
			 gameChar_y - 51, 7, 25, 100);
		
		fill(255,222,173);//head
		ellipse(gameChar_x + 2.5,
				gameChar_y - 8 - 54, 25);
	}
	else if(isRight)// walking right code
	{	
		//left leg
		fill(64,64,64);
		quad(gameChar_x - 12,gameChar_y - 4, //left bottom
			 gameChar_x - 4, gameChar_y - 20, //left top
			 gameChar_x + 2, gameChar_y - 20, //right top
			 gameChar_x - 7, gameChar_y - 2 );//right bottom
		//left shoe
		fill(264,264,264);
		quad(gameChar_x - 12,gameChar_y - 4, //left bottom
			 gameChar_x - 10, gameChar_y - 7, //left top
			 gameChar_x - 6, gameChar_y - 5, //right top
			 gameChar_x - 6, gameChar_y - 1 ); //right bottom
		//right leg
		fill(64,64,64);
		quad(gameChar_x + 7,gameChar_y, //left bottom
			 gameChar_x + 5, gameChar_y - 20, //left top
			 gameChar_x + 10, gameChar_y - 20, //right top
			 gameChar_x + 13, gameChar_y ); //right bottom
		//right shoe
		fill(264,624,264);
		quad(gameChar_x + 7,gameChar_y, //left bottom
			 gameChar_x + 7, gameChar_y - 3, //left top
			 gameChar_x + 12.7, gameChar_y - 3, //right top
			 gameChar_x + 14, gameChar_y ); //right bottom
		//body
		fill(255,127,80);
		rect(gameChar_x - 5,
			 gameChar_y - 52, 15, 32, 2);
		//right hand
		fill(255,222,173);
		rect(gameChar_x - 1,
			 gameChar_y - 51, 7, 25, 100);
		//head
		fill(255,222,173);
		ellipse(gameChar_x + 2.5,
				gameChar_y - 8 - 54, 25);
	}
	else if(isFalling || isPlummeting)// jumping facing forwards code
	{	
		//left feet
		fill(64,64,64);
		rect(gameChar_x - 8.5,
			 gameChar_y - 30, 7, 21);
		//left shoe
		fill(264,264,264);
		rect(gameChar_x - 8.5,
			 gameChar_y - 13, 7, 4);
		//right feet
		fill(64,64,64);
		rect(gameChar_x + 6.5,
			 gameChar_y - 30, 7, 21);
		//right shoe
		fill(264,264,264);
		rect(gameChar_x + 6.5,
			 gameChar_y - 13, 7, 4);
		//body
		fill(255,127,80);
		rect(gameChar_x - 9.2,
			 gameChar_y - 65, 23, 35, 2);
		//left hand
		fill(255,222,173);
		rect(gameChar_x - 14.5,
			 gameChar_y - 80, 7, 25, 100);
		//right hand
		fill(255,222,173);
		rect(gameChar_x + 11.5,
			 gameChar_y - 80, 7, 25, 100);
		//head
		fill(255,222,173);
		ellipse(gameChar_x + 2.5,
				gameChar_y - 64, 25);
	}
	else // standing front facing code
	{	
		//left leg
		fill(64,64,64);
		rect(gameChar_x - 9.5,
			 gameChar_y - 22.5, 6, 21);
		//right leg
		fill(64,64,64);
		rect(gameChar_x + 3,
			 gameChar_y - 22.5, 6, 21);
		//body
		fill(255,127,80);
		rect(gameChar_x - 10.1,
			 gameChar_y - 49, 20, 28, 2);
		//left hand
		fill(255,222,173);
		rect(gameChar_x - 14.9,
			 gameChar_y - 48, 7, 25, 100);
		//right hand
		fill(255,222,173);
		rect(gameChar_x + 7.5,
			 gameChar_y - 48, 7, 25, 100);
		//head
		fill(255,222,173);
		ellipse(gameChar_x + 0.3,
				gameChar_y + 3 - 60, 25); 
	}
}

// ---------------------------
// Background render functions
// ---------------------------
function drawClouds() // Function to draw cloud objects.
{
    for(var i = 0; i < clouds.length; i++)
    {
        //black 1st 
        fill(245, 245, 245);
        ellipse(clouds[i].x_pos + 65, clouds[i].y_pos - 5,
                clouds[i].size + 60 * cloudScale, clouds[i].size2 - 10 * cloudScale);
        //yellow 2nd
        fill(245, 245, 245);
        ellipse(clouds[i].x_pos + 136, clouds[i].y_pos - 10,
                clouds[i].size + 90 * cloudScale, clouds[i].size2 + 20 * cloudScale);
        //green 3rd
        fill(245, 245, 245);
        ellipse(clouds[i].x_pos + 60, clouds[i].y_pos + 35,
                clouds[i].size + 190 * cloudScale, clouds[i].size2 + 30 * cloudScale);
        //blue 4th
        fill(245, 245, 245);
        ellipse(clouds[i].x_pos + 140, clouds[i].y_pos + 43,
                clouds[i].size + 58 * cloudScale, clouds[i].size2 + 20 * cloudScale);
        //purple 5th
        fill(245, 245, 245);
        ellipse(clouds[i].x_pos + 190, clouds[i].y_pos + 25,
                clouds[i].size + 110 * cloudScale, clouds[i].size2 + 20 * cloudScale);
  	}
}

function drawMountains() // Function to draw mountains objects.
{
    for(var i = 0 ; i < mountains.length; i++)
    {
        //Second mountain
        fill(190,200,200);           
        triangle(mountains[i].x_pos + 80, mountains[i].y_pos - 200, //top
                 mountains[i].x_pos - 70, mountains[i].y_pos + 142, //left
                 mountains[i].x_pos + 250, mountains[i].y_pos + 142); //right 
        //shadow
        fill(160,170,170);
        triangle(mountains[i].x_pos + 80, mountains[i].y_pos - 200, //top
                 mountains[i].x_pos + 210, mountains[i].y_pos + 142, //left
                 mountains[i].x_pos + 250, mountains[i].y_pos + 142); //right
        //First mountains
        fill(200,215,215);
        triangle(mountains[i].x_pos - 50, mountains[i].y_pos - 75, //top
                 mountains[i].x_pos - 150, mountains[i].y_pos + 142, //left
                 mountains[i].x_pos + 40, mountains[i].y_pos + 142); //right 
        //shadow
        fill(180,190,190);
        triangle(mountains[i].x_pos - 50, mountains[i].y_pos - 75, //top
                 mountains[i].x_pos + 15, mountains[i].y_pos + 142, //left
                 mountains[i].x_pos + 40, mountains[i].y_pos + 142); //right
        //Third mountains
        fill(180,190,190);
        triangle(mountains[i].x_pos + 210, mountains[i].y_pos - 155, //top
                 mountains[i].x_pos + 55, mountains[i].y_pos + 142, //left
                 mountains[i].x_pos + 365, mountains[i].y_pos + 142); //right 
        //shadow
        fill(150,160,160);
        triangle(mountains[i].x_pos + 210, mountains[i].y_pos - 155, //top
                 mountains[i].x_pos + 339, mountains[i].y_pos + 142, //left
                 mountains[i].x_pos + 365, mountains[i].y_pos + 142); //right
    }
}

function drawTrees() // Function to draw trees objects.
{
     for(var i = 0; i < trees_x.length; i++)
    {
        //trunk
        fill(100,60,20);
        rect(trees_x[i] + 238, floorPos_y - 40, 30, 53);   
        //trunk shadow
        fill(10,120,10);
        quad(trees_x[i] + 238, floorPos_y + 13, //left top
             trees_x[i] + 268, floorPos_y + 13, //right top
             trees_x[i] + 398, floorPos_y + 55, //right bottom
             trees_x[i] + 368, floorPos_y + 55); //left bottom
        // 1st branch shadow
        fill(10,120,10);
        triangle(trees_x[i] + 373, floorPos_y + 24, //top   
                 trees_x[i] + 320, floorPos_y + 66, //left   
                 trees_x[i] + 413, floorPos_y + 75); //right
        // 2nd branch shadow
        fill(10,120,10);
        triangle(trees_x[i] + 358, floorPos_y + 18, //top   
                 trees_x[i] + 306, floorPos_y + 56, //left   
                 trees_x[i] + 389, floorPos_y + 59); //right
        // 3rd branch shadow
        fill(10,120,10);
        triangle(trees_x[i] + 343, floorPos_y + 9, //top   
                 trees_x[i] + 290, floorPos_y + 47, //left   
                 trees_x[i] + 370, floorPos_y + 48); //right
        //three branches   
        //3rd layer
        fill(34, 159, 34);
        triangle(trees_x[i] + 253, floorPos_y - 100, //top 
                 trees_x[i] + 213, floorPos_y - 20, //left
                 trees_x[i] + 297, floorPos_y - 20); //right
        // 3rd layer shadow
        fill(0, 100, 0);
        triangle(trees_x[i] + 253, floorPos_y - 100, //top 
                 trees_x[i] + 278, floorPos_y - 20, //left
                 trees_x[i] + 297, floorPos_y - 20); //right
        //2nd layer
        fill(34, 159, 34);
        triangle(trees_x[i] + 253, floorPos_y - 120, //top 
                 trees_x[i] + 215, floorPos_y - 45, //left
                 trees_x[i] + 295, floorPos_y - 45); //right
        //2nd layer shadow
        fill(0, 100, 0);
        triangle(trees_x[i] + 253, floorPos_y - 120, //top 
                 trees_x[i] + 278, floorPos_y - 45, //left
                 trees_x[i] + 295, floorPos_y - 45); //right
        //1st layer
        fill(34, 159, 34);
        triangle(trees_x[i] + 253, floorPos_y - 140, //top 
                 trees_x[i] + 217, floorPos_y - 70, //left
                 trees_x[i] + 292, floorPos_y - 70); //right
        //1st layer shadow
        fill(0,100,0,250);
        triangle(trees_x[i] + 253, floorPos_y - 140, //top 
                 trees_x[i] + 276, floorPos_y - 70, //left
                 trees_x[i] + 292, floorPos_y - 70); //right
    }
}
// ---------------------------------
// Canyon render and check functions
// ---------------------------------
function drawCanyon(t_canyon)// Function to draw canyon objects.
{	
	//brown 
    fill(102,51,0);
    quad(t_canyon.x_pos + 220, t_canyon.width + 332, //left top
         t_canyon.x_pos + 275, t_canyon.width + 389, //right top
         t_canyon.x_pos + 370, t_canyon.width + 500, //right bottom
         t_canyon.x_pos + 220, t_canyon.width + 500); //left bottom
    //green
    fill(0,155,0);
    //quad(40,432, 83,489, 160,590, 40,600);
     quad(t_canyon.x_pos + 0, t_canyon.width + 332, //left top
          t_canyon.x_pos + 38, t_canyon.width + 332, //right top
          t_canyon.x_pos + 160, t_canyon.width + 500, //right bottom
          t_canyon.x_pos + 0, t_canyon.width + 500); //left bottom
 
	//blue(water)
    fill(70,130,180, 235);
    //quad(78,482, 219,482, 336,616, 150,576);
     quad(t_canyon.x_pos + 74, t_canyon.width + 382, //left top
          t_canyon.x_pos + 219, t_canyon.width + 382, //right top
          t_canyon.x_pos + 336, t_canyon.width + 514, //right bottom
          t_canyon.x_pos + 170, t_canyon.width + 514); //left bottom
}

function checkCanyon(t_canyon)// Function to check character is over a canyon.
{
	if(!t_canyon.isFound)
	{
		fallSound.play();
	}
	t_canyon.isFound = true;
}

// --------------------------------------------
// Collectable items render and check functions
// --------------------------------------------
function drawCollectable(t_collectable)// Function to draw collectable objects.
{
    noStroke();
    //outer circle
    fill(235,195,0);
    //ellipse(320, 460, 50, 50);
    ellipse(t_collectable.x_pos,
			t_collectable.y_pos,
			t_collectable.size);

    //inner circle
    fill(255,215,0);
    //ellipse(320, 460, 43, 43);
    ellipse(t_collectable.x_pos,
			t_collectable.y_pos,
			t_collectable.size-10);
}

function checkCollectable(t_collectable)// Function to check character has collected an item.
{
   	if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) <t_collectable.size2)
	{
		t_collectable.isFound = true;
		console.log('yay');
		game_score += 1;
		coinSound.play();
	}	
}

function renderFlagpole()// funtion to draw the flagpole.
{
/*7*/push();
	strokeWeight(5);
	stroke(240,230,140);
	line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y -250);
	fill(250, 100, 100);
	noStroke();
	
	if(flagpole.isReached)
	{
		rect(flagpole.x_pos,
			 floorPos_y -250, 70, 50);
	}
	else
	{
		rect(flagpole.x_pos,
			 floorPos_y -50, 70, 50);
	}
/*7*/pop();
}

function checkFlagpole()// function to check is flagpole has been reached.
{
	var d = abs(gameChar_world_x - flagpole.x_pos);
	if(d<15)
	{
		flagpole.isReached = true;
		gameState = 'complete';
		levelcompleteSound.play();
	}
}

function cantReach()
{
/*8*/push();
	stroke(180);
	fill(234,70,185,100);
	rect(outOfReach.x_pos, 0, 300, floorPos_y+200);
	fill(250, 100, 100);
	noStroke();
/*8*/pop();
}

function checkCantReach()
{
	var d = abs(gameChar_world_x - outOfReach.x_pos);
	if(d<15)
	{
		outOfReach.isReached = true;
	}
}

function checkPlayerDie()// function to reduce lives when,
{						 // game character falls into the canyon.
	if(gameChar_y > height)
	{
		lives -= 1;
		if(lives > 0)
		{
			startGame();
		}
		else
		{
			gameState = 'gameover';
		}
	}
	for(var i=0; i<lives; i++)//draw Life Tokens
	{
		lifeTokens_x = 780;
		lifeTokens_y = 92;
		fill(255,222,173);
		ellipse(lifeTokens_x + i*90,
				lifeTokens_y - 64, 25);
/*9*/   push(); 
		//life body
		fill(255,127,80);
		rect(lifeTokens_x + i*90-7,
			 lifeTokens_y - 52, 15, 20, 2);
/*9*/	pop();
	}
}

function createPlatforms(x,y,length)//function to create Platforms
{
	var p = {
		x:x,
		y:y,
		length:length,
		draw: function() // draw platforms
		{
			fill(85,107,47);
			rect(this.x, this.y, this.length, 20,10);
	    },
	checkContact: function(gc_x, gc_y)
	{
		if(gc_x>this.x && gc_x<this.x + this.length)
		{
			var d = this.y - gc_y;
			if(d >= 0 && d < 2)
			{
				return true;
			}
		}
		return false;
	}
 }
	return p;
}

function Enemy(x, y, range)
{
	this.x = x;
	this.y = y;
	this.range = range;
	
	this.currentX = x;
	this.inc = 1;
	
	this.update = function()
	{
		this.currentX += this.inc;
		
		if(this.currentX >= this.x + this.range )
		{
			this.inc = -1;
		}
		else if(this.currentX < this.x)
		{
			this.inc = 1;
		}}
	
	this.draw = function()
	{
		this.update();
		
		stroke(1);	
		fill(255,140,0);
		ellipse(this.currentX+0.3, this.y-20, 45, 45);

		fill(154,205,50);//inside head
		rect(this.currentX-16,this.y-30, 32,23, 5);

		//eyes
		fill(255);
		ellipse(this.currentX-7, this.y-22, 8,8); //left eye
		fill(255);
		ellipse(this.currentX+7, this.y-22, 8,8); //right eye
		fill(255);
		ellipse(this.currentX, this.y-30, 8,8); //third eye
		
		//mouth
		line(this.currentX+8,this.y-14,
			 this.currentX+8, this.y-12);
		line(this.currentX+4,this.y-14,
			 this.currentX+4, this.y-12);
		line(this.currentX,this.y-14,
			 this.currentX, this.y-12);
		line(this.currentX-4,this.y-14,
			 this.currentX-4, this.y-12);
		line(this.currentX-8,this.y-14,
			 this.currentX-8, this.y-12);	
	}
	
	this.checkContact = function(gc_x, gc_y)
	{
		var d = dist(gc_x, gc_y, this.currentX, this.y)
		console.log(d);
		if(d < 40)
		{
			return true;
		}
		return false;
	}
	    jumpSound.play();
}

function retryGame() // resets lives and restarts the level from gameover or complete.
{
	lives = 3;
	gameState = 'playing';
	startGame();
}

function mousePressed() // click to retry when gameover or complete.
{
	if(gameState == 'gameover' || gameState == 'complete')
	{
		retryGame();
	}
}

function startGame()
{
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
	
// Variable to control the background scrolling.
	scrollPos = 0;

// Variable to store the real position of the gameChar in the game
// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
	
// Initialise arrays of scenery objects.
    trees_x = [-300, 200, 1350, 3420];
    
    collectables = [{x_pos:-600, y_pos:floorPos_y, size:40, size2:40, isFound:false},
                    {x_pos:80, y_pos:floorPos_y, size:40, size2:40, isFound:false},
					{x_pos:680, y_pos:floorPos_y, size:40, size2:40, isFound:false},
                    {x_pos:3200, y_pos:floorPos_y, size:40, size2:40, isFound:false},
				    {x_pos:-1480, y_pos:floorPos_y-145, size:40, size2:40, isFound:false},
				    {x_pos:510, y_pos:floorPos_y-215, size:27, size2:27, isFound:false},
					{x_pos:510, y_pos:floorPos_y-255, size:27, size2:27, isFound:false},
					{x_pos:510, y_pos:floorPos_y-295, size:27, size2:27, isFound:false},
					{x_pos:550, y_pos:floorPos_y-215, size:27, size2:27, isFound:false},
					{x_pos:550, y_pos:floorPos_y-255, size:27, size2:27, isFound:false},
					{x_pos:550, y_pos:floorPos_y-295, size:27, size2:27, isFound:false},
					{x_pos:1980, y_pos:floorPos_y-63, size:30, size2:30, isFound:false},
					{x_pos:2280, y_pos:floorPos_y-118, size:40, size2:40, isFound:false},
					{x_pos:2480, y_pos:floorPos_y-164, size:40, size2:40, isFound:false},
					{x_pos:2780, y_pos:floorPos_y, size:40, size2:40, isFound:false},
					{x_pos:2980, y_pos:floorPos_y, size:40, size2:40, isFound:false},
					{x_pos:3400, y_pos:floorPos_y-86, size:30, size2:30, isFound:false},
					{x_pos:3640, y_pos:floorPos_y-164, size:30, size2:30, isFound:false},
					{x_pos:3120, y_pos:floorPos_y-256, size:30, size2:30, isFound:false},
					{x_pos:3350, y_pos:floorPos_y-195, size:30, size2:30, isFound:false},
					
				   ];
    
    canyons = [{x_pos:-900, width:100, isFound:false},
               {x_pos:+143, width:100, isFound:false},
               {x_pos:1290, width:100, isFound:false},
               {x_pos:2433, width:100, isFound:false}];
	    
    clouds = [{x_pos:-2500, y_pos:90, size:50, size2:50},
			  {x_pos:-1900, y_pos:50, size:40, size2:50},
			  {x_pos:-1400, y_pos:20, size:30, size2:60},
			  {x_pos:-900, y_pos:90, size:50, size2:50},
			  {x_pos:-400, y_pos:50, size:50, size2:50},
              {x_pos:120, y_pos:10, size:40, size2:50},
			  {x_pos:620, y_pos:80, size:50, size2:50},
              {x_pos:1150, y_pos:120, size:50, size2:50},
			  {x_pos:1650, y_pos:90, size:50, size2:50},
			  {x_pos:1800, y_pos:70, size:40, size2:50},
              {x_pos:2200, y_pos:110, size:35, size2:60},
			  {x_pos:2690, y_pos:20, size:50, size2:50},
			  {x_pos:3090, y_pos:90, size:40, size2:50},
			  {x_pos:3560, y_pos:50, size:50, size2:50},
			  {x_pos:3900, y_pos:30, size:50, size2:50},
			  {x_pos:4300, y_pos:80, size:35, size2:60},
			  {x_pos:4750, y_pos:50, size:50, size2:50},
			  {x_pos:5200, y_pos:40, size:40, size2:50},
			  {x_pos:5600, y_pos:50, size:50, size2:50},
			  {x_pos:6000, y_pos:90, size:35, size2:60},
			  {x_pos:6400, y_pos:50, size:50, size2:50},
			  {x_pos:6800, y_pos:90, size:35, size2:60}];
    
    cloudScale = 0.6; 
    
    mountains = [{x_pos:width/2-999, y_pos:height/2+2},
                 {x_pos:width/2+400, y_pos:height/2+2},
                 {x_pos:width/2+1400, y_pos:height/2+2},
                 {x_pos:width/2+2343, y_pos:height/2+2}];
	
	game_score = 0;
	flagpole = {isReached:false, x_pos:3820};
	outOfReach = {isReached:false, x_pos:-1920};
	
	platforms = [];
	platforms.push(createPlatforms(650,floorPos_y - 70,100));
	platforms.push(createPlatforms(800,floorPos_y - 150,70));
	platforms.push(createPlatforms(500,floorPos_y-200,200));
	platforms.push(createPlatforms(1800,floorPos_y-48,200));
	platforms.push(createPlatforms(2120,floorPos_y-100,200));
	platforms.push(createPlatforms(2420,floorPos_y-148,200));
	platforms.push(createPlatforms(3350,floorPos_y-70,150));
	platforms.push(createPlatforms(3550,floorPos_y-148,100));
	platforms.push(createPlatforms(3250,floorPos_y-178,150));
	platforms.push(createPlatforms(3050,floorPos_y-238,150));
    
//	platforms.push(createPlatforms(-1620,floorPos_y-350,100));
//	platforms.push(createPlatforms(-1560,floorPos_y-310,100));
//	platforms.push(createPlatforms(-1500,floorPos_y-270,100));
//	platforms.push(createPlatforms(-1460,floorPos_y-230,100));
//	platforms.push(createPlatforms(-1400,floorPos_y-190,100));
//	platforms.push(createPlatforms(-1360,floorPos_y-150,100));
//	platforms.push(createPlatforms(-1300,floorPos_y-110,100));
//	platforms.push(createPlatforms(-1260,floorPos_y-70,100));
//	platforms.push(createPlatforms(-1200,floorPos_y-30,100));
    
    platforms.push(createPlatforms(-1620,floorPos_y-350,100));
	platforms.push(createPlatforms(-1260,floorPos_y-310,100));
	platforms.push(createPlatforms(-1500,floorPos_y-270,100));
	platforms.push(createPlatforms(-1360,floorPos_y-230,100));
	platforms.push(createPlatforms(-1400,floorPos_y-190,100));
	platforms.push(createPlatforms(-1560,floorPos_y-150,100));
	platforms.push(createPlatforms(-1300,floorPos_y-110,100));
	platforms.push(createPlatforms(-1160,floorPos_y-70,100));
	platforms.push(createPlatforms(-1200,floorPos_y-30,100));
	
	
	enemies = [];
	enemies.push(new Enemy(900,floorPos_y-20,100));
	enemies.push(new Enemy(1820,floorPos_y-50,100));
	enemies.push(new Enemy(2120,floorPos_y-100,100));
	enemies.push(new Enemy(2420,floorPos_y-148,100));
	enemies.push(new Enemy(2920,floorPos_y,100));
	enemies.push(new Enemy(2720,floorPos_y,100));
	enemies.push(new Enemy(3120,floorPos_y,90));
	enemies.push(new Enemy(-300,floorPos_y,90));
	enemies.push(new Enemy(-1030,floorPos_y,120));
}

