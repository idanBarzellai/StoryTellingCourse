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

	preload(): void {
		// Load the story JSON
		this.load.json('story', 'assets/story.json');

		// Load background music
		this.load.audio('background_music', 'assets/sounds/bg.mp3');

		// Load bitmap font
		this.load.bitmapFont('children_book_font', 'assets/fonts/children_book_font.png', 'assets/fonts/children_book_font.xml');

		// Load background images
		this.load.image('scenery_0', 'assets/bg/scenery_0.png');
		this.load.image('scenery_1', 'assets/bg/scenery_1.png');
		this.load.image('scenery_2', 'assets/bg/scenery_2.png');
		this.load.image('scenery_3', 'assets/bg/scenery_3.png');
		this.load.image('scenery_4', 'assets/bg/scenery_4.png');
		this.load.image('scenery_5', 'assets/bg/scenery_5.png');
		this.load.image('scenery_6', 'assets/bg/black.png');

		// Load main character sprites
		this.load.image('main_char_happy', 'assets/main_char/happy.png');
		this.load.image('main_char_sad', 'assets/main_char/sad.png');
		this.load.image('main_char_crying', 'assets/main_char/crying.png');
		this.load.image('main_char_stressed', 'assets/main_char/stressed.png');
		this.load.image('main_char_confused', 'assets/main_char/confused.png');

		// Load NPC 1 sprites
		this.load.image('npc_1_happy', 'assets/npc_1/happy.png');
		this.load.image('npc_1_sad', 'assets/npc_1/sad.png');
		this.load.image('npc_1_angry', 'assets/npc_1/angry.png');

		// Load NPC 2 sprites
		this.load.image('npc_2_suspicious', 'assets/npc_2/suspicious.png');
		this.load.image('npc_2_annoyed', 'assets/npc_2/annoyed.png');
		this.load.image('npc_2_laugh', 'assets/npc_2/laugh.png');

		// Load NPC 3 sprites
		this.load.image('npc_3_angry', 'assets/npc_3/angry.png');
		this.load.image('npc_3_sleeping', 'assets/npc_3/sleeping.png');

		// Load UI elements
		this.load.image('choice_button', 'assets/UI/choice_button.png');
		this.load.image('dialog_box', 'assets/UI/dialog_box.png');

		// Load choice button sounds
		this.load.audio('choice_1', 'assets/sounds/choice_1.wav');
		this.load.audio('choice_2', 'assets/sounds/choice_2.wav');

		// Load mute button image
		this.load.image('mute', 'assets/UI/mute.png');
		this.load.image('unmute', 'assets/UI/unmute.png');
	}

	create(): void {
		this.editorCreate();

		// Initialize managers
		this.characterManager = new CharacterManager(this);
		this.dialogManager = new DialogManager(this);
		this.choiceManager = new ChoiceManager(this);
		this.backgroundManager = new BackgroundManager(this);
		this.audioManager = new AudioManager(this);
		this.storyManager = new StoryManager();

		// Load and start the story
		const storyData = this.cache.json.get('story');
		this.storyManager.loadStoryData(storyData);
		this.audioManager.playBackgroundMusic();

		// Start with the first passage
		this.showPassage(1);
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