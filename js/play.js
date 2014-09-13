// We create our only state 
var playState = {

    
create: function() { 
    // Display the image on the screen 
    
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
    this.scoreLabel = game.add.text(30, 30, 'score: 0', { font: '20px Geo', fill: '#ffffff' });
    game.global.score = 0;
    
    // Initialise the score variable 
    this.score = 0;
    
    // Create an enemy group with Arcade physics 
    this.enemies = game.add.group(); 
    this.enemies.enableBody = true;
    
    // Create 10 enemies with the 'enemy' image in the group 
    // The enemies are "dead" by default, so they are not visible in the game 
    this.enemies.createMultiple(10, 'enemy');
    
    // Contains the time of the next enemy creation 
    this.nextEnemy = 0;
    



    
    this.jumpSound = game.add.audio('jump'); 
    this.coinSound = game.add.audio('coin'); 
    this.deadSound = game.add.audio('dead');
    
    // Add and start the music in the 'create' function of the play.js file 
    // Because we want to play the music when the play state starts 
    this.music = game.add.audio('music'); 
    
    // Add the music
    this.music.loop = true; // Make it loop 
    this.music.play(); // Start the music
    
    // Create the 'right' animation by looping the frames 1 and 2 
    this.player.animations.add('right', [1, 2], 8, true);
    
    // Create the 'left' animation by looping the frames 3 and 4 
    this.player.animations.add('left', [3, 4], 8, true);
    
    // Create the emitter with 15 particles. We don't need to set the x and y 
    // Since we don't know where to do the explosion yet 
    this.emitter = game.add.emitter(0, 0, 15);
    
    // Set the 'pixel' image for the particles 
    this.emitter.makeParticles('pixel');
    
    // Set the y speed of the particles between -150 and 150 
    // The speed will be randomly picked between -150 and 150 for each particle 
    this.emitter.setYSpeed(-150, 150);
    
    // Do the same for the x speed 
    this.emitter.setXSpeed(-150, 150);
    
    // Use no gravity for the particles 
    this.emitter.gravity = 0;

    game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);

    this.wasd = { 
        up: game.input.keyboard.addKey(Phaser.Keyboard.W), 
        left: game.input.keyboard.addKey(Phaser.Keyboard.A), 
        right: game.input.keyboard.addKey(Phaser.Keyboard.D) 
    };









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

    if (this.nextEnemy < game.time.now) { 
        // Define our variables 
        var start = 4000, end = 1000, score = 100;
        
        // Formula to decrease the delay between enemies over time 
        // At first it's 4000ms, then slowly goes to 1000ms 
        var delay = Math.max(start - (start-end)*game.global.score/score, end);
        
        // Create a new enemy, and update the 'nextEnemy' time 
        this.addEnemy(); 
        this.nextEnemy = game.time.now + delay;
    };

},
    
movePlayer: function() { 
    // If the left arrow key is pressed
    if ((this.cursor.left.isDown || this.wasd.left.isDown)) { 
        // Move the player to the left 
        this.player.body.velocity.x = -200; 
        this.player.animations.play('left'); // Start the left animation

    }
    
    // If the right arrow key is pressed 
    else if (this.cursor.right.isDown || this.wasd.right.isDown) { 
        // Move the player to the right 
        this.player.body.velocity.x = 200; 
        this.player.animations.play('right'); // Start the right animation

    }
    
    // If neither the right or left arrow key is pressed 
    else { 
        // Stop the player 
        this.player.body.velocity.x = 0; 
        this.player.animations.stop(); // Stop the animation 
        this.player.frame = 0; // Set the player frame to 0 (stand still)
    }
    
    // If the up arrow key is pressed and the player is touching the ground 
    if ((this.cursor.up.isDown || this.wasd.up.isDown) && this.player.body.touching.down) { 
        // Move the player upward (jump) 
        this.player.body.velocity.y = -320; 
        // Add this inside the 'movePlayer' function, in the 'if(player jumps)' 
        this.jumpSound.play();

    }
    
},

