import Phaser from "phaser";
import preloadAssetPackUrl from "../static/assets/preload-asset-pack.json";
import Preload from "./scenes/Preload";
import VisualNovel from "./scenes/VisualNovel";

class Boot extends Phaser.Scene {

	constructor() {
		super("Boot");
	}

	preload() {
		// Add black screen
		this.add.rectangle(0, 0, 1280, 720, 0x000000).setOrigin(0);
		this.load.pack("pack", preloadAssetPackUrl);
	}

	create() {
		this.scene.start("Preload");
	}
}

window.addEventListener('load', function () {

	const game = new Phaser.Game({
		width: 1280,
		height: 720,
		backgroundColor: "#000000", // Changed to black
		scale: {
			mode: Phaser.Scale.ScaleModes.FIT,
			autoCenter: Phaser.Scale.Center.CENTER_BOTH
		},
		scene: [Boot, Preload, VisualNovel]
	});

	game.scene.start("Boot");
});