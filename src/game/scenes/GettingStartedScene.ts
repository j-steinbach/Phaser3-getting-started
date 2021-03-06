import Phaser, { GameObjects, Physics } from "phaser";
import skySprite from "Assets/sky.png";
import groundSprite from "Assets/platform.png";
import starSprite from "Assets/star.png";
import bombSprite from "Assets/bomb.png";
import dudeSprite from "Assets/dude.png";
import ScoreLabel from "../ui/ScoreLabel";
import BombSpawner from "./BombSpawner";

// Phaser3 getting started project
// https://phaser.io/tutorials/making-your-first-phaser-3-game/part1
// https://www.youtube.com/watch?v=QXxmSbfR2aY
// https://blog.ourcade.co/posts/2020/make-first-phaser-3-game-modern-javascript-part1/

// global constant keys for loading assets
const GROUND_KEY: string = "ground";
const DUDE_KEY: string = "dude";
const SKY_KEY: string = "sky";
const STAR_KEY: string = "star";
const BOMB_KEY: string = "bomb";

const KEY_ANIM_TURN: string = "turn";
const KEY_ANIM_LEFT: string = "left";
const KEY_ANIM_RIGHT: string = "right";

class GettingStartedScene extends Phaser.Scene {
    // our game variables
    platforms?: Phaser.Physics.Arcade.StaticGroup;
    player?: Phaser.Physics.Arcade.Sprite;
    stars?: Physics.Arcade.Group;
    bombSpawner?: BombSpawner;
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    scoreLabel?: ScoreLabel;
    gameOver = false;

    // construct the scene
    // (actually I have no clue how this works in Phaser. Life of a noob.)
    constructor() {
        super("GettingStartedScene");
    }

    // happens once when the game has loaded/starts
    create() {
        // background
        this.add.image(400, 300, SKY_KEY);

        // UI text
        this.scoreLabel = this.createScoreLabel(32, 32, 0);

        // controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // setup game objects
        this.platforms = this.createPlatforms();
        this.player = this.createPlayer();
        this.stars = this.createStars();
        this.bombSpawner = new BombSpawner(this, BOMB_KEY);

        // handle physics
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombSpawner.group, this.platforms);

        // handle collision
        // player collects stars
        this.physics.add.overlap(
            this.player as GameObjects.GameObject,
            this.stars,
            this.handleCollectStar,
            undefined,
            this
        );

        // player gets hit by bombs
        this.physics.add.collider(
            this.player as GameObjects.GameObject,
            this.bombSpawner.group,
            this.handleHitBomb,
            undefined,
            this
        );
    }

    // happens before the game loads
    preload() {
        // load all images/sprites
        this.load.image(SKY_KEY, skySprite);
        this.load.image(GROUND_KEY, groundSprite);
        this.load.image(STAR_KEY, starSprite);
        this.load.image(BOMB_KEY, bombSprite);

        // load spritesheets
        this.load.spritesheet(DUDE_KEY, dudeSprite, {
            frameWidth: 32,
            frameHeight: 48,
        });
    }

    // happens each frame
    update() {
        // validate controls exist
        if (!this.cursors) {
            return;
        }

        if (this.cursors.left?.isDown) {
            // move left
            this.player?.setVelocityX(-160);
            this.player?.anims.play(KEY_ANIM_LEFT, true);
        } else if (this.cursors.right?.isDown) {
            // move right
            this.player?.setVelocityX(160);
            this.player?.anims.play(KEY_ANIM_RIGHT, true);
        } else {
            // idle
            this.player?.setVelocityX(0);
            this.player?.anims.play(KEY_ANIM_TURN);
        }

        // Van Halen - Jump
        if (this.cursors.up?.isDown && this.player?.body.touching.down) {
            this.player?.setVelocityY(-330);
        }
    }

    private createScoreLabel(x: number, y: number, score: number) {
        const style = {
            fontSize: "32px",
            fill: "#000",
        };
        const label = new ScoreLabel(this, x, y, score, style);
        this.add.existing(label);
        return label;
    }

    private createPlatforms() {
        const platforms = this.physics.add.staticGroup();
        (platforms.create(400, 568, GROUND_KEY) as Phaser.Physics.Arcade.Sprite)
            .setScale(2)
            .refreshBody();
        platforms.create(600, 400, GROUND_KEY);
        platforms.create(50, 250, GROUND_KEY);
        platforms.create(750, 220, GROUND_KEY);

        return platforms;
    }

    private createPlayer() {
        const player = this.physics.add.sprite(100, 450, DUDE_KEY);
        player?.setBounce(0.2);
        player?.setCollideWorldBounds(true);
        // player.setGravityY(300);

        this.createPlayerAnimations();

        return player;
    }

    private createPlayerAnimations() {
        this.anims.create({
            key: KEY_ANIM_LEFT,
            frames: this.anims.generateFrameNumbers(DUDE_KEY, {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: KEY_ANIM_TURN,
            frames: [{ key: DUDE_KEY, frame: 4 }],
            frameRate: 20,
        });

        this.anims.create({
            key: KEY_ANIM_RIGHT,
            frames: this.anims.generateFrameNumbers(DUDE_KEY, {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });
    }

    private createStars() {
        const stars = this.physics.add.group({
            key: STAR_KEY,
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 },
        });
        // each star will have a different bounce (this makes the game look more vivid)
        stars.children.iterate((child) => {
            const c = child as Phaser.Physics.Arcade.Image;
            c.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        return stars;
    }

    // the player touches a star
    // apparently phaser wants us to use the type gameObject..
    private handleCollectStar(
        player: GameObjects.GameObject,
        star: GameObjects.GameObject
    ) {
        const s = star as Physics.Arcade.Image;
        // update score
        if (this.scoreLabel) {
            s.disableBody(true, true);
            this.scoreLabel.add(10);
        }
        // we collected all stars
        if (this.stars?.countActive(true) === 0) {
            // spawn new stars!
            this.stars.children.iterate((c) => {
                const child = c as Phaser.Physics.Arcade.Image;
                child.enableBody(true, child.x, 0, true, true);
            });
            // ...and a deadly bomb
            this.bombSpawner?.spawnBombs();
        }
    }

    // the player touches a bomb
    private handleHitBomb(
        player: GameObjects.GameObject,
        bomb: GameObjects.GameObject
    ) {
        this.physics.pause();
        this.player?.setTint(0xff0000).anims.play(KEY_ANIM_TURN);
        this.gameOver = true;
    }
}

export default GettingStartedScene;