createWorld: function() { 
    // Create our wall group with Arcade physics 
    this.walls = game.add.group(); this.walls.enableBody = true;
    
    // Create the 10 walls 
    game.add.sprite(0, 0, 'wallV', 0, this.walls); // Left 
    game.add.sprite(480, 0, 'wallV', 0, this.walls); // Right
    game.add.sprite(0, 0, 'wallH', 0, this.walls); // Top left 
    game.add.sprite(300, 0, 'wallH', 0, this.walls); // Top right 
    game.add.sprite(0, 320, 'wallH', 0, this.walls); // Bottom left 
    game.add.sprite(300, 320, 'wallH', 0, this.walls); // Bottom right
    game.add.sprite(-100, 160, 'wallH', 0, this.walls); // Middle left 
    game.add.sprite(400, 160, 'wallH', 0, this.walls); // Middle right
    
    var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls); 
    middleTop.scale.setTo(1.5, 1); 
    
    var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls); 
    middleBottom.scale.setTo(1.5, 1);

    // Set all the walls to be immovable 
    this.walls.setAll('body.immovable', true);
},
    
startMenu: function() { 
    game.state.start('menu'); 
},


playerDie: function() { 
    
    // If the player is already dead, do nothing 
    if (!this.player.alive) { 
        return; 
    }
    
    // Kill the player 
    this.player.kill();
    
    // The part that will be executed only once 
    this.deadSound.play(); 
    this.emitter.x = this.player.x; 
    this.emitter.y = this.player.y; 
    this.emitter.start(true, 600, null, 15); 
    game.time.events.add(1000, this.startMenu, this);

},

takeCoin: function(player, coin) { 
    
    // Put this in the 'takeCoin' function 
    this.coinSound.play();

    
    // Increase the score by 5 
    game.global.score += 5; 

    // Update the score label 
    this.scoreLabel.text = 'score: ' + game.global.score;
    
    // Change the coin position 
    this.updateCoinPosition();
    
    // Scale the coin to 0 to make it invisible 
    this.coin.scale.setTo(0, 0);
    
    // Grow the coin back to its original scale in 300ms 
    game.add.tween(this.coin.scale).to({x: 1, y: 1}, 300).start();
    
    game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 50).to({x: 1, y: 1}, 150).start();


},

updateCoinPosition: function() { 
    // Store all the possible coin positions in an array 
    var coinPosition = [ 
        {x: 140, y: 60}, {x: 360, y: 60}, // Top row 
        {x: 60, y: 140}, {x: 440, y: 140}, // Middle row 
        {x: 130, y: 300}, {x: 370, y: 300} // Bottom row 
    ];
    
    // Remove the current coin position from the array 
    // Otherwise the coin could appear at the same spot twice in a row 
    for (var i = 0; i < coinPosition.length; i++) { 
        if (coinPosition[i].x === this.coin.x) { 
            coinPosition.splice(i, 1);
        }
    }
    
    // Randomly select a position from the array 
    var newPosition = coinPosition[ game.rnd.integerInRange(0, coinPosition.length-1)];
    
    // Set the new position of the coin 
    this.coin.reset(newPosition.x, newPosition.y);
},
    
addEnemy: function() { 
    // Get the first dead enemy of the group 
    var enemy = this.enemies.getFirstDead();
    
    // If there isn't any dead enemy, do nothing 
    if (!enemy) { return; }
    
    // Initialise the enemy 
    enemy.anchor.setTo(0.5, 1); 
    enemy.reset(game.world.centerX, 0); 
    enemy.body.gravity.y = 500; 
    enemy.body.velocity.x = 100 * Phaser.Math.randomSign(); 
    enemy.body.bounce.x = 1; 
    enemy.checkWorldBounds = true; 
    enemy.outOfBoundsKill = true;
},


};


    
    