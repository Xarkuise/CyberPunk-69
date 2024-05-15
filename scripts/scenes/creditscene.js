export default class creditscene extends Phaser.Scene {
    constructor() {
        super("creditscene");
    }

    preload() {
        // Load assets like background images, buttons, etc.
        this.load.image('titleBackground', './assets/images/titleBackground.png');

        this.load.image('backButton', './assets/images/back.png');
    }

    create() {
        // Add background image
        this.background = this.add.image(0, 0, 'titleBackground').setOrigin(0, 0);
        this.background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        this.add.text(this.cameras.main.width / 2, 150, 'Name: Adrian Marlowe Q. Satentes', { 
            fontSize: '20px', 
            fontFamily: 'Orbitron', 
            fill: '#D1128F',
            stroke: '#000',
            strokeThickness: 8
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.width / 2, 250, 'SECTION: EMC131P.A223', { 
            fontSize: '20px', 
            fontFamily: 'Orbitron', 
            fill: '#D1128F',
            stroke: '#000',
            strokeThickness: 8
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.width / 2, 350, 'PROGRAM: Entertainment Multimedia Computing' , { 
            fontSize: '20px', 
            fontFamily: 'Orbitron', 
            fill: '#D1128F',
            stroke: '#000',
            strokeThickness: 8
        }).setOrigin(0.5);

        const backButton = this.add.image(this.cameras.main.width / 2, 430, 'backButton');
        backButton.setOrigin(0.5);
        backButton.setInteractive();
        backButton.on('pointerdown', () => this.scene.start('titlescene'));
    }
}