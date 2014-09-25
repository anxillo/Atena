// We create our only state 
var mainState = {
    
// Here we add all the functions we need for our state 
// For this project we will just have 3 functions
    
preload: function() { 
    // Load the image 
    game.load.image('player', 'assets/player.png');
},
create: function() { 
    // Display the image on the screen 
    game.stage.backgroundColor = '#3498db';
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    this.player.anchor.setTo(0.5, 0.5);
    
    // Tell Phaser that the player will use the Arcade physics engine
    game.physics.arcade.enable(this.player);
    
    // Add vertical gravity to the player 
    this.player.body.gravity.y = 500;
    
    this.cursor = game.input.keyboard.createCursorKeys();
    
    this.createWorld();
    
    // Display the coin 
    this.coin = game.add.sprite(60, 140, 'coin');
    
    // Add Arcade physics to the coin 
    game.physics.arcade.enable(this.coin);
    
    // Set the anchor point of the coin to its center 
    this.coin.anchor.setTo(0.5, 0.5);
    
    // Display the score 
    this.scoreLabel = game.add.text(30, 30, 'score: 0', { font: '18px Arial', fill: '#ffffff' });
    
    // Initialise the score variable 
    this.score = 0;
    
    // Create an enemy group with Arcade physics 
    this.enemies = game.add.group(); 
    this.enemies.enableBody = true;
    
    // Create 10 enemies with the 'enemy' image in the group 
    // The enemies are "dead" by default, so they are not visible in the game 
    this.enemies.createMultiple(10, 'enemy');
    
    // Call 'addEnemy' every 2.2 seconds 
    game.time.events.loop(2200, this.addEnemy, this);








},
update: function() { 
    // This function is called 60 times per second 
    // It contains the game's logic 
    
    // Tell Phaser that the player and the walls should collide 
    game.physics.arcade.collide(this.player, this.walls);
    
    this.movePlayer();
    
    if (!this.player.inWorld) { this.playerDie(); }
    
    game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
    
    // Make the enemies and walls collide 
    game.physics.arcade.collide(this.enemies, this.walls);
    
    // Call the 'playerDie' function when the player and an enemy overlap 
    game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);


}

};


    
    







// We initialising Phaser 
var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gameDiv');


// And finally we tell Phaser to add and start our 'main' state 
game.state.add('main', mainState); 
game.state.start('main');