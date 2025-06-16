import Phaser from 'phaser';

export class CharacterManager {
    private scene: Phaser.Scene;
    private characters: Map<string, Phaser.GameObjects.Sprite>;
    private readonly CHARACTER_SCALE = 0.25;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.characters = new Map();
        this.initializeCharacters();
    }

    private initializeCharacters(): void {
        // Create all possible characters with their initial states
        this.createCharacter('main_char', 880, 300, 'main_char_happy');
        this.createCharacter('npc_1', 400, 300, 'npc_1_happy');
        this.createCharacter('npc_2', 400, 300, 'npc_2_suspicious');
        this.createCharacter('npc_3', 400, 300, 'npc_3_angry');
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

            sprite.setTexture(textureKey);
            sprite.setVisible(true);
            this.playEmotionAnimation(sprite, emotionKey);
        } else {
            console.error(`Character not found: ${character}`);
        }
    }

    private playEmotionAnimation(sprite: Phaser.GameObjects.Sprite, emotion: string): void {
        // Stop any existing animations
        this.scene.tweens.killTweensOf(sprite);

        switch (emotion) {
            case 'laugh':
            case 'happy':
                this.scene.tweens.add({
                    targets: sprite,
                    y: sprite.y - 5,
                    duration: 1000,
                    yoyo: true,
                    repeat: -1
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
                    repeat: -1
                });
                break;
            case 'stressed':
            case 'angry':
                this.scene.tweens.add({
                    targets: sprite,
                    scaleX: sprite.scaleX * 1.04,
                    duration: 500,
                    yoyo: true,
                    repeat: -1
                });
                break;
            case 'confused':
            case 'suspicious':
                this.scene.tweens.add({
                    targets: sprite,
                    angle: 2,
                    duration: 2000,
                    yoyo: true,
                    repeat: -1
                });
                break;
        }
    }

    public hideAllCharacters(): void {
        this.characters.forEach(sprite => {
            sprite.setVisible(false);
            this.scene.tweens.killTweensOf(sprite); // Stop any animations
        });
    }
} 