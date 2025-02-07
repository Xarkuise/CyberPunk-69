export default class gameoverscene extends Phaser.Scene {
    constructor() {
        super("gameoverscene");
    }

    preload() {
        // Load assets like background image and buttons
        this.load.image('background', './assets/images/gameoverBackground.png');
        this.load.image('restartButton', './assets/images/reset.png');
        this.load.image('mainMenuButton', './assets/images/main.png');
    }
    
    create(data) {
        const score = data.score; // Access the score from data
        // Add background image
        this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(this.cameras.main.width, this.cameras.main.height);
    
        // Display game over text
        this.add.text(this.cameras.main.width / 2, 100, 'Game Over', { fontSize: '64px', fontFamily: 'Orbitron', fill: '#D1128F', stroke: '#000', strokeThickness: 8 }).setOrigin(0.5);
    
        // Display score
        this.add.text(this.cameras.main.width / 2, 200, 'Star Collected: ' + score, { fontSize: '32px', fontFamily: 'Orbitron', fill: '#D1128F', stroke: '#000', strokeThickness: 8 }).setOrigin(0.5);
        
        this.add.text(this.cameras.main.width / 2, 250, 'Score: ' + score * 100, { fontSize: '32px', fontFamily: 'Orbitron', fill: '#D1128F', stroke: '#000', strokeThickness: 8 }).setOrigin(0.5);

        
        // Add restart button
        const restartButton = this.add.image(this.cameras.main.width / 2, 300, 'restartButton')
        restartButton.setOrigin(0.5);
        restartButton.setInteractive();
        restartButton.on('pointerdown', () => {
            this.scene.start('gamescene'); // Restart the game
        });
    
        // Add main menu button
        const mainMenuButton = this.add.image(this.cameras.main.width / 2, 350, 'mainMenuButton')
        mainMenuButton.setOrigin(0.5);
        mainMenuButton.setInteractive();
        mainMenuButton.on('pointerdown', () => {
            this.scene.start('titlescene'); // Go back to the title scene
        });
    }
}