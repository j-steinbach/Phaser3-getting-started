import Phaser from "phaser";

// very ugly, but bypasses 'super' must be called before accessing 'this' in the constructor of a derived class.
const formatScore = (score: number) => `Score: ${score}`;

export default class ScoreLabel extends Phaser.GameObjects.Text {
    score = 0;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        score: number,
        style: Phaser.Types.GameObjects.Text.TextStyle
    ) {
        super(scene, x, y, formatScore(score), style);
    }

    private setScore(score: number) {
        this.score = score;
        this.updateScoreText();
    }
    private updateScoreText() {
        this.setText(formatScore(this.score));
    }

    public add(points: number) {
        this.setScore(this.score + points);
    }
}
