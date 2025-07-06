const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            resolve(answer.trim());
        });
    });
}

function saveCharacterInfo(characters) {
    const characterInfo = {
        main_character: characters.main,
        npc_1: characters.npc1,
        npc_2: characters.npc2,
        npc_3: characters.npc3,
        created_at: new Date().toISOString(),
        description: "Character information for story parsing and emotion detection"
    };

    // Save to a character config file
    fs.writeFileSync('assets/character_config.json', JSON.stringify(characterInfo, null, 2));

    // Also save to a simple text file for easy reference
    const textContent = `Character Configuration:
====================

Main Character: ${characters.main}
NPC 1: ${characters.npc1}
NPC 2: ${characters.npc2}
NPC 3: ${characters.npc3}

Created: ${new Date().toLocaleString()}

This information is used by the story processing scripts to:
- Detect characters in story text
- Assign appropriate emotions to each character
- Map characters to available character assets
- Improve story parsing accuracy
`;

    fs.writeFileSync('assets/characters.txt', textContent);

    console.log('\n✅ Character information saved!');
    console.log('📁 Files created:');
    console.log('  - assets/character_config.json');
    console.log('  - assets/characters.txt');
}

function displayWelcome() {
    console.log('\n🎭 Welcome to the Storytelling Platform Creator! 🎭');
    console.log('==================================================');
    console.log('\nThis tool will help you set up character information for your story.');
    console.log('This information will be used to:');
    console.log('  • Detect characters in your story text');
    console.log('  • Assign appropriate emotions to each character');
    console.log('  • Map characters to available character assets');
    console.log('  • Improve story parsing accuracy');
    console.log('\nPlease provide the names of the main characters in your story:');
    console.log('');
}

async function getCharacterInfo() {
    const characters = {};

    try {
        // Get main character
        characters.main = await question('🎯 Who is the main character of your story? ');
        if (!characters.main) {
            console.log('⚠️  Main character name is required. Please try again.');
            process.exit(1);
        }

        // Get NPC 1
        characters.npc1 = await question('👤 Who is NPC #1? ');
        if (!characters.npc1) {
            console.log('⚠️  NPC #1 name is required. Please try again.');
            process.exit(1);
        }

        // Get NPC 2
        characters.npc2 = await question('👤 Who is NPC #2? ');
        if (!characters.npc2) {
            console.log('⚠️  NPC #2 name is required. Please try again.');
            process.exit(1);
        }

        // Get NPC 3
        characters.npc3 = await question('👤 Who is NPC #3? ');
        if (!characters.npc3) {
            console.log('⚠️  NPC #3 name is required. Please try again.');
            process.exit(1);
        }

        return characters;

    } catch (error) {
        console.error('❌ Error getting character information:', error.message);
        process.exit(1);
    }
}

function displaySummary(characters) {
    console.log('\n📋 Character Summary:');
    console.log('====================');
    console.log(`🎯 Main Character: ${characters.main}`);
    console.log(`👤 NPC #1: ${characters.npc1}`);
    console.log(`👤 NPC #2: ${characters.npc2}`);
    console.log(`👤 NPC #3: ${characters.npc3}`);
    console.log('');
}

async function confirmCharacters(characters) {
    const answer = await question('✅ Is this information correct? (y/n): ');
    return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}

async function main() {
    try {
        displayWelcome();

        const characters = await getCharacterInfo();

        displaySummary(characters);

        const confirmed = await confirmCharacters(characters);

        if (confirmed) {
            saveCharacterInfo(characters);
            console.log('\n🎉 Character setup completed successfully!');
            console.log('\nYou can now run the story processing pipeline:');
            console.log('  npm run story');
            console.log('\nThe character information will be used to improve:');
            console.log('  • Character detection in story text');
            console.log('  • Emotion assignment accuracy');
            console.log('  • Story parsing quality');
        } else {
            console.log('\n🔄 Please run the script again to re-enter character information.');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        rl.close();
    }
}

main(); 