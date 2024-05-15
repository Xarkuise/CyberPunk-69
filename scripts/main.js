import gamescene from './scenes/gamescene.js';
import titlescene from './scenes/titlescene.js';
import creditscene from './scenes/creditscene.js';
import gameoverscene from './scenes/gameoverscene.js';

var titleScene = new titlescene();
var gameScene = new gamescene();
var creditScene = new creditscene();
var gameoverScene = new gameoverscene();

var config = {
    type: Phaser.AUTO,
    width: 730,
    height: 550,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [titlescene, gamescene, creditscene, gameoverscene]
};

var game = new Phaser.Game(config);

game.scene.add('titlescene', titleScene);
game.scene.add('gamescene', gameScene);
game.scene.add('creditscene', creditScene);
game.scene.add('gameoverscene', gameoverScene);

game.scene.start('titlescene');