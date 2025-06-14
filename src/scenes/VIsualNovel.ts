// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import Phaser from 'phaser';
/* END-USER-IMPORTS */

export default class VisualNovel extends Phaser.Scene {
	private jack!: Phaser.GameObjects.Sprite;
	private other_chars!: Phaser.GameObjects.Sprite;
	private dialog_box!: Phaser.GameObjects.Sprite;
	private dialog_text!: Phaser.GameObjects.BitmapText;
	private choice_button_1!: Phaser.GameObjects.Sprite;
	private choice_button_2!: Phaser.GameObjects.Sprite;
	private dialog_choice_1!: Phaser.GameObjects.BitmapText;
	private dialog_choice_2!: Phaser.GameObjects.BitmapText;
	private storyData: any = null;
	private currentPassage: any = null;
	private background!: Phaser.GameObjects.Image;
	private backgroundMusic!: Phaser.Sound.BaseSound;
	private isTransitioning: boolean = false;
	private muteButton!: Phaser.GameObjects.Image;
	private isMuted: boolean = false;

	// Add constants for text scaling
	private readonly MIN_TEXT_SCALE = 0.5;
	private readonly MAX_TEXT_SCALE = 1.0;
	private readonly TEXT_SCALE_STEP = 0.1;

	private readonly VISIBLE_TEXT_WIDTH = 0.9;
	private readonly DIALOG_BOX_VISIBLE_HEIGHT = 0.45;
	private readonly CHOICE_BOX_VISIBLE_HEIGHT = 0.6;


	// Add background mapping array
	private readonly backgroundMapping: { [key: string]: string } = {
		// Exposition and Opening scenes
		'1': 'village',    // Exposition (original)
		'2': 'village',    // Market Journey
		'3': 'road',       // Turning Point (original updated)
		'4': 'village',    // Opening (original updated)
		'5': 'vine',       // Bottleneck Event continue (original updated)
		'5a': 'castle',      // Bottleneck Event continue (Part 2)
		'6': 'giant_castle',     // Plot (original)
		'7': 'inside_castle', // Turning Point 2 (original updated)
		'8': 'vine',       // Peak (original)
		'9': 'village',    // Closure (original)
		'10': 'village', // Ending (original)
		'11': 'road',      // Opening (alternative)
		'12': 'village',   // Bottleneck Event (original updated)
		'13': 'village',    // Bottleneck Event (alternative)
		'14': 'road',      // Plot (alternative)
		'15': 'road',   // Turning Point 2 (alternative)
		'16': 'road',   // Peak (alternative)
		'17': 'black',   // Ending (alternative)
		'18': 'inside_castle',   // Peak (alternative 2)
	};

