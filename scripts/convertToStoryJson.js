const fs = require('fs');
const { JSDOM } = require('jsdom');

function extractCharacterNames(text) {
    const lowerText = text.toLowerCase();
    const characters = new Set();

    // Look for quoted dialogue which often indicates speaking characters
    const dialogueRegex = /["""]([^"""]+)["""]/g;
    let match;
    while ((match = dialogueRegex.exec(text)) !== null) {
        const dialogue = match[1];
        // If dialogue contains pronouns, it indicates character presence
        const pronouns = ['he', 'she', 'his', 'her', 'him', 'i', 'me', 'my', 'we', 'us', 'our'];
        if (pronouns.some(pronoun => dialogue.toLowerCase().includes(pronoun))) {
            characters.add('main_char');
        }
    }

    // Look for character names (words that appear multiple times and are capitalized)
    const words = text.split(/\s+/);
    const nameCandidates = words.filter(word => {
        // Check if word starts with capital letter and appears multiple times
        if (word.length > 2 && /^[A-Z]/.test(word)) {
            const wordCount = (text.match(new RegExp(`\\b${word}\\b`, 'gi')) || []).length;
            return wordCount > 1;
        }
        return false;
    });

    // Add unique character names
    nameCandidates.forEach(name => {
        if (name.length > 2) {
            characters.add(name.toLowerCase());
        }
    });

    // Generic character role detection - can be customized per story
    // To customize for your story, modify the keywords below to match your character roles
    const characterRoles = {
        'npc_1': ['mother', 'mom', 'mama', 'parent', 'guardian'],
        'npc_2': ['father', 'dad', 'papa', 'parent', 'guardian'],
        'npc_3': ['king', 'queen', 'royal', 'ruler', 'monarch', 'prince', 'princess'],
        'npc_4': ['wizard', 'witch', 'magician', 'sorcerer', 'enchanter'],
        'npc_5': ['friend', 'companion', 'ally', 'helper', 'assistant'],
        'npc_6': ['enemy', 'villain', 'antagonist', 'foe', 'opponent']
    };

    // Check for character roles
    for (const [characterKey, keywords] of Object.entries(characterRoles)) {
        if (keywords.some(keyword => lowerText.includes(keyword))) {
            characters.add(characterKey);
        }
    }

    return Array.from(characters);
}

function determineSpeaker(text) {
    // Look for dialogue attribution patterns
    const dialoguePatterns = [
        /["""]([^"""]+)["""]\s*[:\-]\s*([^.\n]+)/g,  // "Dialogue": Speaker
        /([^.\n]+)\s*[:\-]\s*["""]([^"""]+)["""]/g,  // Speaker: "Dialogue"
    ];

    for (const pattern of dialoguePatterns) {
        let match;
        while ((match = pattern.exec(text)) !== null) {
            const speaker = match[1] || match[2];
            if (speaker && speaker.trim().length > 0) {
                return speaker.trim().toLowerCase();
            }
        }
    }

    return null;
}

function parseTwineHTML(htmlContent) {
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;

    const passages = [];
    const passageMap = new Map(); // Map to store passages by their actual ID
    const nameToIdMap = new Map(); // Map to store passage names to IDs
    const twPassages = document.querySelectorAll('tw-passagedata');

    // First pass: collect all passages and create maps
    twPassages.forEach((passage) => {
        const id = parseInt(passage.getAttribute('pid'));
        const name = passage.getAttribute('name') || `Passage ${id}`;
        const content = passage.textContent.trim();

        // Store the name to ID mapping
        nameToIdMap.set(name, id);
    });

    // Second pass: parse passages with proper link resolution
    twPassages.forEach((passage) => {
        const id = parseInt(passage.getAttribute('pid'));
        const name = passage.getAttribute('name') || `Passage ${id}`;
        const content = passage.textContent.trim();

        // Parse links from the content
        const links = [];
        const linkRegex = /\[\[([^\]]+)\]\]/g;
        let match;

        while ((match = linkRegex.exec(content)) !== null) {
            const linkText = match[1];

            // Handle different link formats:
            // 1. "Text->Target" format
            // 2. "Text -&gt; Target" format (HTML encoded)
            // 3. "Text -> Target" format
            // 4. "Text" format (just the link text)

            let cleanLinkText = linkText;
            let targetPassageId = null;

            // Check for arrow patterns
            const arrowPatterns = [
                /^(.*?)\s*->\s*(\d+(?:\.\d+)?)$/,           // "Text -> 2"
                /^(.*?)\s*-&gt;\s*(\d+(?:\.\d+)?)$/,        // "Text -&gt; 2" (HTML encoded)
                /^(.*?)\s*->\s*(\d+(?:\.\d+)?)$/            // "Text->2"
            ];

            for (const pattern of arrowPatterns) {
                const arrowMatch = linkText.match(pattern);
                if (arrowMatch) {
                    cleanLinkText = arrowMatch[1].trim();
                    const fullId = arrowMatch[2];
                    // For passage IDs like "6.2", we'll use just the main number "6"
                    targetPassageId = parseInt(fullId.split('.')[0]);
                    break;
                }
            }

            // If no arrow pattern found, try to find by passage name
            if (targetPassageId === null) {
                // First, try to match the exact link text as a passage name
                if (nameToIdMap.has(linkText)) {
                    targetPassageId = nameToIdMap.get(linkText);
                    cleanLinkText = linkText;
                } else {
                    // Try to extract a number from the link text as fallback
                    const numberMatch = linkText.match(/(\d+)/);
                    if (numberMatch) {
                        targetPassageId = parseInt(numberMatch[1]);
                        cleanLinkText = linkText.replace(/\d+/, '').trim();
                    }
                }
            }

            if (targetPassageId !== null) {
                links.push({
                    linkText: cleanLinkText,
                    passageId: targetPassageId
                });
            }
        }

        // Clean the text by removing link syntax
        const cleanText = content.replace(/\[\[[^\]]+\]\]/g, '').trim();

        // Determine background based on passage content or default
        let background = 'scenery_0'; // Default background

        // Dynamic background assignment based on content analysis
        const text = cleanText.toLowerCase();

        // Generic scene detection - can be customized per story
        // To customize for your story, modify the keywords below to match your background images
        const sceneKeywords = {
            'scenery_1': ['inside', 'room', 'house', 'home', 'interior', 'indoor'],
            'scenery_2': ['outside', 'garden', 'forest', 'woods', 'nature', 'outdoor'],
            'scenery_3': ['castle', 'palace', 'throne', 'royal', 'kingdom'],
            'scenery_4': ['battle', 'fight', 'war', 'conflict', 'combat', 'attack'],
            'scenery_5': ['magical', 'fantasy', 'enchanted', 'wonderland', 'magic'],
            'scenery_6': ['night', 'dark', 'sleep', 'dream', 'evening', 'midnight']
        };

        // Find the most appropriate background based on keywords
        for (const [sceneKey, keywords] of Object.entries(sceneKeywords)) {
            if (keywords.some(keyword => text.includes(keyword))) {
                background = sceneKey;
                break;
            }
        }

        // Detect speaker if present
        const speaker = determineSpeaker(cleanText);

        const passageData = {
            name: name,
            id: id,
            links: links,
            cleanText: cleanText,
            background: background
        };

        if (speaker) {
            passageData.speaker = speaker;
        }

        passageMap.set(id, passageData);
    });

    // Second pass: sort passages by their actual ID and add to array
    const sortedIds = Array.from(passageMap.keys()).sort((a, b) => a - b);
    sortedIds.forEach(id => {
        passages.push(passageMap.get(id));
    });

    return { passages };
}

function main() {
    const [, , inputPath, outputPath] = process.argv;

    if (!inputPath || !outputPath) {
        console.error("Usage: node convertToStoryJson.js input.html output.json");
        process.exit(1);
    }

    try {
        const htmlContent = fs.readFileSync(inputPath, 'utf8');
        const storyData = parseTwineHTML(htmlContent);

        fs.writeFileSync(outputPath, JSON.stringify(storyData, null, 4), 'utf8');
        console.log(`Story JSON written to ${outputPath}`);
        console.log(`Converted ${storyData.passages.length} passages`);

        // Log some debug info
        console.log('\nPassage IDs found:');
        storyData.passages.forEach(passage => {
            console.log(`  ID ${passage.id}: "${passage.name}" (${passage.links.length} links)`);
            if (passage.links.length > 0) {
                passage.links.forEach(link => {
                    console.log(`    -> "${link.linkText}" -> Passage ID ${link.passageId}`);
                });
            }
        });
    } catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }
}

main(); 