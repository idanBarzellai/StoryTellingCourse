import Phaser from 'phaser';

export class AudioManager {
    private scene: Phaser.Scene;
    private backgroundMusic!: Phaser.Sound.BaseSound;
    private isMuted: boolean = false;
    private muteButton!: Phaser.GameObjects.Image;
    private currentVoiceOver: Phaser.Sound.BaseSound | null = null;

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

    private loadAndPlayVoice(voiceKey: string): void {
        const path = `assets/sounds/voices/${voiceKey}.mp3`;
        console.log(`Loading and playing voice: ${voiceKey} from ${path}`);

        // First check if it's already loaded
        if (this.scene.cache.audio.exists(voiceKey)) {
            console.log(`Voice already loaded: ${voiceKey}`);
            this.playVoice(voiceKey);
            return;
        }

        // Check if the file exists before trying to load it
        fetch(path)
            .then(response => {
                if (!response.ok) {
                    console.log(`Voice file not found: ${voiceKey} (this is normal if the file doesn't exist)`);
                    return;
                }
                // If file exists, load and play it
                this.scene.load.audio(voiceKey, path);
                this.scene.load.once(`filecomplete-audio-${voiceKey}`, () => {
                    console.log(`Voice loaded successfully: ${voiceKey}`);
                    this.playVoice(voiceKey);
                });
                this.scene.load.start();
            })
            .catch(() => {
                console.log(`Voice file not found: ${voiceKey} (this is normal if the file doesn't exist)`);
            });
    }

    private playVoice(voiceKey: string): void {
        if (this.currentVoiceOver) {
            this.currentVoiceOver.stop();
            this.currentVoiceOver = null;
        }

        try {
            this.currentVoiceOver = this.scene.sound.add(voiceKey, {
                volume: 0.1
            });
            this.currentVoiceOver.play();
            console.log(`Playing voice: ${voiceKey}`);
        } catch (error) {
            console.log(`Could not play voice ${voiceKey}: File may not exist`);
        }
    }

    public playVoiceOver(passage: { text: string, speaker?: string }): void {
        // If no speaker is specified, don't play any voice
        if (!passage.speaker) {
            console.log('No speaker specified in passage');
            return;
        }

        // Get the emotion for the specified speaker
        const lines = passage.text.split('\n');
        let emotion = '';

        for (const line of lines) {
            if (line.startsWith('[') && line.includes(':')) {
                const emotionText = line.slice(1, -1);
                const [character, charEmotion] = emotionText.split(':');
                if (character === passage.speaker && charEmotion) {
                    emotion = charEmotion.toLowerCase();
                    break;
                }
            }
        }

        // If we found the emotion for the speaker, play the voice over
        if (emotion) {
            const voiceKey = `${passage.speaker}_${emotion}`;
            console.log(`Found voice key: ${voiceKey}`);
            this.loadAndPlayVoice(voiceKey);
        } else {
            console.log(`No emotion found for speaker: ${passage.speaker}`);
        }
    }

    private toggleMute(): void {
        this.isMuted = !this.isMuted;
        this.scene.sound.mute = this.isMuted;
        this.muteButton.setTexture(this.isMuted ? 'mute' : 'unmute');
    }
} 