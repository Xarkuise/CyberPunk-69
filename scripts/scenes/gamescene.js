export default class gamescene extends Phaser.Scene {
    constructor() {
        super("gamescene");
        this.scenePaused = false;
    }

    init() {
        this.platform;
        this.cursors;
        this.jumpKey;
        this.background;
        this.star;
        this.nade;
        this.nextStarTimer;
        this.nextBombTimer;
        this.starCounter = 0;
        this.score = 0;
        this.scoreText;
        this.scorePoint;
        this.usedStarPositions = new Set();
        this.gameOverText;
        this.colorIndex = 0;
        this.changingColors = ['#540303', '#4232bf', '#bdae26', '#3c9978', '#84b830', '#c90bde', '#a2c700'];
    }

    preload() {
        // Background
        this.load.image('background', './assets/images/background.png');
        // Platform
        this.load.image('sPlatform1', './assets/images/smallPlatform1.png');
        this.load.image('sPlatform2', './assets/images/smallPlatform2.png');
        this.load.image('sPlatform3', './assets/images/smallPlatform3.png');
        this.load.image('bPlatform1', './assets/images/bigplatform.png');
        // Player
        this.load.spritesheet('player', './assets/images/character.png', { frameWidth: 60, frameHeight: 70 });
        // Star and Bomb
        this.load.image('star', './assets/images/star.png');
        this.load.image('bomb', './assets/images/nade.png');
    }

    create() {
        // Scale Background size
        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Physics for Platform
        this.platform = this.physics.add.staticGroup();

        // Platform Coordinates
        this.platform.create(700, 260, 'sPlatform1').setScale(0.37).refreshBody(); //middle right
        this.platform.create(220, 430, 'sPlatform2').setScale(0.4).refreshBody(); //bottom left
        this.platform.create(600, 380, 'sPlatform3').setScale(0.4).refreshBody(); //middle right
        this.platform.create(100, 320, 'sPlatform2').setScale(0.4).refreshBody(); //middle left
        this.platform.create(370, 200, 'sPlatform3').setScale(0.37).refreshBody(); //middle top left
        this.platform.create(150, 529, 'bPlatform1').setScale(0.4).refreshBody(); //ground left
        this.platform.create(450, 529, 'bPlatform1').setScale(0.4).refreshBody(); //ground middle
        this.platform.create(750, 529, 'bPlatform1').setScale(0.4).refreshBody(); //ground right

        // Player properties
        this.player = this.physics.add.sprite(500, 400, 'player');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, this.platform);

        // Animations for the player
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 4 }],
            frameRate: 5
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

        this.star = this.physics.add.group({
            key: 'star',
            allowGravity: true
        });

        this.physics.add.collider(this.star, this.platform);
        this.physics.add.overlap(this.player, this.star, this.collectStar, null, this);

        this.nade = this.physics.add.group({
            key: 'bomb',
            allowGravity: true,
            setXY: { x: 0, y: 0 } // Initial position, they will be moved later
        });
    
        this.physics.add.collider(this.nade, this.platform);
        this.physics.add.overlap(this.player, this.nade, this.hitBomb, null, this);
    

        this.scoreText = this.add.text(550, 20, 'Star Collected:' + this.score, { fontSize: '15px', fill: '#ffffff' });
        this.scorePoint = this.add.text(550, 40, 'Score:' + this.score, { fontSize: '15px', fill: '#ffffff' });

        this.resumeScene();

        // Respawn time for star
        this.nextStarTimer = this.time.addEvent({
            delay: 4000,
            callback: this.createNewStar,
            callbackScope: this,
            loop: true
        });

        // Respawn bomb time
        this.nextBombTimer = this.time.addEvent({
            delay: 6000,
            callback: this.createNewNade,
            callbackScope: this,
            loop: true
        });
    }

    // Add these methods to pause and resume the scene
    pauseScene() {
        this.physics.pause();
        this.scenePaused = true;
    }

    resumeScene() {
        this.physics.resume();
        this.scenePaused = false;
    }

    collectStar(player, star) {
        star.destroy();
        this.usedStarPositions.delete(star.x);
        this.score += 1;
        this.scoreText.setText('Star Collected: ' + this.score);
        this.scorePoint.setText('Score: ' + this.score * 100);
        player.setTint(Phaser.Display.Color.HexStringToColor(this.changingColors[this.colorIndex]).color);

        this.colorIndex = (this.colorIndex + 1) % this.changingColors.length;
        this.starCounter++;
        if (this.starCounter % 5 === 0) {
            player.setScale(player.scaleX * 1.1, player.scaleY * 1.1);
            this.starCounter = 0;
        }

        // Create flag platform if score reaches 15 star or 1500 Point
        if (this.score === 15 || this.score === 1500) {
            this.winGame();
            player.setVelocity(0, 0);
            player.setY(this.game.config.height + 100);
        }
    }

    createNewStar() {
        if (this.star.getChildren().length < 5) {
            var platformArray = this.platform.getChildren().filter(platform => platform.y <= 710);

            if (platformArray.length > 0) {
                var randomPlatform;
                var starX, platformIndex;

                do {
                    platformIndex = Phaser.Math.Between(0, platformArray.length - 2);
                    randomPlatform = platformArray[platformIndex];
                    starX = Phaser.Math.Between(randomPlatform.x - randomPlatform.width / 5, randomPlatform.x + randomPlatform.width / 1.5);
                } while (this.usedStarPositions.has(starX));

                this.usedStarPositions.add(starX);

                var newStarY = -5;
                var newStar = this.star.create(starX, newStarY, 'star');
                newStar.setBounce(0.2);
                newStar.setCollideWorldBounds(true);
                newStar.setVelocityY(15);
            }
        }
    }

    createNewNade() {
        if (this.nade.getChildren().length < 5) {
            var platformArray = this.platform.getChildren().filter(platform => platform.y <= 710);
    
            if (platformArray.length > 0) {
                var randomPlatform;
                var bombX, platformIndex;
    
                do {
                    platformIndex = Phaser.Math.Between(0, platformArray.length - 1);
                    randomPlatform = platformArray[platformIndex];
                    bombX = Phaser.Math.Between(randomPlatform.x - randomPlatform.width / 2, randomPlatform.x + randomPlatform.width / 2);
                } while (this.usedStarPositions.has(bombX));
    
                var newNadeY = -40;
                var newNade = this.nade.create(bombX, newNadeY, 'bomb');
                newNade.setBounce(0.2);
                newNade.setCollideWorldBounds(true);
                newNade.setVelocityY(5);
            }
        }
    }

    hitBomb(player, bomb) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('idle');
        player.setVelocity(0, 0);
        this.scene.start("gameoverscene", { score: this.score }); // Pass score as data
    }

    winGame() {
        this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'You Win!', { fontSize: '64px', fill: '#00ff00' }).setOrigin(0.5);
        this.physics.pause();
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-250);
            this.player.anims.play('walk', true);
            this.player.flipX = false;
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(250);
            this.player.anims.play('walk', true);
            this.player.flipX = true;
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('idle');
        }
        if (this.jumpKey.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-285);
        }
    }
}
