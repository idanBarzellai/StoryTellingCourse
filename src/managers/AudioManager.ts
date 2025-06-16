import Phaser from 'phaser';
import { IPassage } from '../interfaces/IStoryData';

export class AudioManager {
    private scene: Phaser.Scene;
    private backgroundMusic: Phaser.Sound.BaseSound | null = null;
    private isMuted: boolean = false;
    private muteButton?: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.createMuteButton();
    }

    private createMuteButton(): void {
        this.muteButton = this.scene.add.sprite(28, 40, 'unmute').setOrigin(0.5)
            .setScale(0.5);
        this.muteButton.setInteractive(); this.muteButton.setScrollFactor(0);

        this.muteButton.on('pointerdown', () => this.toggleMute());
        this.muteButton.setDepth(1000);
    }

    public playBackgroundMusic(): void {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
        }

        this.backgroundMusic = this.scene.sound.add('background_music', {
            volume: 0.1,
            loop: true
        });

        if (!this.isMuted) {
            this.backgroundMusic.play();
        }
    }

    public playVoiceOver(passage: IPassage): void {
        if (this.isMuted) return;

        // Get the speaker and emotions from the passage
        const speaker = passage.speaker;
        const emotions = passage.emotions || [];

        // Find the emotion for the speaker
        const speakerEmotion = emotions.find(e => e.character === speaker)?.emotion;

        if (speakerEmotion) {
            // Play the appropriate voice over sound
            const soundKey = `${speaker}_${speakerEmotion.toLowerCase()}`;
            if (this.scene.sound.get(soundKey)) {
                this.scene.sound.play(soundKey, { volume: 0.7 });
            }
        }
    }

    public playChoiceSound(choiceIndex: number): void {
        if (this.isMuted) return;

        const soundKey = `choice_${choiceIndex + 1}`;
        // If the sound exists in cache but hasn't been added to sound manager, add it
        if (this.scene.cache.audio.exists(soundKey)) {
            this.scene.sound.add(soundKey);
            this.scene.sound.play(soundKey, { volume: 0.5 });
        }
    }

    private toggleMute(): void {
        this.isMuted = !this.isMuted;

        if (this.backgroundMusic) {
            if (this.isMuted) {
                this.backgroundMusic.pause();
            } else {
                this.backgroundMusic.resume();
            }
        }

        this.muteButton?.setTexture(this.isMuted ? 'mute' : 'unmute');
    }
} 