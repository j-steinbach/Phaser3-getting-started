import Phaser, { Physics } from "phaser";

export default class BombSpawner {
    scene: Phaser.Scene;
    key: string;
    private bombgroup: Physics.Arcade.Group;

    constructor(scene: Phaser.Scene, bombKey = "bomb") {
        this.scene = scene;
        this.key = bombKey;

        this.bombgroup = this.scene.physics.add.group();
    }

    get group() {
        return this.bombgroup;
    }

    spawnBombs(playerX = 0) {
        // decide the side of the screen the bomb should appear.
        const x =
            playerX < 400
                ? Phaser.Math.Between(400, 800)
                : Phaser.Math.Between(0, 400);
        const bomb = this.group.create(x, 16, this.key);
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        return bomb;
    }
}
