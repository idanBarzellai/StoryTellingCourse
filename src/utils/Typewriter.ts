import Phaser from 'phaser';

export class Typewriter {
    private scene: Phaser.Scene;
    private bitmapText: Phaser.GameObjects.BitmapText;
    private fullText: string = '';
    private typewriterTimer?: Phaser.Time.TimerEvent;
    private currentCharIndex: number = 0;
    private isTyping: boolean = false;
    private readonly maxScale: number;
    private readonly minScale: number;
    private readonly visibleWidth: number;
    private readonly visibleHeight: number;
    private readonly fontSize: number;
    private onCompleteCallback?: () => void;

    constructor(
        scene: Phaser.Scene,
        bitmapText: Phaser.GameObjects.BitmapText,
        options: {
            maxScale: number,
            minScale: number,
            visibleWidth: number,
            visibleHeight: number,
            fontSize: number
        }
    ) {
        this.scene = scene;
        this.bitmapText = bitmapText;
        this.maxScale = options.maxScale;
        this.minScale = options.minScale;
        this.visibleWidth = options.visibleWidth;
        this.visibleHeight = options.visibleHeight;
        this.fontSize = options.fontSize;
    }

    private wrapText(text: string, maxWidth: number): string {
        const words = text.split(' ');
        let line = '';
        let result = '';

        for (let i = 0; i < words.length; i++) {
            const testLine = line + (line ? ' ' : '') + words[i];
            const temp = this.scene.add.bitmapText(0, 0, this.bitmapText.font, testLine, this.fontSize);
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

    private calculateFinalScale(text: string, boxWidth: number, boxHeight: number): number {
        const wrapped = this.wrapText(text, boxWidth * this.visibleWidth);
        this.bitmapText.setText(wrapped);
        this.bitmapText.setScale(this.maxScale);
        const bounds = this.bitmapText.getTextBounds();
        const textWidth = bounds.global.width;
        const textHeight = bounds.global.height;
        const widthScale = (boxWidth * this.visibleWidth) / textWidth;
        const heightScale = (boxHeight * this.visibleHeight) / textHeight;
        const scale = Math.min(widthScale, heightScale, this.maxScale);
        return Math.max(scale, this.minScale);
    }

    public start(
        text: string,
        boxWidth: number,
        boxHeight: number,
        speed: number = 30,
        onComplete?: () => void
    ) {
        this.fullText = text;
        this.currentCharIndex = 0;
        this.isTyping = true;
        this.bitmapText.setText('');
        const scale = this.calculateFinalScale(text, boxWidth, boxHeight);
        this.bitmapText.setScale(scale);
        if (this.typewriterTimer) {
            this.typewriterTimer.remove(false);
        }
        this.onCompleteCallback = onComplete;

        this.typewriterTimer = this.scene.time.addEvent({
            delay: speed,
            repeat: text.length - 1,
            callback: () => {
                this.currentCharIndex++;
                const partial = this.fullText.substring(0, this.currentCharIndex);
                const wrapped = this.wrapText(partial, boxWidth * this.visibleWidth);
                this.bitmapText.setText(wrapped);
                if (this.currentCharIndex >= this.fullText.length) {
                    this.isTyping = false;
                    if (this.onCompleteCallback) {
                        this.onCompleteCallback();
                        this.onCompleteCallback = undefined;
                    }
                }
            }
        });
    }

    public skip(boxWidth: number) {
        if (this.isTyping) {
            if (this.typewriterTimer) {
                this.typewriterTimer.remove(false);
            }
            const wrapped = this.wrapText(this.fullText, boxWidth * this.visibleWidth);
            this.bitmapText.setText(wrapped);
            this.isTyping = false;
            if (this.onCompleteCallback) {
                this.onCompleteCallback();
                this.onCompleteCallback = undefined;
            }
        }
    }

    public isRunning() {
        return this.isTyping;
    }
} 