	constructor() {
		super("VisualNovel");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {
		// background
		this.background = this.add.image(640, 360, "village");
		this.background.setScale(1);

		// jack
		this.jack = this.add.sprite(880, 300, "happy");
		this.jack.scaleX = 0.25;
		this.jack.scaleY = 0.25;

		// other_chars
		this.other_chars = this.add.sprite(400, 300, "mother");
		this.other_chars.scaleX = 0.25;
		this.other_chars.scaleY = 0.25;

		// dialog_box
		this.dialog_box = this.add.sprite(640, 500, "dialog_box");
		this.dialog_box.scaleX = 1;
		this.dialog_box.scaleY = 1;
		this.dialog_box.setInteractive();

		// Calculate dialog box visible area (excluding transparent parts)

		// dialog_text with proper boundaries
		this.dialog_text = this.add.bitmapText(640, 465, 'children_book_font', "Story will begin here...", 50);
		this.dialog_text.setOrigin(0.5);
		this.dialog_text.scaleX = 1;
		this.dialog_text.scaleY = 1;
		// Set max width to visible area width
		this.dialog_text.setMaxWidth(this.dialog_box.width * this.VISIBLE_TEXT_WIDTH);
		this.dialog_text.setCenterAlign();
		this.dialog_text.setLineSpacing(6);

		// choice_button_1
		this.choice_button_1 = this.add.sprite(400, 645, "choice_button");
		this.choice_button_1.setInteractive();

		// choice_button_2
		this.choice_button_2 = this.add.sprite(880, 645, "choice_button");
		this.choice_button_2.setInteractive();

		// Calculate choice button visible area

		// dialog_choice_1 with proper boundaries
		this.dialog_choice_1 = this.add.bitmapText(400, 645, 'children_book_font', "", 50);
		this.dialog_choice_1.setOrigin(0.5);
		this.dialog_choice_1.scaleX = 1;
		this.dialog_choice_1.scaleY = 1;
		// Set max width to visible area width
		this.dialog_choice_1.setMaxWidth(this.choice_button_1.width * this.VISIBLE_TEXT_WIDTH);
		this.dialog_choice_1.setCenterAlign();

		// dialog_choice_2 with proper boundaries
		this.dialog_choice_2 = this.add.bitmapText(880, 645, 'children_book_font', "", 50);
		this.dialog_choice_2.setOrigin(0.5);
		this.dialog_choice_2.scaleX = 1;
		this.dialog_choice_2.scaleY = 1;
		// Set max width to visible area width
		this.dialog_choice_2.setMaxWidth(this.choice_button_2.width * this.VISIBLE_TEXT_WIDTH);
		this.dialog_choice_2.setCenterAlign();

		// Mute button (top left)
		this.muteButton = this.add.image(28, 40, 'unmute').setOrigin(0.5).setScale(0.5).setInteractive({ useHandCursor: true });
		this.muteButton.setScrollFactor(0);
		this.muteButton.setDepth(1000);
		this.muteButton.on('pointerdown', () => {
			this.isMuted = !this.isMuted;
			this.sound.mute = this.isMuted;
			// If you have an unmute icon, swap texture:
			this.muteButton.setTexture(this.isMuted ? 'mute' : 'unmute');
		});

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

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
		this.load.image('mother_default', 'assets/mother/mother.png');

		// Load Wizard's sprites
		this.load.image('wizard_suspicious', 'assets/wizard/suspicious.png');
		this.load.image('wizard_annoyed', 'assets/wizard/annoyed.png');
		this.load.image('wizard_laugh', 'assets/wizard/laugh.png');
		this.load.image('wizard_default', 'assets/wizard/wizard.png');

		// Load Giant's sprites
		this.load.image('giant_angry', 'assets/giant/angry.png');
		this.load.image('giant_sleeping', 'assets/giant/sleeping.png');
		this.load.image('giant_default', 'assets/giant/giant.png');

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

		// Load the story data
		this.storyData = this.cache.json.get('story');

		// Play background music in loop
		this.backgroundMusic = this.sound.add('background_music', {
			volume: 0.03,
			loop: true
		});
		this.backgroundMusic.play();

		// Start with the first passage
		this.showPassage('Exposition (original)');
	}

	private adjustTextScale(text: Phaser.GameObjects.BitmapText, maxWidth: number, maxHeight: number): void {
		// Reset scale to maximum
		text.setScale(this.MAX_TEXT_SCALE);

		// Get the text bounds
		const bounds = text.getTextBounds();
		const textWidth = bounds.global.width;
		const textHeight = bounds.global.height;

		// If text is too wide or too tall, scale it down
		if (textWidth > maxWidth || textHeight > maxHeight) {
			const widthScale = maxWidth / textWidth;
			const heightScale = maxHeight / textHeight;
			const scale = Math.min(widthScale, heightScale, this.MAX_TEXT_SCALE);

			// Ensure scale doesn't go below minimum
			const finalScale = Math.max(scale, this.MIN_TEXT_SCALE);
			text.setScale(finalScale);
		}
	}

	private showPassage(passageName: string): void {
		if (!this.storyData || this.isTransitioning) return;

		// Set transitioning state to true
		this.isTransitioning = true;

		// Find the passage in the story data
		const foundPassage = this.storyData.passages.find((p: any) => p.name === passageName);
		if (!foundPassage) {
			this.isTransitioning = false;
			return;
		}
		this.currentPassage = foundPassage;

		// Update background based on passage
		this.updateBackground(passageName);

		// Hide all characters initially
		this.jack.setVisible(false);
		this.other_chars.setVisible(false);

		// Process character emotions from the text
		const lines = this.currentPassage.text.split('\n');
		for (const line of lines) {
			if (line.startsWith('[') && line.includes(':')) {
				const [character, emotion] = line.slice(1, -1).split(':');
				this.updateCharacter(character, emotion);
			}
		}

		// Display the clean text and adjust its scale
		this.dialog_text.setText(this.currentPassage.cleanText);
		this.adjustTextScale(
			this.dialog_text,
			this.dialog_box.width * this.VISIBLE_TEXT_WIDTH,
			this.dialog_box.height * this.DIALOG_BOX_VISIBLE_HEIGHT
		);

		// Hide choice buttons and text initially
		this.choice_button_1.setVisible(false);
		this.choice_button_2.setVisible(false);
		this.dialog_choice_1.setVisible(false);
		this.dialog_choice_2.setVisible(false);

		// Add a delay before making the dialog box clickable
		this.time.delayedCall(1000, () => {
			// Handle special navigation links (-> -> format)
			const specialLink = this.currentPassage.text.match(/\[\[-> ->([^\]]+)\]\]/);
			if (specialLink) {
				const nextPassageId = specialLink[1];
				// Make dialog box clickable to progress
				this.dialog_box.once('pointerdown', () => {
					const nextPassage = this.storyData.passages.find((p: any) => p.id === nextPassageId);
					if (nextPassage) {
						this.showPassage(nextPassage.name);
					}
				});
				this.isTransitioning = false;
				return;
			}

			// Show choice buttons if there are any
			if (this.currentPassage.links && this.currentPassage.links.length > 0) {
				// Show first choice
				if (this.currentPassage.links[0]) {
					this.choice_button_1.setVisible(true);
					this.dialog_choice_1.setVisible(true);
					const wrappedChoice1 = this.wrapBitmapText(
						this.currentPassage.links[0].linkText,
						this.choice_button_1.width * this.VISIBLE_TEXT_WIDTH,
						50
					);
					this.dialog_choice_1.setText(wrappedChoice1);
					this.adjustTextScale(
						this.dialog_choice_1,
						this.choice_button_1.width * this.VISIBLE_TEXT_WIDTH,
						this.choice_button_1.height * this.CHOICE_BOX_VISIBLE_HEIGHT
					);
					this.choice_button_1.once('pointerdown', () => {
						this.sound.play('choice_1', { volume: 0.05 });
						// Find the passage by ID or name
						const nextPassage = this.storyData.passages.find((p: any) =>
							p.id === this.currentPassage.links[0].passageName ||
							p.name === this.currentPassage.links[0].passageName
						);
						if (nextPassage) {
							this.showPassage(nextPassage.name);
						} else {
							console.error('Passage not found:', this.currentPassage.links[0].passageName);
							this.isTransitioning = false;
						}
					});
				}

				// Show second choice if it exists
				if (this.currentPassage.links[1]) {
					this.choice_button_2.setVisible(true);
					this.dialog_choice_2.setVisible(true);
					const wrappedChoice2 = this.wrapBitmapText(
						this.currentPassage.links[1].linkText,
						this.choice_button_2.width * this.VISIBLE_TEXT_WIDTH,
						50
					);
					this.dialog_choice_2.setText(wrappedChoice2);
					this.adjustTextScale(
						this.dialog_choice_2,
						this.choice_button_2.width * this.VISIBLE_TEXT_WIDTH,
						this.choice_button_2.height * this.CHOICE_BOX_VISIBLE_HEIGHT
					);
					this.choice_button_2.once('pointerdown', () => {
						this.sound.play('choice_2', { volume: 0.05 });
						// Find the passage by ID or name
						const nextPassage = this.storyData.passages.find((p: any) =>
							p.id === this.currentPassage.links[1].passageName ||
							p.name === this.currentPassage.links[1].passageName
						);
						if (nextPassage) {
							this.showPassage(nextPassage.name);
						} else {
							console.error('Passage not found:', this.currentPassage.links[1].passageName);
							this.isTransitioning = false;
						}
					});
				}
			}
			this.isTransitioning = false;
		});
	}

