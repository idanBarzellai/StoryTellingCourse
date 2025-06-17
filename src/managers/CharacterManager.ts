import Phaser from 'phaser';

export class CharacterManager {
    private scene: Phaser.Scene;
    private characters: Map<string, Phaser.GameObjects.Sprite>;
    private characterEmotions: Map<string, string>;
    private readonly CHARACTER_SCALE = 0.25;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.characters = new Map();
        this.characterEmotions = new Map();
        this.initializeCharacters();
    }

    private initializeCharacters(): void {
        // Create all possible characters with their initial states
        this.createCharacter('main_char', 880, 300, 'main_char_main_char');
        this.createCharacter('npc_1', 400, 300, 'npc_1_npc_1');
        this.createCharacter('npc_2', 400, 300, 'npc_2_npc_2');
        this.createCharacter('npc_3', 400, 300, 'npc_3_npc_3');
    }

    public createCharacter(name: string, x: number, y: number, texture: string): void {
        // Check if texture exists
        if (!this.scene.textures.exists(texture)) {
            console.error(`Texture not found: ${texture}`);
            return;
        }

        const sprite = this.scene.add.sprite(x, y, texture);
        sprite.setOrigin(0.5);
        sprite.setScale(this.CHARACTER_SCALE);
        sprite.setVisible(false);
        sprite.setDepth(500); // Ensure characters are above background but below UI
        this.characters.set(name, sprite);

    }

    public updateCharacter(character: string, emotion: string): void {
        const characterKey = character.toLowerCase();
        const emotionKey = emotion.toLowerCase();
        const textureKey = `${characterKey}_${emotionKey}`;
        const sprite = this.characters.get(character);

        if (sprite) {
            // Check if texture exists
            if (!this.scene.textures.exists(textureKey)) {
                console.error(`Texture not found: ${textureKey}`);
                return;
            }

            // Always stop any existing animations
            this.scene.tweens.killTweensOf(sprite);

            // Update texture and visibility
            sprite.setTexture(textureKey);
            sprite.setVisible(true);

            // Always play the emotion animation, even if the character is already visible
            // with the same emotion
            this.playEmotionAnimation(sprite, emotionKey);
        } else {
            console.error(`Character not found: ${character}`);
        }
    }

    private playEmotionAnimation(sprite: Phaser.GameObjects.Sprite, emotion: string): void {
        // Ensure all tweens are killed
        this.scene.tweens.killTweensOf(sprite);
        sprite.setScale(this.CHARACTER_SCALE); // Reset scale
        sprite.setAngle(0); // Reset angle

        switch (emotion) {
            case 'laugh':
            case 'excited':
            case 'happy':
                this.scene.tweens.add({
                    targets: sprite,
                    y: sprite.y - 5,
                    duration: 1000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                break;
            case 'sad':
            case 'sleeping':
            case 'crying':
                this.scene.tweens.add({
                    targets: sprite,
                    angle: -2,
                    duration: 1500,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                break;
            case 'stressed':
            case 'shocked':
            case 'surprised':
            case 'angry':
                this.scene.tweens.add({
                    targets: sprite,
                    scaleX: sprite.scaleX * 1.04,
                    duration: 500,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                break;
            case 'confused':
            case 'annoyed':
            case 'suspicious':
                this.scene.tweens.add({
                    targets: sprite,
                    angle: 2,
                    duration: 2000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                break;
        }
    }

    public hideAllCharacters(): void {
        this.characters.forEach(sprite => {
            // Kill all tweens
            this.scene.tweens.killTweensOf(sprite);
            // Reset transform properties
            sprite.setScale(this.CHARACTER_SCALE);
            sprite.setAngle(0);
            sprite.setVisible(false);
        });
    }

    public showCharacter(character: string): void {
        const sprite = this.characters.get(character);
        const emotion = this.characterEmotions.get(character);

        if (sprite && emotion) {
            sprite.setVisible(true);
            this.playEmotionAnimation(sprite, emotion);
        }
    }
} 