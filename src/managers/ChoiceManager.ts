import Phaser from 'phaser';
import { ILink } from '../interfaces/IStoryData';
import VisualNovel from '~/scenes/VisualNovel';

export class ChoiceManager {
    private scene: Phaser.Scene;
    private choiceButtons: Phaser.GameObjects.Sprite[];
    private choiceTexts: Phaser.GameObjects.BitmapText[];
    private readonly VISIBLE_TEXT_WIDTH = 0.9;
    private readonly VISIBLE_TEXT_HEIGHT = 0.7;
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
        const button1 = this.scene.add.sprite(400, 640, 'choice_button');
        const button2 = this.scene.add.sprite(880, 640, 'choice_button');

        button1.setInteractive();
        button2.setInteractive();
        button1.setDepth(1000);
        button2.setDepth(1000);
        this.choiceButtons = [button1, button2];

        // Create choice texts
        const text1 = this.scene.add.bitmapText(400, 645, 'your_font', "", 50);
        const text2 = this.scene.add.bitmapText(880, 645, 'your_font', "", 50);
        text1.setOrigin(0.5);
        text2.setOrigin(0.5);
        text1.setCenterAlign();
        text2.setCenterAlign();
        text1.setDepth(1001);
        text2.setDepth(1001);
        this.choiceTexts = [text1, text2];

        // Hide all choices initially
        this.hideChoices();
    }

    public showChoices(links: ILink[], callback: (nextPassageId: number) => void): void {
        this.hideChoices(); // Always start by hiding all choices to clear previous state
        if (links.length === 0) {
            return;
        }

        // Show only as many choices as we have links
        for (let i = 0; i < this.choiceButtons.length; i++) {
            // Remove all previous listeners before adding new one
            this.choiceButtons[i].removeAllListeners('pointerdown');
            if (i < links.length) {
                this.choiceButtons[i].setVisible(true);
                this.choiceTexts[i].setVisible(true);
                this.choiceTexts[i].setText(links[i].linkText);
                this.adjustTextScale(i);

                // Set up click handler
                this.choiceButtons[i].on('pointerdown', () => {
                    (this.scene as VisualNovel).audioManager?.playChoiceSound(i);

                    this.hideChoices(); // Hide choices immediately after click
                    callback(links[i].passageId); // This is now a number
                });
            } else {
                this.choiceButtons[i].setVisible(false);
                this.choiceTexts[i].setVisible(false);
            }
        }
    }

    private adjustTextScale(index: number): void {
        const text = this.choiceTexts[index];
        const button = this.choiceButtons[index];

        // Wrap the text first
        const wrappedText = this.wrapText(
            text.text,
            button.width * this.VISIBLE_TEXT_WIDTH,
            50
        );
        text.setText(wrappedText);

        // Start with maximum scale
        text.setScale(this.MAX_TEXT_SCALE);

        // Get the text bounds
        const bounds = text.getTextBounds();
        const textWidth = bounds.global.width;
        const textHeight = bounds.global.height;

        // If text is too wide or too tall, scale it down
        if (textWidth > button.width * this.VISIBLE_TEXT_WIDTH ||
            textHeight > button.height * this.VISIBLE_TEXT_HEIGHT) {
            const widthScale = (button.width * this.VISIBLE_TEXT_WIDTH) / textWidth;
            const heightScale = (button.height * this.VISIBLE_TEXT_HEIGHT) / textHeight;
            const scale = Math.min(widthScale, heightScale, this.MAX_TEXT_SCALE);

            // Ensure we don't go below minimum scale
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

    public hideChoices(): void {
        this.choiceButtons.forEach(button => button.setVisible(false));
        this.choiceTexts.forEach(text => text.setVisible(false));
    }
} 