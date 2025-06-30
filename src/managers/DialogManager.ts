import Phaser from 'phaser';
import { Typewriter } from '../utils/Typewriter';

export class DialogManager {
    private scene: Phaser.Scene;
    private dialogBox!: Phaser.GameObjects.Sprite;
    private dialogText!: Phaser.GameObjects.BitmapText;
    private typewriter!: Typewriter;
    private readonly VISIBLE_TEXT_WIDTH = 0.95;
    private readonly DIALOG_BOX_VISIBLE_HEIGHT = 0.7;
    private readonly MIN_TEXT_SCALE = 0.5;
    private readonly MAX_TEXT_SCALE = 1.0;
    private readonly FONT_SIZE = 30;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.createDialogBox();
    }

    private createDialogBox(): void {
        // Create dialog box
        this.dialogBox = this.scene.add.sprite(640, 470, "dialog_box");
        this.dialogBox.setOrigin(0.5);
        this.dialogBox.setInteractive();
        this.dialogBox.setDepth(1000); // Ensure it's above other elements

        // Create dialog text
        this.dialogText = this.scene.add.bitmapText(640, 470, 'your_font', "", this.FONT_SIZE);
        this.dialogText.setOrigin(0.5);
        this.dialogText.setMaxWidth(this.dialogBox.width * this.VISIBLE_TEXT_WIDTH);
        this.dialogText.setCenterAlign();
        this.dialogText.setLineSpacing(6);
        this.dialogText.setDepth(1001); // Ensure it's above the dialog box

        // Create typewriter for dialog text
        this.typewriter = new Typewriter(this.scene, this.dialogText, {
            maxScale: this.MAX_TEXT_SCALE,
            minScale: this.MIN_TEXT_SCALE,
            visibleWidth: this.VISIBLE_TEXT_WIDTH,
            visibleHeight: this.DIALOG_BOX_VISIBLE_HEIGHT,
            fontSize: this.FONT_SIZE
        });
    }

    public setText(text: string): void {
        // For instant text display (no typewriter)
        const wrappedText = this.typewriter["wrapText"](text, this.dialogBox.width * this.VISIBLE_TEXT_WIDTH);
        this.dialogText.setText(wrappedText);
        const scale = this.typewriter["calculateFinalScale"](text, this.dialogBox.width, this.dialogBox.height);
        this.dialogText.setScale(scale);
    }

    public setTextWithTypewriter(text: string, speed: number = 30, onComplete?: () => void): void {
        this.typewriter.start(
            text,
            this.dialogBox.width,
            this.dialogBox.height,
            speed,
            onComplete
        );
    }

    public skipTypewriter(): void {
        this.typewriter.skip(this.dialogBox.width);
    }

    public setClickHandler(callback: () => void): void {
        this.dialogBox.removeAllListeners('pointerdown');
        this.dialogBox.once('pointerdown', () => {
            callback();
        });
    }

    public isTypewriterRunning(): boolean {
        return this.typewriter && this.typewriter.isRunning();
    }
} 