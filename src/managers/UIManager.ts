import Phaser from 'phaser';

export class UIManager {
    private scene: Phaser.Scene;
    private muteButton?: Phaser.GameObjects.Sprite;
    private autoPlayButton?: Phaser.GameObjects.Sprite;
    private isMuted: boolean = false;
    private autoPlay: boolean = false;
    private onAutoPlayChange?: (autoPlay: boolean) => void;
    private onMuteChange?: (isMuted: boolean) => void;

    constructor(scene: Phaser.Scene, onAutoPlayChange?: (autoPlay: boolean) => void, onMuteChange?: (isMuted: boolean) => void) {
        this.scene = scene;
        this.onAutoPlayChange = onAutoPlayChange;
        this.onMuteChange = onMuteChange;
        this.createMuteButton();
        this.createAutoPlayButton();
    }

    private createMuteButton(): void {
        this.muteButton = this.scene.add.sprite(28, 40, 'unmute').setOrigin(0.5).setScale(0.5);
        this.muteButton.setInteractive();
        this.muteButton.setScrollFactor(0);
        this.muteButton.setDepth(1000);
        this.muteButton.on('pointerdown', () => this.toggleMute());
    }

    private toggleMute(): void {
        this.isMuted = !this.isMuted;
        this.muteButton?.setTexture(this.isMuted ? 'mute' : 'unmute');
        if (this.onMuteChange) {
            this.onMuteChange(this.isMuted);
        }
    }

    private createAutoPlayButton(): void {
        this.autoPlayButton = this.scene.add.sprite(28, 80, 'autoplay_off').setOrigin(0.5).setScale(0.5);
        this.autoPlayButton.setInteractive();
        this.autoPlayButton.setScrollFactor(0);
        this.autoPlayButton.setDepth(1000);
        this.autoPlayButton.on('pointerdown', () => this.toggleAutoPlay());
    }

    private toggleAutoPlay(): void {
        this.autoPlay = !this.autoPlay;
        this.autoPlayButton?.setTexture(this.autoPlay ? 'autoplay_on' : 'autoplay_off');
        if (this.onAutoPlayChange) {
            this.onAutoPlayChange(this.autoPlay);
        }
    }

    public getAutoPlay(): boolean {
        return this.autoPlay;
    }

    public getMute(): boolean {
        return this.isMuted;
    }
} 