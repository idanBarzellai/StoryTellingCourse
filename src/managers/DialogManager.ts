import Phaser from 'phaser';

export class DialogManager {
    private scene: Phaser.Scene;
    private dialogBox!: Phaser.GameObjects.Sprite;
    private dialogText!: Phaser.GameObjects.BitmapText;
    private readonly VISIBLE_TEXT_WIDTH = 0.95;
    private readonly DIALOG_BOX_VISIBLE_HEIGHT = 0.7;
    private readonly MIN_TEXT_SCALE = 0.5;
    private readonly MAX_TEXT_SCALE = 1.0;
    private readonly FONT_SIZE = 50;

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
    }

    public setText(text: string): void {
        // Wrap the text first
        const wrappedText = this.wrapText(text, this.dialogBox.width * this.VISIBLE_TEXT_WIDTH, this.FONT_SIZE);
        this.dialogText.setText(wrappedText);
        this.adjustTextScale();
    }

    private adjustTextScale(): void {
        // Reset scale to maximum
        this.dialogText.setScale(this.MAX_TEXT_SCALE);

        // Get the text bounds
        const bounds = this.dialogText.getTextBounds();
        const textWidth = bounds.global.width;
        const textHeight = bounds.global.height;

        // If text is too wide or too tall, scale it down
        if (textWidth > this.dialogBox.width * this.VISIBLE_TEXT_WIDTH ||
            textHeight > this.dialogBox.height * this.DIALOG_BOX_VISIBLE_HEIGHT) {
            const widthScale = (this.dialogBox.width * this.VISIBLE_TEXT_WIDTH) / textWidth;
            const heightScale = (this.dialogBox.height * this.DIALOG_BOX_VISIBLE_HEIGHT) / textHeight;
            const scale = Math.min(widthScale, heightScale, this.MAX_TEXT_SCALE);

            // Ensure scale doesn't go below minimum
            const finalScale = Math.max(scale, this.MIN_TEXT_SCALE);
            this.dialogText.setScale(finalScale);
        }
    }

    public setClickHandler(callback: () => void): void {
        this.dialogBox.removeAllListeners('pointerdown');
        this.dialogBox.once('pointerdown', () => {
            callback();
        });
    }

    private wrapText(text: string, maxWidth: number, fontSize: number): string {
        const words = text.split(' ');
        let line = '';
        let result = '';

        for (let i = 0; i < words.length; i++) {
            const testLine = line + (line ? ' ' : '') + words[i];
            // Create a temp BitmapText to measure width
            const temp = this.scene.add.bitmapText(0, 0, 'your_font', testLine, fontSize);
            const width = temp.getTextBounds().global.width;
            temp.destroy();

            if (width > maxWidth && line) {
                result += line + '\n';
                line = words[i];
            } else {
                line = testLine;
            }
        }

        if (line) result += line;
        return result;
    }
} 