# Story Telling Platform Creator

A **Phaser 3** template for creating visual novel-style storytelling games. This project is designed to be **customized with your own assets** while preserving core mechanics like dialog, branching paths, and character emotion animations.

---

## 🚀 Quick Start Guide

### 1. Copy the Repository
Clone or download this repository to your local machine.

### 2. Replace Assets
Change the relevant assets in the `assets/` folder:
- **Backgrounds**: Replace images in `assets/bg/`
- **Characters**: Replace character images in `assets/characters/`
- **UI/Fonts/Music**: If you want to change these, keep the same naming and size. For fonts, ensure all characters are supported.

### 3. Add Your Story
Add your Twine exported HTML file to the `assets/` folder.

### 4. Process Your Story
Open the terminal in your IDE code editor or CMD and run:
```bash
npm run story
```
Answer all the relevant questions that the script will ask you and wait for it to complete.

### 5. Test Locally
Run the following command in your IDE terminal or CMD:
```bash
npm start
```

### 6. Customize Story (Optional)
To update story passage connections, emotions, or scene backgrounds, open the file `assets/story.json` and adjust what you need.

### 7. Export for Itch.io
To export the game and upload to itch.io, run:
```bash
npm run build
```
This will create a `dist` folder. Zip it and upload to itch.io.

---

## ⚠️ Important Adjustments Required

**Character Direction**: Make sure the characters are facing in the correct direction as needed:
- **Main character** should face **left**
- **NPCs** should face **right**

---

## 📚 Advanced Information

<details>
<summary><strong>🔧 Technical Setup & Requirements</strong></summary>

### Requirements
- [Node.js](https://nodejs.org)
- [npm](https://www.npmjs.com)

### Development Setup
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

</details>

<details>
<summary><strong>📁 Asset Requirements & Structure</strong></summary>

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

### 🛠 Adding New Assets
1. Place files in their appropriate folders.
2. Add them to `manifest.json`.
3. Use consistent naming (e.g., `happy.png`, `sad.png`).
4. Ensure paths are relative to the `assets/` directory.

</details>

<details>
<summary><strong>📦 Manifest File Structure</strong></summary>

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

### 🧩 Manifest Structure Breakdown
- **`backgrounds`**: List of background images  
  _(e.g., `"bg/scenery_0.png"`)_

- **`characters`**: Map of character folders to emotion images  
  _(first image is considered default/neutral)_

- **`audio.bgm`**: Background music path  
- **`audio.choices`**: Array of choice sound effects  
- **`ui`**: List of UI images  
- **`fonts.bitmap`**: Bitmap font reference (`.png` and `.xml`)

</details>

<details>
<summary><strong>😃 Character Emotions & Animations</strong></summary>

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

</details>

<details>
<summary><strong>📖 Story JSON Format</strong></summary>

The game uses a `story.json` file located in the `assets/` folder to define the full narrative, including scenes, characters, branching logic, and emotion-driven presentation.

### 🧱 Story Format Overview
A story is made of a list of **`passages`**, each representing a scene or decision point:

```json
{
  "name": "Market Journey",
  "id": 2,
  "links": [
    { "linkText": "Talk to the old man", "passageId": 3 }
  ],
  "cleanText": "Jack set off for the market, leading Buttercup...",
  "speaker": "npc_1",
  "emotions": [
    { "character": "main_char", "emotion": "Happy" },
    { "character": "npc_1", "emotion": "Sad" }
  ],
  "background": "scenery_0"
}
```

### 🔑 Fields Breakdown

| Field         | Required | Description |
|---------------|----------|-------------|
| `name`        | ✅       | Internal name for the passage (for readability only) |
| `id`          | ✅       | Unique numeric ID of the passage |
| `cleanText`   | ✅       | The dialogue or narration shown to the player |
| `links`       | ✅       | Array of choices, each with `linkText` (button label) and `passageId` (target scene) |
| `background`  | ✅       | Background image key (must match a key from the manifest) |
| `speaker`     | ❌       | Optional name of the speaking character (displayed in the dialog box) |
| `emotions`    | ❌       | Array of objects specifying which characters show which emotions |
| `character`   | (inside `emotions`) | The character's key as defined in the manifest |
| `emotion`     | (inside `emotions`) | The emotion's name (e.g., `happy`, `sad`) matching an image in the character folder |

### 🧭 Narrative Flow
- `links` create **branching paths** between passages, forming interactive choices.
- All passages should eventually lead to one or more end points or loops.

### 🖼 Backgrounds & Emotions
- Use the `background` field to set the scene (`scenery_0`, `scenery_1`, etc.).
- Attach character emotions using the `emotions` array to create expressive, animated responses in each passage.

</details>

---

## 📚 Additional Notes

- All asset paths in the manifest must be **relative to the `assets/` folder**.
- Avoid renaming the folder structure unless you update all relevant references.
- This template is ideal for creating modular, story-driven games with support for branching dialogue and emotion-based character visuals.

---

Happy storytelling! 🌱
