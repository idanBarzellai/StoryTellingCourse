import Phaser from 'phaser';
import { CharacterManager } from '../managers/CharacterManager';
import { DialogManager } from '../managers/DialogManager';
import { ChoiceManager } from '../managers/ChoiceManager';
import { BackgroundManager } from '../managers/BackgroundManager';
import { AudioManager } from '../managers/AudioManager';
import { StoryManager } from '../managers/StoryManager';
import { IPassage } from '../interfaces/IStoryData';

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class VisualNovel extends Phaser.Scene {

	constructor() {
		super("VisualNovel");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {
		// Add black screen first
		this.blackScreen = this.add.rectangle(0, 0, 1280, 720, 0x000000).setOrigin(0);
		this.blackScreen.setDepth(9999); // Ensure it's above everything

		// Add loading text
		this.loadingText = this.add.text(640, 360, "Loading...", {
			fontSize: '32px',
			color: '#ffffff'
		}).setOrigin(0.5);
		this.loadingText.setDepth(10000); // Ensure it's above the black screen

		// main_char
		const main_char = this.add.sprite(880, 308, "happy");
		main_char.scaleX = 0.25;
		main_char.scaleY = 0.25;

		// npc_1
		const npc_1 = this.add.sprite(400, 300, "angry");
		npc_1.scaleX = 0.25;
		npc_1.scaleY = 0.25;

		// dialog_box
		const dialog_box = this.add.sprite(640, 535, "dialog_box");
		dialog_box.scaleX = 0.5;
		dialog_box.scaleY = 0.5;

		// dialog_text
		const dialog_text = this.add.text(640, 480, "", {});
		dialog_text.text = "New text";
		dialog_text.setStyle({});

		// choice_button_1
		this.add.sprite(400, 640, "choice_button");

		// choice_button_2
		this.add.sprite(880, 640, "choice_button");

		// dialog_choice_2
		const dialog_choice_2 = this.add.text(880, 640, "", {});
		dialog_choice_2.text = "New text";
		dialog_choice_2.setStyle({});

		// dialog_choice_1
		const dialog_choice_1 = this.add.text(400, 640, "", {});
		dialog_choice_1.text = "New text";
		dialog_choice_1.setStyle({});

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */
	private characterManager!: CharacterManager;
	private dialogManager!: DialogManager;
	private choiceManager!: ChoiceManager;
	private backgroundManager!: BackgroundManager;
	public audioManager!: AudioManager;
	private storyManager!: StoryManager;
	private isTransitioning: boolean = false;
	private blackScreen!: Phaser.GameObjects.Rectangle;
	private loadingText!: Phaser.GameObjects.Text;

	preload(): void {
		// First load the manifest and story data
		this.load.json('manifest', 'assets/manifest.json');
		this.load.json('story', 'assets/story.json');

		this.load.once('complete', () => {
			const manifest = this.cache.json.get('manifest');

			// Load font first since other components depend on it
			const fontData = manifest.fonts.bitmap;
			this.load.bitmapFont('your_font', `assets/${fontData.texture}`, `assets/${fontData.data}`);

			// Load backgrounds
			manifest.backgrounds.forEach((bgPath: string) => {
				const key = bgPath.split('/').pop()?.split('.')[0] || '';
				console.log(bgPath);
				this.load.image(key, `assets/${bgPath}`);
			});

			// Load character expressions
			Object.entries(manifest.characters).forEach(([charName, expressions]) => {
				(expressions as string[]).forEach((expr: string) => {
					const key = `${charName}_${expr.split('.')[0]}`;
					this.load.image(key, `assets/characters/${charName}/${expr}`);
				});
			});

			// Load audio
			this.load.audio('background_music', `assets/${manifest.audio.bgm}`);
			manifest.audio.choices.forEach((choiceSound: string, idx: number) => {
				this.load.audio(`choice_${idx + 1}`, `assets/${choiceSound}`);
			});

			// Load UI
			manifest.ui.forEach((uiAsset: string) => {
				const key = uiAsset.split('/').pop()?.split('.')[0];
				this.load.image(key as string, `assets/${uiAsset}`);
			});

			// Start loading all assets
			this.load.start();
		});

		this.load.start(); // Load the manifest and story
	}

	create(): void {
		this.editorCreate();

		// Wait for all assets to be loaded before creating managers
		this.load.once('complete', () => {
			// Initialize managers
			this.dialogManager = new DialogManager(this);
			this.choiceManager = new ChoiceManager(this);
			this.backgroundManager = new BackgroundManager(this);
			this.audioManager = new AudioManager(this);
			this.storyManager = new StoryManager();

			// Initialize character manager after ensuring all textures are loaded
			this.characterManager = new CharacterManager(this);

			// Load and start the story
			const storyData = this.cache.json.get('story');
			if (!storyData) {
				console.error('Story data not found! Make sure story.json is loaded correctly.');
				return;
			}

			this.storyManager.loadStoryData(storyData);
			this.audioManager.playBackgroundMusic();

			// Remove black screen and loading text after everything is loaded
			this.blackScreen.destroy();
			this.loadingText.destroy();

			// Start with the first passage
			this.showPassage(1);
		});
	}

	private showPassage(passageId: number): void {
		if (this.isTransitioning) return;

		// Set transitioning state
		this.isTransitioning = true;

		// Get the passage
		const passage = this.storyManager.getPassageById(passageId);
		if (!passage) {
			console.error(`Passage with ID ${passageId} not found`);
			this.isTransitioning = false;
			return;
		}

		// Update current passage
		this.storyManager.setCurrentPassage(passage);

		// Update background
		this.backgroundManager.updateBackground(passage);

		// Hide all characters initially
		this.characterManager.hideAllCharacters();

		// Process character emotions
		const emotions = this.storyManager.getCharacterEmotions(passage);
		emotions.forEach(({ character, emotion }) => {
			this.characterManager.updateCharacter(character, emotion);
		});

		// Play voice over for the passage
		this.audioManager.playVoiceOver(passage);

		// Display the clean text
		this.dialogManager.setText(passage.cleanText);

		// Add a delay before making the dialog box clickable
		this.time.delayedCall(1000, () => {
			// Show choices if there are any
			if (passage.links && passage.links.length > 0) {
				// Always use ChoiceManager for any number of links (including single-link Continue)
				this.choiceManager.showChoices(passage.links, (nextPassageId) => {
					this.isTransitioning = false;
					this.showPassage(nextPassageId);
				});
			} else {
				this.choiceManager.hideChoices();
				// No links, just end passage
				this.isTransitioning = false;
			}
		});
	}
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */