/**
 * Generated from the Phaser Sandbox
 *
 * //phaser.io/sandbox/XsgEtOQb
 *
 * This source requires Phaser 2.6.2
 */
var GameModule = (function () {
    var game;

    // SECTION - INITIALIZATION
    function preload() {
        // 62 x 88
        game.load.image('playButton', 'assets/play_ascii.png');
        game.load.image('restartButton', 'assets/restart_ascii.png');
        game.load.image('logo', 'assets/logo_ascii.png');
        game.load.image('getReady', 'assets/get_ready_ascii.png');
        
        game.load.image('score', 'assets/score_ascii.png');
        game.load.spritesheet('numbers', 'assets/numbers_ascii.png', 60, 88);

        game.load.image('ground', 'assets/ground_ascii.png');
        game.load.image('obstacle', 'assets/obstacle_ascii.png');
        game.load.spritesheet('bird', 'assets/bird_ascii.png', 380, 292);
    }

    var ground, obstacles, bird;
    var playButton, restartButton;
    var logo, getReady, scoreLabel, scoreGroup;      
    var score, scoreEvent;  

    function create() {   
        isPlayerStarted = false;     
        score = 0;

        game.physics.startSystem(Phaser.Physics.ARCADE);

        logo = game.add.sprite(game.world.centerX, game.world.centerY - 100, 'logo');
        logo.scale.setTo(0.5, 0.5);
        logo.anchor.setTo(0.5, 0.5);

        bird = game.add.sprite(200, game.world.height / 2, 'bird');

        obstacles = game.add.group();
        obstacles.enableBody = true;
        ground = game.add.group();
        ground.enableBody = true;
        
        for (var i = 0; i < 3; i++) {
            var groundPart = ground.create(560.5 * i, game.world.height - 40, 'ground');
            groundPart.scale.setTo(0.5, 0.5);
            groundPart.body.immovable = true;
        }
                
        bird.scale.setTo(0.5, 0.5);
        bird.anchor.setTo(0.5, 0.5);
        
        game.physics.arcade.enable(bird);
        bird.body.setSize(200, 200, bird.width / 2, bird.height / 2);
        bird.animations.add('idle', [0, 1, 2], 10, true);

        getReady = game.add.sprite(game.world.centerX, game.world.centerY, 'getReady');
        getReady.scale.setTo(0.5, 0.5);
        getReady.anchor.setTo(0.5, 0.5);
        getReady.visible = false;
        
        playButton = game.add.button(game.world.centerX, game.world.centerY + 100, 'playButton', onPlayButtonClicked);
        playButton.anchor.setTo(0.5, 0,5);
        playButton.scale.setTo(0.5, 0.5);

        restartButton = game.add.button(game.world.centerX, game.world.centerY + 100, 'restartButton', onRestartButtonClicked);
        restartButton.anchor.setTo(0.5, 0.5);
        restartButton.scale.setTo(0.5, 0.5);
        restartButton.visible = false;

        scoreLabel = game.add.sprite(game.world.centerX - 70, game.world.centerY - 240, 'score');
        scoreLabel.scale.setTo(0.5, 0.5);
        scoreLabel.anchor.setTo(0.5, 0.5);
        scoreLabel.visible = false;

        scoreGroup = game.add.group();

        for (var i = 0; i < 3; i++) {
            createObstacleAt(600 + (350 * i));
        }
    }

    function onPlayButtonClicked() {
        logo.visible = false;
        playButton.visible = false;
        getReady.visible = true;        
        game.time.events.add(Phaser.Timer.SECOND * 3, function () {
            getReady.visible = false;
            scoreLabel.visible = true;
            isGameplayRunning = true;

            scoreEvent = game.time.events.loop(Phaser.Timer.SECOND * 1.5, function () {
                if (isGameplayRunning) score += 1;
            });
        });
    }

    function onRestartButtonClicked() {
        game.state.restart();
    }

    // SECTION - UPDATE
    var isPlayerStarted = false;
    var isGameplayRunning = false;
    var birdFlapped = false;

    function update() {
        if (isGameplayRunning) doGameplay();        
    }

    function doGameplay() {
        if (!isPlayerStarted) startPlayer();

        var groundHit = game.physics.arcade.collide(bird, ground);
        var obstacleHit = game.physics.arcade.collide(bird, obstacles);

        if (groundHit || obstacleHit) {
            killPlayer();
            return;
        }
        
        cursors = game.input.keyboard.createCursorKeys();
        if (cursors.up.isDown) {
            if (!birdFlapped) {
                bird.body.velocity.y = -450;
                birdFlapped = true;
            }
        } else {
            birdFlapped = false;
        }

        setBirdAngle(bird);
        updateGround();
        updateObstacles();
    }

    function updateGround() {
        ground.forEach(function (groundPart) {
            groundPart.body.velocity.x = -200;
            if (groundPart.x < -580) groundPart.x = groundPart.x + (560.5 * 3); 
        });
    }

    function updateObstacles() {
        var shouldCreateNewObstacle = false;
        var newObstaclePositionX = 0;

        obstacles.forEach(function (obstacle) {
            obstacle.body.velocity.x = -200;
            if (obstacle.x < -100) {
                if (!shouldCreateNewObstacle) {
                    shouldCreateNewObstacle = true;
                    newObstaclePositionX = obstacle.x + (350 * 3);
                }
                obstacle.associatedObstacle.destroy();
                obstacle.destroy();       
            }
        });

        if (shouldCreateNewObstacle) {
            createObstacleAt(newObstaclePositionX);
        }
    }

    function createObstacleAt(positionX) {
        var obstacleHeight = getRandomObstacleHeight();
        var downObstacle = obstacles.create(positionX, obstacleHeight + 130, 'obstacle');
        downObstacle.scale.setTo(0.5, 0.5);
        downObstacle.anchor.setTo(0.5, 0);
        downObstacle.body.immovable = true;
        downObstacle.body.setSize(180, 800, downObstacle.width / 2 - 30, 0);
        
        var upObstacle = obstacles.create(positionX, obstacleHeight - 130, 'obstacle');
        upObstacle.scale.setTo(0.5, 0.5);
        upObstacle.anchor.setTo(0.5, 0);
        upObstacle.angle = 180;
        upObstacle.body.immovable = true;
        upObstacle.body.setSize(180, 800, upObstacle.width / 2 - 30, -800);

        downObstacle.associatedObstacle = upObstacle;
        upObstacle.associatedObstacle = downObstacle;
    }

    function setBirdAngle(bird) {
        var normalizedVelocity = valueBetween(bird.body.velocity.y, -500, 500);
        var anglePercent = (normalizedVelocity + 500) / (500 + 500);
        var angle = anglePercent * (45 + 45) - 45; 
        bird.angle = angle;
    }

    function startPlayer() {
        bird.body.gravity.y = 800;
        bird.body.collideWorldBounds = true;

        bird.animations.play('idle');
        isPlayerStarted = true;
    }

    function killPlayer() {
        isGameplayRunning = false;
        bird.animations.stop();
        bird.angle = 180;
        bird.body.velocity.y = -350;
        ground.forEach(function (groundPart) { groundPart.body.velocity.x = 0; });
        obstacles.forEach(function (obstacle) { obstacle.body.velocity.x = 0; });
        
        game.time.events.remove(scoreEvent);
        game.time.events.add(Phaser.Timer.SECOND * 2, function () {
            restartButton.visible = true;
        });
    } 
    
    function getRandomObstacleHeight() {
        return Math.floor(Math.random() * ((game.world.height - 180) - 250 + 1)) + 250;
    }

    function render() {
        if (isGameplayRunning) updateScoreUi();
        //game.debug.body(bird);
        //obstacles.forEach(function (obstacle) { game.debug.body(obstacle); });
    }

    function updateScoreUi() {
        scoreGroup.forEach(function (child) {
            child.destroy();
        });

        var scoreString = score.toString();
        for (var i = 0; i < scoreString.length; i++) {
            var sprite = scoreGroup.create(game.world.centerX + 50 + (31 * i), game.world.centerY - 240, 'numbers');
            sprite.scale.setTo(0.5, 0.5);
            sprite.anchor.setTo(0, 0.5);
            sprite.frame = parseInt(scoreString[i]);
        }
    }

    // SECTION - HELPERS
    function valueBetween(value, min, max) {
        return (Math.min(max, Math.max(min, value)));
    }

    return {
        start: function() {
            game = new Phaser.Game(800, 800, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });
        }
    }
})();


