var loadState = {
    
    preload: function () { 
        // Add a 'loading...' label on the screen 
        var loadingLabel = game.add.text(game.world.centerX, 150, 'loading...', { font: '30px Arial', fill: '#ffffff' }); 
        loadingLabel.anchor.setTo(0.5, 0.5);
        
        // Display the progress bar 
        var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar'); 
        progressBar.anchor.setTo(0.5, 0.5); 
        game.load.setPreloadSprite(progressBar);
        
        // Load all our assets 
        game.load.image('player', 'assets/player.png'); 
        game.load.image('enemy', 'assets/enemy.png');
        game.load.image('coin', 'assets/coin.png'); 
        game.load.image('wallV', 'assets/wallVertical.png'); 
        game.load.image('wallH', 'assets/wallHorizontal.png');
        
        // Load a new asset that we will use in the menu state 
        game.load.image('background', 'assets/background.png');
        
    },
    
    create: function() { // Go to the menu state 
        game.state.start('menu'); 
    }
};

