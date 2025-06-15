import Phaser from 'phaser';

export class BackgroundManager {
    private scene: Phaser.Scene;
    private background!: Phaser.GameObjects.Image;
    private readonly backgroundMapping: { [key: string]: string } = {
        // Exposition and Opening scenes
        '1': 'scenery_0',    // Village scene
        '2': 'scenery_0',    // Village scene
        '3': 'scenery_1',    // Road scene
        '4': 'scenery_0',    // Village scene
        '5': 'scenery_2',    // Vine scene
        '5a': 'scenery_3',   // Castle scene
        '6': 'scenery_4',    // Giant castle scene
        '7': 'scenery_5',    // Inside castle scene
        '8': 'scenery_2',    // Vine scene
        '9': 'scenery_0',    // Village scene
        '10': 'scenery_0',   // Village scene
        '11': 'scenery_1',   // Road scene
        '12': 'scenery_0',   // Village scene
        '13': 'scenery_0',   // Village scene
        '14': 'scenery_1',   // Road scene
        '15': 'scenery_1',   // Road scene
        '16': 'scenery_1',   // Road scene
        '17': 'scenery_6',   // Black scene
        '18': 'scenery_5',   // Inside castle scene
    };

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.createBackground();
    }

    private createBackground(): void {
        this.background = this.scene.add.image(640, 360, "village");
        this.background.setScale(1);
    }

    public updateBackground(passageId: string): void {
        const backgroundKey = this.backgroundMapping[passageId];

        if (!backgroundKey) {
            this.background.setTexture('black');
            // If black texture doesn't exist, create a black rectangle
            if (!this.scene.textures.exists('black')) {
                const graphics = this.scene.make.graphics();
                graphics.fillStyle(0x000000);
                graphics.fillRect(0, 0, 1280, 720);
                graphics.generateTexture('black', 1280, 720);
                graphics.destroy();
            }
        } else {
            this.background.setTexture(backgroundKey);
        }
    }
} 