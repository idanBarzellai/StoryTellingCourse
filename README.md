<<<<<<< Updated upstream
# Webpack + TypeScript project template for Phaser Editor v4
=======
# Jack and the Beanstalk - Storytelling Game Template

A **Phaser 3** template for creating visual novel-style storytelling games. This project is designed to be **customized with your own assets** while preserving core mechanics like dialog, branching paths, and character emotion animations.

---

## 🚀 Getting Started

### Requirements
- [Node.js](https://nodejs.org)
- [npm](https://www.npmjs.com)

### Setup Instructions

```bash
npm install       # Install dependencies
npm update        # Optional: update packages
npm start         # Launch development server
```

Open your browser at [http://127.0.0.1:8080](http://127.0.0.1:8080).

### Production Build

```bash
npm run build
```

Build output is placed in the `/dist` directory.

---

## 📁 Asset Requirements

Replace the contents of the `/assets/` folder with your own, following the required structure and naming conventions.

### Asset Folder Structure

```
assets/
├── bg/             # Background images (e.g., scenery_0.png)
├── characters/
│   ├── main_char/  # Player character expressions
│   └── npc_1/, npc_2/, etc.
├── fonts/          # Bitmap fonts
├── sounds/         # Audio and SFX
├── UI/             # UI elements like buttons, dialog box
```

### Notes
- Maintain original naming conventions.
- Keep paths consistent with `manifest.json`.
- Optimize assets for web use (compressed images and audio).

---

## 📦 Using the Manifest File

The file `/assets/manifest.json` defines all loadable assets.

```json
{
  "backgrounds": ["bg/scenery_0.png", "bg/scenery_1.png", etc],
  "characters": {
    "main_char": ["main_char.png", "happy.png", "sad.png", etc],
    "npc_1": ["npc_1.png", "happy.png", etc],
    etc
  },
  "audio": {
    "bgm": "sounds/bg.mp3",
    "choices": ["sounds/choice_1.wav", "sounds/choice_2.wav"]
  },
  "ui": ["UI/choice_button.png", "UI/dialog_box.png"],
  "fonts": {
    "bitmap": {
      "texture": "fonts/your_font.png",
      "data": "fonts/your_font.xml"
    }
  }
}
```

---

### 🧩 Manifest Structure Breakdown

- **`backgrounds`**: List of background images  
  _(e.g., `"bg/scenery_0.png"`)_

- **`characters`**: Map of character folders to emotion images  
  _(first image is considered default/neutral)_

- **`audio.bgm`**: Background music path  
- **`audio.choices`**: Array of choice sound effects  
- **`ui`**: List of UI images  
- **`fonts.bitmap`**: Bitmap font reference (`.png` and `.xml`)

---

### 🛠 Adding New Assets

1. Place files in their appropriate folders.
2. Add them to `manifest.json`.
3. Use consistent naming (e.g., `happy.png`, `sad.png`).
4. Ensure paths are relative to the `assets/` directory.

---

## 😃 Available Character Emotions

Each emotion can trigger different animations:

### Happy Emotions
- `happy`, `laugh`, `excited` — _gentle up/down bounce_

### Sad Emotions
- `sad`, `sleeping`, `crying` — _slow left sway_

### Intense Emotions
- `stressed`, `shocked`, `surprised`, `angry` — _quick pulse_

### Thoughtful Emotions
- `confused`, `annoyed`, `suspicious` — _slow right sway_

### Example Usage in Story JSON

```json
"emotions": [
  { "character": "main_char", "emotion": "happy" },
  { "character": "npc_1", "emotion": "angry" }
]
```

> 💡 Each character must include corresponding emotion images in their asset folder (e.g., `npc_1/angry.png`).

---

## 📚 Additional Notes

- All asset paths in the manifest must be **relative to the `assets/` folder**.
- Avoid renaming the folder structure unless you update all relevant references.
- This template is ideal for creating modular, story-driven games with support for branching dialogue and emotion-based character visuals.

---

Happy storytelling! 🌱


## 📖 Creating Your Own Story (`story.json` Format)
>>>>>>> Stashed changes

A project template for Phaser 3, Webpack 5, TypeScript, and Phaser Editor v4.
It also includes a workflow for deploying the game to GitHub Pages.

## First steps

This project requires [Node.js](https://nodejs.org) and [NPM.js](https://www.npmjs.com). It is recommended that you learn the basics of [Webpack.js](https://webpack.js.org).

* Install dependencies:

    ```
    npm install
    npm update
    ```

* Run the development server:

    ```
    npm start
    ```

    Open the browser at `http://127.0.0.1:8080`.

* Make a production build:

    ```
    npm run build
    ```

    It is generated in the `/dist` folder.

## Hosting your game on GitHub Pages

If you are looking for a hosting for you game, GitHub Pages is a very nice and free option.
This repository includes a workflow for publishing the game into GitHub Pages automatically.

Just follow these steps:

* Create a GitHub repository with the project (something that probably you already did).
* In GitHub, open the repository and go to **Settings** > **GitHub Pages**.
* In the **Build and deployment** section, set the **GitHub Actions** option in the **Source** parameter.
* Run the **Build game with webpack** workflow in the **Actions** section on the repository.
* When the workflow completes, return to the **Settings** > **GitHub Pages** section and check the address for the deployed game. It should show a message like **Your site is live at https://\<USERNAME>.github.io/<REPOSITORY_NAME>/**.
* Next time you push changes to the `main` branch it will run the workflow and deploy the game automatically.

If you don't want to deploy your game to GitHub Pages, then you can remove the `.github/workflows/main.yml` file.

In this video I explain many of these concepts: [Start making a game in the cloud. GitHub + VS Code + Phaser Editor [Tutorial]](https://www.youtube.com/watch?v=lndU7UAjzgo&t=183s)

<<<<<<< Updated upstream
## Phaser Editor considerations

### Excluding files from the project

There are a lot of files present in the project that are not relevant to Phaser Editor. For example, the whole `node_modules` folder should be excluded from the editor's project.

The `/.skip` file lists the folders and files to exclude from the editor's project. 

[Learn more about resource filtering in Phaser Editor](https://phaser.io/editor/docs/misc/resources-filtering)

### Setting the root folder for the game's assets

The `/static` folder contains the assets (images, audio, atlases) used by the game. Webpack copies it to the distribution folder and makes it available as a root path. For example, `http://127.0.0.1:8080/assets` points to the `/static/assets` folder.

By default, Phaser Editor uses the project's root as the start path for the assets. You can change it by creating an empty `publicroot` file. That is the case of the `/static/publicroot` file, which allows adding files to the Asset Pack file (`/static/assets/asset-pack.json`) using correct URLs.

### Asset Pack content hash

Webpack is configured to include the content hash of a file defined in an asset pack editor:

* For loading a pack file in code, import it as a resource:
    ```javascript
    import assetPackUrl from "../static/assets/asset-pack.json";
    ...
    this.load.pack("pack1", assetPackUrl);
    ```
    Webpack will add the `asset-pack.json` file into the distribution files, in the folder `dist/asset-packs/`.

* Because Webpack automatically imports the pack files, those are excluded in the **CopyPlugin** configuration. By convention, name the pack files like this `[any name]-pack.json`.

* The NPM `build` script calls the `phaser-asset-pack-hashing` tool. It parses all pack files in the `dist/` folder and transform the internal URL, adding the content-hash to the query string. It also parses files referenced by the pack. For example, a multi-atlas file is parsed and the name of the image's file will be changed to use a content-hash.

Learn more about the [phaser-asset-pack-hashing](https://www.npmjs.com/package/phaser-asset-pack-hashing) tool.

### Coding

The `/src` folder contains all the TypeScript code, including the scene and user component files, in addition to the Phaser Editor compiler output.

To edit the code, you can use any editor, but we recommend using Visual Studio Code. This project has the Visual Studio Code configuration files.

### Scene, User Components, and ScriptNode configuration

The Scenes, User Components, and ScriptNodes are configured to compile to TypeScript ES modules. Also, the compilers auto-import the classes used in the generated code.

### ScriptNodes

The project requires the following script libraries:

* [@phaserjs/editor-scripts-core](https://www.npmjs.com/package/@phaserjs/editor-scripts-core)
* [@phaserjs/editor-scripts-simple-animations](https://www.npmjs.com/package/@phaserjs/editor-scripts-simple-animations)

You can add your script nodes to the `src/script-nodes` folder.

## About

This project template was created by the Phaser Studio team.
=======
```json
{
  "id": 4,
  "cleanText": "Jack: \"Look what I got instead!\"",
  "speaker": "main_char",
  "background": "scenery_0",
  "emotions": [
    { "character": "main_char", "emotion": "Happy" },
    { "character": "npc_1", "emotion": "Sad" }
  ],
  "links": [
    { "linkText": "Mother is furious", "passageId": 13 },
    { "linkText": "Mother is kind", "passageId": 14 }
  ]
}
```
>>>>>>> Stashed changes
