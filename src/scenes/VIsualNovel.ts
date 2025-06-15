import Phaser from 'phaser';
import { CharacterManager } from '../managers/CharacterManager';
import { DialogManager } from '../managers/DialogManager';
import { ChoiceManager } from '../managers/ChoiceManager';
import { BackgroundManager } from '../managers/BackgroundManager';
import { AudioManager } from '../managers/AudioManager';
import { StoryManager } from '../managers/StoryManager';
import { IPassage } from '../interfaces/IStoryData';

export class VisualNovel extends Phaser.Scene {
	private characterManager!: CharacterManager;
	private dialogManager!: DialogManager;
	private choiceManager!: ChoiceManager;
	private backgroundManager!: BackgroundManager;
	private audioManager!: AudioManager;
	private storyManager!: StoryManager;
	private isTransitioning: boolean = false;

	constructor() {
		super("VisualNovel");
	}

	preload(): void {
		// Load the story JSON
		this.load.json('story', 'assets/story.json');

		// Load background music
		this.load.audio('background_music', 'assets/sounds/bg.mp3');

		// Load bitmap font
		this.load.bitmapFont('children_book_font', 'assets/fonts/children_book_font.png', 'assets/fonts/children_book_font.xml');

		// Load background images
		this.load.image('castle', 'assets/bg/castle.png');
		this.load.image('giant_castle', 'assets/bg/giant_castle.png');
		this.load.image('road', 'assets/bg/road.png');
		this.load.image('village', 'assets/bg/village.png');
		this.load.image('vine', 'assets/bg/vine.png');
		this.load.image('inside_castle', 'assets/bg/inside_castle.png');
		this.load.image('black', 'assets/bg/black.png');

		// Load Jack's sprites
		this.load.image('jack_happy', 'assets/jack/happy.png');
		this.load.image('jack_sad', 'assets/jack/sad.png');
		this.load.image('jack_crying', 'assets/jack/crying.png');
		this.load.image('jack_stressed', 'assets/jack/stressed.png');
		this.load.image('jack_confused', 'assets/jack/confused.png');

		// Load Mother's sprites
		this.load.image('mother_happy', 'assets/mother/happy.png');
		this.load.image('mother_sad', 'assets/mother/sad.png');
		this.load.image('mother_angry', 'assets/mother/angry.png');

		// Load Wizard's sprites
		this.load.image('wizard_suspicious', 'assets/wizard/suspicious.png');
		this.load.image('wizard_annoyed', 'assets/wizard/annoyed.png');
		this.load.image('wizard_laugh', 'assets/wizard/laugh.png');

		// Load Giant's sprites
		this.load.image('giant_angry', 'assets/giant/angry.png');
		this.load.image('giant_sleeping', 'assets/giant/sleeping.png');

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
		this.showPassage('Exposition (original)');
	}

	private showPassage(passageName: string): void {
		if (this.isTransitioning) return;

		// Set transitioning state
		this.isTransitioning = true;

		// Get the passage
		const passage = this.storyManager.getPassageByName(passageName);
		if (!passage) {
			console.error('Passage not found:', passageName);
			this.isTransitioning = false;
			return;
		}

		// Update current passage
		this.storyManager.setCurrentPassage(passage);

		// Update background
		this.backgroundManager.updateBackground(passage.id);

		// Hide all characters initially
		this.characterManager.hideAllCharacters();

		// Process character emotions
		const emotions = this.storyManager.processCharacterEmotions(passage.text);
		emotions.forEach(({ character, emotion }) => {
			console.log(`Updating character: ${character} with emotion: ${emotion}`);
			this.characterManager.updateCharacter(character, emotion);
		});

		// Display the clean text
		this.dialogManager.setText(passage.cleanText);

		// Add a delay before making the dialog box clickable
		this.time.delayedCall(1000, () => {
			// Handle special navigation links
			const specialLink = this.storyManager.findSpecialLink(passage.text);
			if (specialLink) {
				this.dialogManager.setClickHandler(() => {
					const nextPassage = this.storyManager.getPassageById(specialLink);
					if (nextPassage) {
						this.isTransitioning = false;
						this.showPassage(nextPassage.name);
					}
				});
				return;
			}

			// Show choices if there are any
			if (passage.links && passage.links.length > 0) {
				this.choiceManager.showChoices(passage.links, (nextPassageName) => {
					const nextPassage = this.storyManager.getPassageByName(nextPassageName);
					if (nextPassage) {
						this.isTransitioning = false;
						this.showPassage(nextPassage.name);
					} else {
						console.error('Passage not found:', nextPassageName);
						this.isTransitioning = false;
					}
				});
			} else {
				this.isTransitioning = false;
			}
		});
	}
}

export default VisualNovel;