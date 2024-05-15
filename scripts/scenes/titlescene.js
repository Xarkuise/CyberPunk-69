export default class titlescene extends Phaser.Scene {
    constructor() {
        super("titlescene");
    }

    preload() {
        // Load assets like background images, buttons, etc.
        this.load.image('titleBackground', './assets/images/titleBackground.png');
        // Load button images
        this.load.image('startButton', './assets/images/start.png');
        this.load.image('creditButton', './assets/images/credit.png');
        this.load.image('quitButton', './assets/images/quit.png');
    }

    create() {
        // Add background image
        this.background = this.add.image(0, 0, 'titleBackground').setOrigin(0, 0);
        this.background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
    
        // Title text
        this.add.text(this.cameras.main.width / 2, 150, 'CyberPunk 69', { 
            fontSize: '48px', 
            fontFamily: 'Orbitron', 
            fill: '#D1128F',
            stroke: '#000',
            strokeThickness: 8
        }).setOrigin(0.5);
    
        // Add Start button
        const startButton = this.add.image(this.cameras.main.width / 2, 250, 'startButton');
        startButton.setOrigin(0.5);
        startButton.setInteractive();
        startButton.on('pointerdown', () => {
        this.scene.start('gamescene');
        });
    
        // Add Credit button
        const creditButton = this.add.image(this.cameras.main.width / 2, 330, 'creditButton');
        creditButton.setOrigin(0.5);
        creditButton.setInteractive();
        creditButton.on('pointerdown', () => this.scene.start('creditscene'));
    
        // Add Quit button
        const quitButton = this.add.image(this.cameras.main.width / 2, 410, 'quitButton');
        quitButton.setOrigin(0.5);
        quitButton.setInteractive();
        quitButton.on('pointerdown', () => {
            if (window.confirm("Are you sure you want to quit?")) {
                alert("You exited the game");
            }
        });
    
        // Get reference to the gamescene instance
        this.gameScene = this.scene.get('gamescene');
    }
}