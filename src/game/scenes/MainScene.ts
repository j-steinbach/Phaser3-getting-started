import Phaser, { GameObjects, Physics } from "phaser";
import skySprite from "Assets/sky.png";
import groundSprite from "Assets/platform.png";
import starSprite from "Assets/star.png";
import bombSprite from "Assets/bomb.png";
import dudeSprite from "Assets/dude.png";

var platforms, player: Physics.Arcade.Sprite;
var stars: Physics.Arcade.Group;
var bombs: Physics.Arcade.Group;
var cursors: Phaser.Types.Input.Keyboard.CursorKeys;
var score = 0;
var scoreText: GameObjects.Text;
var gameOver;

// https://phaser.io/tutorials/making-your-first-phaser-3-game/part1

class GettingStartedScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    create() {
        cursors = this.input.keyboard.createCursorKeys();
        this.add.image(400, 300, "sky");
        scoreText = this.add.text(32, 32, "score: 0", {
            fontSize: "32px",
            fill: "#000",
        });

        platforms = this.physics.add.staticGroup();
        (platforms.create(400, 568, "ground") as Phaser.Physics.Arcade.Sprite)
            .setScale(2)
            .refreshBody();
        platforms.create(600, 400, "ground");
        platforms.create(50, 250, "ground");
        platforms.create(750, 220, "ground");

        player = this.physics.add.sprite(100, 450, "dude");
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        // player.setGravityY(300);

        this.physics.add.collider(player, platforms);

        stars = this.physics.add.group({
            key: "star",
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 },
        });
        stars.children.iterate(function (child) {
            (child as Phaser.Physics.Arcade.Sprite).setBounceY(
                Phaser.Math.FloatBetween(0.4, 0.8)
            );
        });

        this.physics.add.collider(stars, platforms);
        this.physics.add.overlap(player, stars, collectStar, undefined, this);

        bombs = this.physics.add.group();
        this.physics.add.collider(bombs, platforms);
        this.physics.add.collider(player, bombs, hitBomb, undefined, this);

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });
    }

    preload() {
        this.load.image("sky", skySprite);
        this.load.image("ground", groundSprite);
        this.load.image("star", starSprite);
        this.load.image("bomb", bombSprite);
        this.load.spritesheet("dude", dudeSprite, {
            frameWidth: 32,
            frameHeight: 48,
        });
    }

    update() {
        if (cursors.left && cursors.left.isDown) {
            player.setVelocityX(-160);

            player.anims.play("left", true);
        } else if (cursors.right && cursors.right.isDown) {
            player.setVelocityX(160);

            player.anims.play("right", true);
        } else {
            player.setVelocityX(0);

            player.anims.play("turn");
        }

        if (cursors.up && cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
        }
    }
}

function collectStar(
    player: GameObjects.GameObject,
    star: GameObjects.GameObject
) {
    (star as Physics.Arcade.Sprite).disableBody(true, true);

    score += 10;
    scoreText.text = "Score: " + score;

    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
            (child as Physics.Arcade.Sprite).enableBody(
                true,
                (child as Physics.Arcade.Sprite).x,
                0,
                true,
                true
            );
        });

        var x =
            (player as Physics.Arcade.Sprite).x < 400
                ? Phaser.Math.Between(400, 800)
                : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, "bomb");
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}

function hitBomb(
    this: any,
    player: GameObjects.GameObject,
    bomb: GameObjects.GameObject
) {
    this.physics.pause();

    (player as Physics.Arcade.Sprite).setTint(0xff0000).anims.play("turn");

    gameOver = true;
}

export default GettingStartedScene;
