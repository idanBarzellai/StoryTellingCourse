import Phaser from 'phaser';
import { ILink } from '../interfaces/IStoryData';

export class ChoiceManager {
    private scene: Phaser.Scene;
    private choiceButtons: Phaser.GameObjects.Sprite[];
    private choiceTexts: Phaser.GameObjects.BitmapText[];
    private readonly VISIBLE_TEXT_WIDTH = 0.9;
    private readonly CHOICE_BOX_VISIBLE_HEIGHT = 0.6;
    private readonly MIN_TEXT_SCALE = 0.5;
    private readonly MAX_TEXT_SCALE = 1.0;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.choiceButtons = [];
        this.choiceTexts = [];
        this.createChoiceButtons();
    }

    private createChoiceButtons(): void {
        // Create choice buttons
        const button1 = this.scene.add.sprite(400, 645, "choice_button");
        const button2 = this.scene.add.sprite(880, 645, "choice_button");
        button1.setOrigin(0.5);
        button2.setOrigin(0.5);
        button1.setInteractive();
        button2.setInteractive();
        button1.setDepth(1000);
        button2.setDepth(1000);
        this.choiceButtons = [button1, button2];

        // Create choice texts
        const text1 = this.scene.add.bitmapText(400, 645, 'children_book_font', "", 50);
        const text2 = this.scene.add.bitmapText(880, 645, 'children_book_font', "", 50);
        text1.setOrigin(0.5);
        text2.setOrigin(0.5);
        text1.setCenterAlign();
        text2.setCenterAlign();
        text1.setDepth(1001);
        text2.setDepth(1001);
        this.choiceTexts = [text1, text2];

        // Hide all initially
        this.hideAll();
    }

    public showChoices(links: ILink[], onChoiceSelected: (passageName: string) => void): void {
        // Hide all first to ensure clean state
        this.hideAll();

        links.forEach((link, index) => {
            if (index < 2) { // Only show up to 2 choices
                const button = this.choiceButtons[index];
                const text = this.choiceTexts[index];

                // Set text first
                const wrappedText = this.wrapText(
                    link.linkText,
                    button.width * this.VISIBLE_TEXT_WIDTH,
                    50
                );
                text.setText(wrappedText);
                this.adjustTextScale(
                    text,
                    button.width * this.VISIBLE_TEXT_WIDTH,
                    button.height * this.CHOICE_BOX_VISIBLE_HEIGHT
                );

                // Make visible after text is set
                button.setVisible(true);
                text.setVisible(true);

                // Set up click handler
                button.once('pointerdown', () => {
                    this.scene.sound.play(`choice_${index + 1}`, { volume: 0.05 });
                    // Hide immediately on click
                    this.hideAll();
                    onChoiceSelected(link.passageName);
                });
            }
        });
    }

    private adjustTextScale(text: Phaser.GameObjects.BitmapText, maxWidth: number, maxHeight: number): void {
        // Reset scale to maximum
        text.setScale(this.MAX_TEXT_SCALE);

        // Get the text bounds
        const bounds = text.getTextBounds();
        const textWidth = bounds.global.width;
        const textHeight = bounds.global.height;

        // If text is too wide or too tall, scale it down
        if (textWidth > maxWidth || textHeight > maxHeight) {
            const widthScale = maxWidth / textWidth;
            const heightScale = maxHeight / textHeight;
            const scale = Math.min(widthScale, heightScale, this.MAX_TEXT_SCALE);

            // Ensure scale doesn't go below minimum
            const finalScale = Math.max(scale, this.MIN_TEXT_SCALE);
            text.setScale(finalScale);
        }
    }

    private wrapText(text: string, maxWidth: number, fontSize: number): string {
        const words = text.split(' ');
        let line = '';
        let result = '';

        for (let i = 0; i < words.length; i++) {
            const testLine = line + (line ? ' ' : '') + words[i];
            const temp = this.scene.add.bitmapText(0, 0, 'children_book_font', testLine, fontSize);
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

    public hideAll(): void {
        this.choiceButtons.forEach(button => button.setVisible(false));
        this.choiceTexts.forEach(text => {
            text.setText(''); // Clear text when hiding
            text.setVisible(false);
        });
    }
} 