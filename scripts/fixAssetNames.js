const fs = require('fs');
const path = require('path');

// Emotion mapping from various formats to standard names
const emotionMapping = {
    // Happy variations
    'happy': 'happy',
    'herohappy': 'happy',
    'hero_smiling': 'happy',
    'smiling': 'happy',
    'joy': 'happy',
    'cheerful': 'happy',
    'delighted': 'happy',
    'excited': 'happy',
    'thrilled': 'happy',

    // Sad variations
    'sad': 'sad',
    'herosad': 'sad',
    'hero_sad': 'sad',
    'unhappy': 'sad',
    'depressed': 'sad',
    'miserable': 'sad',
    'grief': 'sad',
    'sorrow': 'sad',

    // Angry variations
    'angry': 'angry',
    'heroangry': 'angry',
    'hero_angry': 'angry',
    'mad': 'angry',
    'furious': 'angry',
    'rage': 'angry',
    'fury': 'angry',
    'irritated': 'angry',
    'annoyed': 'angry',
    'fierce': 'angry',

    // Confused variations
    'confused': 'confused',
    'heroconfused': 'confused',
    'hero_confused': 'confused',
    'puzzled': 'confused',
    'bewildered': 'confused',
    'perplexed': 'confused',
    'uncertain': 'confused',
    'unsure': 'confused',

    // Stressed variations
    'stressed': 'stressed',
    'herostressed': 'stressed',
    'hero_stressed': 'stressed',
    'worried': 'stressed',
    'anxious': 'stressed',
    'nervous': 'stressed',
    'tense': 'stressed',
    'afraid': 'stressed',
    'scared': 'stressed',
    'fear': 'stressed',

    // Surprised variations
    'surprised': 'surprised',
    'herosurprised': 'surprised',
    'hero_surprised': 'surprised',
    'shocked': 'surprised',
    'amazed': 'surprised',
    'astonished': 'surprised',
    'stunned': 'surprised',
    'wonder': 'surprised',

    // Suspicious variations
    'suspicious': 'suspicious',
    'herosuspicious': 'suspicious',
    'hero_suspicious': 'suspicious',
    'doubtful': 'suspicious',
    'skeptical': 'suspicious',
    'distrustful': 'suspicious',
    'wary': 'suspicious',

    // Sleeping variations
    'sleeping': 'sleeping',
    'herosleeping': 'sleeping',
    'hero_sleeping': 'sleeping',
    'asleep': 'sleeping',
    'rest': 'sleeping',
    'dream': 'sleeping',
    'sleep': 'sleeping',

    // Crying variations
    'crying': 'crying',
    'herocrying': 'crying',
    'hero_crying': 'crying',
    'weeping': 'crying',
    'sobbing': 'crying',
    'tears': 'crying',
    'wailing': 'crying',

    // Annoyed variations
    'annoyed': 'annoyed',
    'heroannoyed': 'annoyed',
    'hero_annoyed': 'annoyed',
    'irritated': 'annoyed',
    'bothered': 'annoyed',
    'frustrated': 'annoyed',

    // Laugh variations
    'laugh': 'laugh',
    'herolaugh': 'laugh',
    'hero_laugh': 'laugh',
    'laughing': 'laugh',
    'giggle': 'laugh',
    'chuckle': 'laugh',
    'amused': 'laugh'
};

function normalizeEmotionName(filename) {
    // Remove file extension
    const nameWithoutExt = path.parse(filename).name.toLowerCase();

    // Check if the name matches any emotion mapping
    for (const [key, value] of Object.entries(emotionMapping)) {
        if (nameWithoutExt.includes(key)) {
            return value;
        }
    }

    // If no match found, return the original name
    return nameWithoutExt;
}

