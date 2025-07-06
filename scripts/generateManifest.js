const fs = require('fs');
const path = require('path');

function scanDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);
    const result = [];

    items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            result.push(...scanDirectory(fullPath));
        } else {
            // Get relative path from assets folder
            const relativePath = path.relative('assets', fullPath).replace(/\\/g, '/');
            result.push(relativePath);
        }
    });

    return result;
}

function generateManifest() {
    const manifest = {
        backgrounds: [],
        characters: {},
        audio: {
            bgm: [],
            choices: [],
            voices: []
        },
        ui: [],
        fonts: {}
    };

    // Scan backgrounds
    const bgPath = path.join('assets', 'bg');
    if (fs.existsSync(bgPath)) {
        const bgFiles = fs.readdirSync(bgPath);
        manifest.backgrounds = bgFiles
            .filter(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'))
            .map(file => `bg/${file}`);
    }

    // Scan characters
    const charactersPath = path.join('assets', 'characters');
    if (fs.existsSync(charactersPath)) {
        const characterDirs = fs.readdirSync(charactersPath);

        characterDirs.forEach(charDir => {
            const charDirPath = path.join(charactersPath, charDir);
            if (fs.statSync(charDirPath).isDirectory()) {
                const charFiles = fs.readdirSync(charDirPath);
                const emotionFiles = charFiles
                    .filter(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'))
                    .map(file => file);

                manifest.characters[charDir] = emotionFiles;
            }
        });
    }

    // Scan sounds
    const soundsPath = path.join('assets', 'sounds');
    if (fs.existsSync(soundsPath)) {
        const soundFiles = scanDirectory(soundsPath);

        soundFiles.forEach(file => {
            if (file.endsWith('.mp3')) {
                if (file.includes('bg') || file.includes('background')) {
                    manifest.audio.bgm.push(file);
                } else {
                    manifest.audio.voices.push(file);
                }
            } else if (file.endsWith('.wav')) {
                if (file.includes('choice')) {
                    manifest.audio.choices.push(file);
                } else {
                    manifest.audio.voices.push(file);
                }
            }
        });
    }

    // Scan UI
    const uiPath = path.join('assets', 'UI');
    if (fs.existsSync(uiPath)) {
        const uiFiles = fs.readdirSync(uiPath);
        manifest.ui = uiFiles
            .filter(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'))
            .map(file => `UI/${file}`);
    }

    // Scan fonts
    const fontsPath = path.join('assets', 'fonts');
    if (fs.existsSync(fontsPath)) {
        const fontFiles = fs.readdirSync(fontsPath);

        fontFiles.forEach(file => {
            if (file.endsWith('.png')) {
                manifest.fonts.bitmap = {
                    texture: `fonts/${file}`,
                    data: `fonts/${file.replace('.png', '.xml')}`
                };
            }
        });
    }

    return manifest;
}

function main() {
    const [, , outputPath] = process.argv;

    if (!outputPath) {
        console.error("Usage: node generateManifest.js output.json");
        process.exit(1);
    }

    try {
        const manifest = generateManifest();

        fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 4), 'utf8');
        console.log(`Manifest written to ${outputPath}`);
        console.log(`Found ${manifest.backgrounds.length} backgrounds`);
        console.log(`Found ${Object.keys(manifest.characters).length} character folders`);
        console.log(`Found ${manifest.audio.bgm.length + manifest.audio.choices.length + manifest.audio.voices.length} audio files`);
        console.log(`Found ${manifest.ui.length} UI elements`);
    } catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }
}

main(); 