	private updateCharacter(character: string, emotion: string): void {
		const characterKey = character.toLowerCase();
		const emotionKey = emotion.toLowerCase();
		const textureKey = `${characterKey}_${emotionKey}`;

		if (character === 'Jack') {
			// Update Jack's emotion and make him visible
			this.jack.setTexture(textureKey);
			this.jack.setVisible(true);
		} else {
			// Update other character and make them visible
			this.other_chars.setTexture(textureKey);
			this.other_chars.setVisible(true);
		}

		// Add emotion-specific animations
		const sprite = character === 'Jack' ? this.jack : this.other_chars;
		switch (emotionKey) {
			case 'happy':
				this.tweens.add({
					targets: sprite,
					y: sprite.y - 5,
					duration: 1000,
					yoyo: true,
					repeat: -1
				});
				break;
			case 'sad':
			case 'crying':
				this.tweens.add({
					targets: sprite,
					angle: -2,
					duration: 1500,
					yoyo: true,
					repeat: -1
				});
				break;
			case 'stressed':
			case 'angry':
				this.tweens.add({
					targets: sprite,
					scaleX: sprite.scaleX * 1.04,
					duration: 500,
					yoyo: true,
					repeat: -1
				});
				break;
			case 'confused':
			case 'suspicious':
				this.tweens.add({
					targets: sprite,
					angle: 2,
					duration: 2000,
					yoyo: true,
					repeat: -1
				});
				break;
		}
	}

	private updateBackground(passageName: string): void {
		// Find the passage by name to get its ID
		const passage = this.storyData.passages.find((p: any) => p.name === passageName);
		if (!passage) return;

		// Get the background key from our mapping
		const backgroundKey = this.backgroundMapping[passage.id];

		// If no background is specified or it's an empty string, show black background
		if (!backgroundKey) {
			this.background.setTexture('black');
			// If black texture doesn't exist, create a black rectangle
			if (!this.textures.exists('black')) {
				const graphics = this.make.graphics();
				graphics.fillStyle(0x000000);
				graphics.fillRect(0, 0, 1280, 720);
				graphics.generateTexture('black', 1280, 720);
				graphics.destroy();
			}
		} else {
			this.background.setTexture(backgroundKey);
		}
	}

	// Helper to wrap text for BitmapText
	private wrapBitmapText(text: string, maxWidth: number, fontSize: number): string {
		const words = text.split(' ');
		let line = '';
		let result = '';
		for (let i = 0; i < words.length; i++) {
			const testLine = line + (line ? ' ' : '') + words[i];
			// Create a temp BitmapText to measure width
			const temp = this.add.bitmapText(0, 0, 'children_book_font', testLine, fontSize);
			const width = temp.getTextBounds().global.width;
			temp.destroy();
			if (width > maxWidth && line) {
				result += line + '\n';
				line = words[i];
			} else {
				line = testLine;
			}
		}
		if (line) result += line;
		return result;
	}
}
/* END-USER-CODE */


/* END OF COMPILED CODE */

// You can write more code here