function fixCharacterFolder(characterPath, characterName) {
    if (!fs.existsSync(characterPath)) {
        console.log(`Character folder not found: ${characterPath}`);
        return;
    }

    const files = fs.readdirSync(characterPath);
    const imageFiles = files.filter(file =>
        file.toLowerCase().endsWith('.png') ||
        file.toLowerCase().endsWith('.jpg') ||
        file.toLowerCase().endsWith('.jpeg')
    );

    console.log(`Processing ${characterName}: ${imageFiles.length} images`);

    // Track renamed files to avoid conflicts
    const renamedFiles = new Set();
    let baseImageCreated = false;

    imageFiles.forEach(file => {
        const filePath = path.join(characterPath, file);
        const fileExt = path.extname(file);
        const originalName = path.parse(file).name;

        // Normalize emotion name
        const normalizedEmotion = normalizeEmotionName(originalName);

        // Create new filename
        let newFilename;
        if (normalizedEmotion === characterName || originalName === characterName) {
            // This is the base character image
            newFilename = `${characterName}${fileExt}`;
            baseImageCreated = true;
        } else {
            // This is an emotion image
            newFilename = `${normalizedEmotion}${fileExt}`;
        }

        const newFilePath = path.join(characterPath, newFilename);

        // Handle filename conflicts
        if (fs.existsSync(newFilePath) && file !== newFilename) {
            // Create a numbered version
            let counter = 1;
            let numberedFilename = newFilename;
            while (fs.existsSync(path.join(characterPath, numberedFilename))) {
                const nameWithoutExt = path.parse(newFilename).name;
                const ext = path.parse(newFilename).ext;
                numberedFilename = `${nameWithoutExt} (${counter})${ext}`;
                counter++;
            }
            newFilename = numberedFilename;
        }

        // Rename the file
        if (file !== newFilename) {
            try {
                fs.renameSync(filePath, path.join(characterPath, newFilename));
                console.log(`  Renamed: ${file} → ${newFilename}`);
                renamedFiles.add(newFilename);
            } catch (error) {
                console.error(`  Error renaming ${file}: ${error.message}`);
            }
        } else {
            renamedFiles.add(newFilename);
        }
    });

    // Create character base image if it doesn't exist
    if (!baseImageCreated) {
        const firstImage = Array.from(renamedFiles)[0];
        if (firstImage) {
            const sourcePath = path.join(characterPath, firstImage);
            const targetPath = path.join(characterPath, `${characterName}.png`);

            try {
                fs.copyFileSync(sourcePath, targetPath);
                console.log(`  Created base image: ${characterName}.png (copy of ${firstImage})`);
            } catch (error) {
                console.error(`  Error creating base image: ${error.message}`);
            }
        }
    }

    return Array.from(renamedFiles);
}

function main() {
    const charactersPath = path.join('assets', 'characters');

    if (!fs.existsSync(charactersPath)) {
        console.error('Characters folder not found!');
        process.exit(1);
    }

    console.log('🔧 Fixing asset names and creating character duplicates...\n');

    const characterFolders = fs.readdirSync(charactersPath);
    const results = {};

    characterFolders.forEach(folder => {
        const folderPath = path.join(charactersPath, folder);
        const stat = fs.statSync(folderPath);

        if (stat.isDirectory()) {
            console.log(`\n📁 Processing character: ${folder}`);
            const files = fixCharacterFolder(folderPath, folder);
            results[folder] = files;
        }
    });

    console.log('\n✅ Asset name fixing completed!');
    console.log('\n📊 Summary:');
    Object.entries(results).forEach(([character, files]) => {
        console.log(`  ${character}: ${files.length} files`);
    });

    console.log('\n🎯 Standardized emotion names:');
    const uniqueEmotions = new Set();
    Object.values(results).flat().forEach(file => {
        const emotion = path.parse(file).name;
        if (emotion !== 'main_char' && emotion !== 'npc_1' && emotion !== 'npc_2' && emotion !== 'npc_3') {
            uniqueEmotions.add(emotion);
        }
    });
    console.log(`  ${Array.from(uniqueEmotions).sort().join(', ')}`);
}

main(); 