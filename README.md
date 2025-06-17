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

The game uses a `story.json` file located in the `assets/` folder to define the full narrative, including scenes, characters, branching logic, and emotion-driven presentation.

### 🧱 Story Format Overview

A story is made of a list of **`passages`**, each representing a scene or decision point. Here's what each passage typically includes:

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

---

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

---

### 🧭 Narrative Flow

- `links` create **branching paths** between passages, forming interactive choices.
- All passages should eventually lead to one or more end points or loops.

### 🖼 Backgrounds & Emotions

- Use the `background` field to set the scene (`scenery_0`, `scenery_1`, etc.).
- Attach character emotions using the `emotions` array to create expressive, animated responses in each passage.

---

### 🧠 Tips for Writing Passages

- Keep `cleanText` concise and clear. Use `\n` for multi-line dialog.
- Use `speaker` when you want to show who is talking.
- Use expressive choices in `links` to reinforce storytelling (“Run away”, “Accept the beans”, etc.).
- Looping is allowed! You can link back to an earlier passage (e.g., `passageId: 1`).

---

### ✅ Example Use Case

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
