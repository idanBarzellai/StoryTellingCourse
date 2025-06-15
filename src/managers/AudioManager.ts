import Phaser from 'phaser';

export class AudioManager {
    private scene: Phaser.Scene;
    private backgroundMusic!: Phaser.Sound.BaseSound;
    private isMuted: boolean = false;
    private muteButton!: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.createMuteButton();
    }

    private createMuteButton(): void {
        this.muteButton = this.scene.add.image(28, 40, 'unmute')
            .setOrigin(0.5)
            .setScale(0.5)
            .setInteractive({ useHandCursor: true });
        this.muteButton.setScrollFactor(0);
        this.muteButton.setDepth(1000);
        this.muteButton.on('pointerdown', () => this.toggleMute());
    }

    public playBackgroundMusic(): void {
        this.backgroundMusic = this.scene.sound.add('background_music', {
            volume: 0.03,
            loop: true
        });
        this.backgroundMusic.play();
    }

    public playChoiceSound(choiceNumber: number): void {
        this.scene.sound.play(`choice_${choiceNumber}`, { volume: 0.05 });
    }

    private toggleMute(): void {
        this.isMuted = !this.isMuted;
        this.scene.sound.mute = this.isMuted;
        this.muteButton.setTexture(this.isMuted ? 'mute' : 'unmute');
    }
} 