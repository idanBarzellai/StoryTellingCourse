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