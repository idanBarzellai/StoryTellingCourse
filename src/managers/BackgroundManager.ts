import Phaser from 'phaser';
import { IPassage } from '../interfaces/IStoryData';

export class BackgroundManager {
    private scene: Phaser.Scene;
    private currentBackground: Phaser.GameObjects.Sprite | null = null;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public updateBackground(passage: IPassage): void {
        // Remove current background if it exists
        if (this.currentBackground) {
            this.currentBackground.destroy();
        }

        // Create new background using the passage's background field
        this.currentBackground = this.scene.add.sprite(640, 360, passage.background);
        this.currentBackground.setDepth(0);
    }
} 