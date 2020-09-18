import Phaser from "phaser";
import GettingStartedScene from "./scenes/MainScene";

export const initGame = (_parent: string) => {
    const game = new Phaser.Game(config);
    return game;
};

// The config object is how you configure your Phaser Game.
const config = {
    type: Phaser.AUTO, //  tries to use WebGL, but if the browser or device doesn't support it it'll fall back to Canvas
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: true,
        },
    },
    scene: [GettingStartedScene],
};
