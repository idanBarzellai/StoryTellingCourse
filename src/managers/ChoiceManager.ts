import Phaser from 'phaser';
import { ILink } from '../interfaces/IStoryData';
import VisualNovel from '~/scenes/VisualNovel';
import { Typewriter } from '../utils/Typewriter';

export class ChoiceManager {
    private scene: Phaser.Scene;
    private choiceButtons: Phaser.GameObjects.Sprite[];
    private choiceTexts: Phaser.GameObjects.BitmapText[];
    private typewriters: Typewriter[];
    private readonly VISIBLE_TEXT_WIDTH = 0.9;
    private readonly VISIBLE_TEXT_HEIGHT = 0.7;
    private readonly MIN_TEXT_SCALE = 0.5;
    private readonly MAX_TEXT_SCALE = 1.0;
    private readonly FONT_SIZE = 50;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.choiceButtons = [];
        this.choiceTexts = [];
        this.typewriters = [];
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
        const text1 = this.scene.add.bitmapText(400, 645, 'your_font', "", this.FONT_SIZE);
        const text2 = this.scene.add.bitmapText(880, 645, 'your_font', "", this.FONT_SIZE);
        text1.setOrigin(0.5);
        text2.setOrigin(0.5);
        text1.setCenterAlign();
        text2.setCenterAlign();
        text1.setDepth(1001);
        text2.setDepth(1001);
        this.choiceTexts = [text1, text2];

        // Create typewriters for each choice text
        this.typewriters = [
            new Typewriter(this.scene, text1, {
                maxScale: this.MAX_TEXT_SCALE,
                minScale: this.MIN_TEXT_SCALE,
                visibleWidth: this.VISIBLE_TEXT_WIDTH,
                visibleHeight: this.VISIBLE_TEXT_HEIGHT,
                fontSize: this.FONT_SIZE
            }),
            new Typewriter(this.scene, text2, {
                maxScale: this.MAX_TEXT_SCALE,
                minScale: this.MIN_TEXT_SCALE,
                visibleWidth: this.VISIBLE_TEXT_WIDTH,
                visibleHeight: this.VISIBLE_TEXT_HEIGHT,
                fontSize: this.FONT_SIZE
            })
        ];

        // Hide all choices initially
        this.hideChoices();
    }

    public showChoices(links: ILink[], callback: (nextPassageId: number) => void, autoPlay: boolean = false): void {
        this.hideChoices(); // Always start by hiding all choices to clear previous state
        if (links.length === 0) {
            return;
        }

        // Show only as many choices as we have links
        for (let i = 0; i < this.choiceButtons.length; i++) {
            this.choiceButtons[i].removeAllListeners('pointerdown');
            this.choiceTexts[i].setText(''); // Clear text first
            this.choiceTexts[i].setVisible(false); // Always start hidden
            if (i < links.length) {
                this.choiceButtons[i].setVisible(true);
                // Only make the first choice text visible now
                if (i === 0) this.choiceTexts[i].setVisible(true);
            } else {
                this.choiceButtons[i].setVisible(false);
            }
        }

        // Sequential typewriter effect for choices
        if (links.length > 0) {
            this.typewriters[0].start(
                links[0].linkText,
                this.choiceButtons[0].width,
                this.choiceButtons[0].height,
                30,
                () => {
                    if (links.length > 1) {
                        // Make the second choice text visible right before animating
                        this.choiceTexts[1].setVisible(true);
                        this.typewriters[1].start(
                            links[1].linkText,
                            this.choiceButtons[1].width,
                            this.choiceButtons[1].height,
                            30
                        );
                        if (autoPlay) {
                            this.skipTypewriter(1);
                        }
                    }
                }
            );
            if (autoPlay) {
                this.skipTypewriter(0);
            }
        }

        // Set up click handlers (these can be set immediately, as the buttons are visible)
        for (let i = 0; i < links.length; i++) {
            this.choiceButtons[i].on('pointerdown', () => {
                (this.scene as VisualNovel).audioManager?.playChoiceSound(i);
                this.hideChoices(); // Hide choices immediately after click
                callback(links[i].passageId); // This is now a number
            });
        }
    }

    public hideChoices(): void {
        this.choiceButtons.forEach(button => button.setVisible(false));
        this.choiceTexts.forEach(text => {
            text.setVisible(false);
            text.setText('');
        });
    }

    public skipTypewriter(index: number): void {
        this.typewriters[index].skip(this.choiceButtons[index].width);
    }

    public isTypewriterRunning(index: number): boolean {
        return this.typewriters[index] && this.typewriters[index].isRunning();
    }
} 