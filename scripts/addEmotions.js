const fs = require('fs');

function analyzeTextEmotion(text) {
    const lowerText = text.toLowerCase();

    // Define emotion keywords with story context and narrative analysis
    const emotionKeywords = {
        'happy': [
            // Direct emotion words
            'happy', 'joy', 'excited', 'thrilled', 'delighted', 'cheerful', 'smile', 'laugh',
            // Story context - positive outcomes
            'welcomes', 'greet', 'hero', 'sparkling', 'victory', 'wins', 'triumph', 'success',
            'celebrates', 'rejoices', 'glad', 'pleased', 'content', 'satisfied',
            // Positive actions and states
            'dances', 'sings', 'plays', 'enjoys', 'loves', 'appreciates', 'blessed',
            // Resolution and happy endings
            'together forever', 'lived happily', 'peace', 'harmony', 'reunited'
        ],
        'sad': [
            // Direct emotion words
            'sad', 'crying', 'tears', 'depressed', 'unhappy', 'miserable', 'grief', 'sorrow',
            // Story context - negative outcomes
            'tear', 'broken', 'destroyed', 'lost', 'defeated', 'failed', 'died', 'death',
            // Emotional states
            'heartbroken', 'devastated', 'crushed', 'disappointed', 'hopeless', 'despair',
            // Physical manifestations
            'weeps', 'sobs', 'mourns', 'laments', 'sighs', 'droops'
        ],
        'angry': [
            // Direct emotion words
            'angry', 'mad', 'furious', 'rage', 'fury', 'irritated', 'annoyed', 'fierce',
            // Story context - conflict and aggression
            'shouts', 'attack', 'fights', 'battles', 'wars', 'conflicts', 'enraged',
            // Aggressive actions
            'strikes', 'hits', 'punches', 'kicks', 'throws', 'destroys', 'smashes',
            // Emotional intensity
            'boiling', 'steaming', 'livid', 'outraged', 'infuriated', 'wrath'
        ],
        'confused': [
            // Direct emotion words
            'confused', 'puzzled', 'bewildered', 'perplexed', 'uncertain', 'unsure',
            // Story context - memory and understanding
            'confuses', 'doesn\'t remember', 'forgets', 'lost memory', 'amnesia',
            // Cognitive states
            'doesn\'t understand', 'mystified', 'baffled', 'stumped', 'clueless',
            // Actions indicating confusion
            'stares blankly', 'looks around', 'shakes head', 'scratches head'
        ],
        'stressed': [
            // Direct emotion words
            'stressed', 'worried', 'anxious', 'nervous', 'tense', 'afraid', 'scared', 'fear',
            // Story context - danger and pressure
            'panics', 'battle', 'war', 'danger', 'threat', 'chase', 'escape', 'hiding',
            // Physical stress indicators
            'trembles', 'shakes', 'sweats', 'pants', 'gasps', 'hyperventilates',
            // Situational stress
            'trapped', 'cornered', 'surrounded', 'outnumbered', 'helpless'
        ],
        'surprised': [
            // Direct emotion words
            'surprised', 'shocked', 'amazed', 'astonished', 'stunned', 'wonder',
            // Story context - unexpected events
            'looks surprised', 'flash', 'suddenly', 'unexpectedly', 'out of nowhere',
            // Magical or extraordinary events
            'magic', 'transforms', 'changes', 'appears', 'disappears', 'materializes',
            // Reactions to surprises
            'gasps', 'jumps', 'startles', 'wide eyes', 'open mouth', 'jaw drops'
        ],
        'suspicious': [
            // Direct emotion words
            'suspicious', 'doubtful', 'skeptical', 'distrustful', 'wary',
            // Story context - uncertainty and doubt
            'really don\'t remember', 'questions', 'doubts', 'suspects', 'wonders if',
            // Cautious behavior
            'carefully', 'slowly', 'hesitantly', 'cautiously', 'guardedly',
            // Distrust indicators
            'doesn\'t trust', 'suspicious of', 'looks sideways', 'narrows eyes'
        ],
        'sleeping': [
            // Direct emotion words
            'sleeping', 'asleep', 'rest', 'dream', 'sleep', 'sleeps',
            // Story context - rest and dreams
            'dreams', 'dreaming', 'resting', 'napping', 'dozing', 'slumbering',
            // Sleep-related actions
            'yawns', 'stretches', 'wakes up', 'falls asleep', 'drifts off'
        ],
        'crying': [
            // Direct emotion words
            'crying', 'weeping', 'sobbing', 'tears', 'wailing',
            // Physical manifestations
            'tears fall', 'eyes water', 'sniffles', 'whimpers', 'moans',
            // Emotional crying
            'cries out', 'bursts into tears', 'breaks down', 'emotional'
        ],
        'annoyed': [
            // Direct emotion words
            'annoyed', 'irritated', 'bothered', 'frustrated',
            // Story context - minor conflicts
            'rolls eyes', 'sighs', 'groans', 'complains', 'grumbles',
            // Irritation indicators
            'impatient', 'exasperated', 'fed up', 'tired of', 'had enough'
        ],
        'laugh': [
            // Direct emotion words
            'laugh', 'laughing', 'giggle', 'chuckle', 'amused',
            // Story context - humor and joy
            'jokes', 'funny', 'humorous', 'entertained', 'delighted',
            // Laughter types
            'guffaws', 'chortles', 'snickers', 'cackles', 'roars with laughter'
        ]
    };

    const detectedEmotions = {};

    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
        const count = keywords.reduce((sum, keyword) => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            const matches = (lowerText.match(regex) || []).length;
            return sum + matches;
        }, 0);

        if (count > 0) {
            detectedEmotions[emotion] = count;
        }
    });

    return detectedEmotions;
}

function loadCharacterConfig() {
    try {
        const configPath = 'assets/character_config.json';
        if (fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            return {
                main_char: config.main_character.toLowerCase(),
                npc_1: config.npc_1.toLowerCase(),
                npc_2: config.npc_2.toLowerCase(),
                npc_3: config.npc_3.toLowerCase()
            };
        }
    } catch (error) {
        console.log('⚠️  Could not load character configuration:', error.message);
    }
    return null;
}

function extractCharacterNames(text) {
    const lowerText = text.toLowerCase();
    const characters = new Set();
    const characterConfig = loadCharacterConfig();

    // Common English pronouns that indicate character presence
    const pronouns = ['he', 'she', 'his', 'her', 'him'];

    // Look for quoted dialogue which often indicates speaking characters
    const dialogueRegex = /["""]([^"""]+)["""]/g;
    let match;
    while ((match = dialogueRegex.exec(text)) !== null) {
        const dialogue = match[1];
        // If dialogue contains pronouns, it indicates character presence
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

    // Use character configuration if available
    if (characterConfig) {
        // Check for main character
        if (lowerText.includes(characterConfig.main_char) ||
            lowerText.includes('prince') || lowerText.includes('doll')) {
            characters.add('main_char');
        }

        // Check for NPC 1
        if (lowerText.includes(characterConfig.npc_1)) {
            characters.add('npc_1');
        }

        // Check for NPC 2
        if (lowerText.includes(characterConfig.npc_2)) {
            characters.add('npc_2');
        }

        // Check for NPC 3
        if (lowerText.includes(characterConfig.npc_3)) {
            characters.add('npc_3');
        }
    } else {
        // Fallback to generic character detection
        if (lowerText.includes('nutcracker') || lowerText.includes('clara') ||
            lowerText.includes('prince') || lowerText.includes('doll')) {
            characters.add('main_char');
        }

        // Antagonists and enemies
        if (lowerText.includes('mouse king') || lowerText.includes('mouse') ||
            lowerText.includes('enemy') || lowerText.includes('villain') ||
            lowerText.includes('giant') || lowerText.includes('monster')) {
            characters.add('npc_3');
        }

        // Magical helpers and mentors
        if (lowerText.includes('wizard') || lowerText.includes('sugar fairy') ||
            lowerText.includes('fairy') || lowerText.includes('magician') ||
            lowerText.includes('sage') || lowerText.includes('mentor')) {
            characters.add('npc_2');
        }

        // Authority figures and family
        if (lowerText.includes('king') || lowerText.includes('queen') ||
            lowerText.includes('mother') || lowerText.includes('mom') ||
            lowerText.includes('father') || lowerText.includes('dad') ||
            lowerText.includes('parent') || lowerText.includes('guardian')) {
            characters.add('npc_1');
        }
    }

    // Detect characters based on actions and roles
    if (lowerText.includes('attacks') || lowerText.includes('fights') ||
        lowerText.includes('battles') || lowerText.includes('defeats')) {
        // If someone is fighting, likely main character and enemy are present
        characters.add('main_char');
        characters.add('npc_3');
    }

    if (lowerText.includes('helps') || lowerText.includes('saves') ||
        lowerText.includes('rescues') || lowerText.includes('guides')) {
        // If someone is helping, likely main character and helper are present
        characters.add('main_char');
        characters.add('npc_2');
    }

    return Array.from(characters);
}

function determineSpeaker(text) {
    const lowerText = text.toLowerCase();

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

function detectCharactersInPassage(text) {
    const characters = extractCharacterNames(text);

    // Map detected characters to available character slots
    const characterMapping = {};
    const availableSlots = ['main_char', 'npc_1', 'npc_2', 'npc_3'];
    let slotIndex = 0;

    characters.forEach(character => {
        if (slotIndex < availableSlots.length) {
            characterMapping[character] = availableSlots[slotIndex];
            slotIndex++;
        }
    });

    // Limit to maximum 2 characters per passage
    const mappedCharacters = Object.values(characterMapping);
    return mappedCharacters.slice(0, 2);
}

function analyzeStoryContext(passage, storyData, passageIndex) {
    const context = {
        isBeginning: passageIndex === 0,
        isEnding: passageIndex === storyData.passages.length - 1,
        hasConflict: false,
        hasResolution: false,
        hasTransformation: false,
        hasMagic: false,
        hasDialogue: false
    };

    const lowerText = passage.cleanText.toLowerCase();

    // Analyze passage content for story context
    context.hasConflict = lowerText.includes('battle') || lowerText.includes('war') ||
        lowerText.includes('fight') || lowerText.includes('attack') ||
        lowerText.includes('conflict') || lowerText.includes('danger');

    context.hasResolution = lowerText.includes('victory') || lowerText.includes('win') ||
        lowerText.includes('peace') || lowerText.includes('together') ||
        lowerText.includes('end') || lowerText.includes('solved');

    context.hasTransformation = lowerText.includes('transform') || lowerText.includes('change') ||
        lowerText.includes('becomes') || lowerText.includes('turns into') ||
        lowerText.includes('prince') || lowerText.includes('awaken');

    context.hasMagic = lowerText.includes('magic') || lowerText.includes('spell') ||
        lowerText.includes('enchant') || lowerText.includes('fairy') ||
        lowerText.includes('wizard') || lowerText.includes('curse');

    context.hasDialogue = /["""]/.test(passage.cleanText);

    return context;
}

function suggestEmotionsByContext(context, character) {
    const suggestions = [];

    if (context.isBeginning) {
        if (character === 'main_char') suggestions.push('happy', 'surprised');
        if (character === 'npc_1') suggestions.push('happy', 'content');
    }

    if (context.hasConflict) {
        if (character === 'main_char') suggestions.push('stressed', 'angry', 'surprised');
        if (character === 'npc_3') suggestions.push('angry', 'fierce');
        if (character === 'npc_2') suggestions.push('worried', 'concerned');
    }

    if (context.hasResolution) {
        if (character === 'main_char') suggestions.push('happy', 'relieved');
        if (character === 'npc_3') suggestions.push('defeated', 'sad');
        if (character === 'npc_2') suggestions.push('happy', 'proud');
    }

    if (context.hasTransformation) {
        if (character === 'main_char') suggestions.push('surprised', 'happy');
        if (character === 'npc_1') suggestions.push('surprised', 'amazed');
    }

    if (context.hasMagic) {
        if (character === 'main_char') suggestions.push('surprised', 'confused');
        if (character === 'npc_2') suggestions.push('mysterious', 'wise');
    }

    if (context.isEnding) {
        if (character === 'main_char') suggestions.push('happy', 'content');
        if (character === 'npc_1') suggestions.push('happy', 'proud');
    }

    return suggestions;
}

function addEmotionsToStory(storyData, manifest) {
    const availableEmotions = manifest.characters;

    storyData.passages.forEach((passage, index) => {
        const emotions = [];
        const detectedEmotions = analyzeTextEmotion(passage.cleanText);
        const speaker = determineSpeaker(passage.cleanText);
        const charactersInPassage = detectCharactersInPassage(passage.cleanText);
        const context = analyzeStoryContext(passage, storyData, index);

        // Debug logging
        if (index < 5) { // Only log first 5 passages to avoid spam
            console.log(`Passage ${index + 1}: "${passage.name}"`);
            console.log(`  Characters detected: ${charactersInPassage.join(', ')}`);
            console.log(`  Emotions detected: ${Object.keys(detectedEmotions).join(', ')}`);
            console.log(`  Context: ${Object.keys(context).filter(k => context[k]).join(', ')}`);
        }

        // Add speaker if detected
        if (speaker) {
            passage.speaker = speaker;
        }

        // Only add emotions for characters that appear in this passage
        charactersInPassage.forEach(character => {
            if (!availableEmotions[character]) {
                if (index < 5) console.log(`  Character ${character} not found in manifest`);
                return;
            }

            const characterEmotions = availableEmotions[character];
            const textEmotions = analyzeTextEmotion(passage.cleanText);

            // Find the best matching emotion for this character
            let bestEmotion = null;
            let bestScore = 0;

            // First, try to match detected emotions in the text
            Object.entries(textEmotions).forEach(([emotion, score]) => {
                // Check if this emotion is available for this character
                const availableEmotion = characterEmotions.find(em =>
                    em.toLowerCase().includes(emotion.toLowerCase()) ||
                    emotion.toLowerCase().includes(em.replace('.png', '').toLowerCase())
                );

                if (availableEmotion && score > bestScore) {
                    bestEmotion = emotion;
                    bestScore = score;
                }
            });

            // If no emotion detected in text, use context-based suggestions
            if (!bestEmotion) {
                const contextSuggestions = suggestEmotionsByContext(context, character);
                for (const suggestion of contextSuggestions) {
                    const availableEmotion = characterEmotions.find(em =>
                        em.toLowerCase().includes(suggestion.toLowerCase())
                    );
                    if (availableEmotion) {
                        bestEmotion = suggestion;
                        break;
                    }
                }
            }

            // Add the emotion if found
            if (bestEmotion) {
                emotions.push({
                    character: character,
                    emotion: bestEmotion.charAt(0).toUpperCase() + bestEmotion.slice(1)
                });
                if (index < 5) console.log(`  Added emotion: ${character} - ${bestEmotion}`);
            }
        });

        if (emotions.length > 0) {
            passage.emotions = emotions;
        }
    });

    return storyData;
}

function main() {
    const [, , storyPath, manifestPath, outputPath] = process.argv;

    if (!storyPath || !manifestPath || !outputPath) {
        console.error("Usage: node addEmotions.js story.json manifest.json output.json");
        process.exit(1);
    }

    try {
        const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

        const enhancedStory = addEmotionsToStory(storyData, manifest);

        fs.writeFileSync(outputPath, JSON.stringify(enhancedStory, null, 4), 'utf8');
        console.log(`Enhanced story with emotions written to ${outputPath}`);

        // Count emotions added
        let emotionCount = 0;
        enhancedStory.passages.forEach(passage => {
            if (passage.emotions) {
                emotionCount += passage.emotions.length;
            }
        });
        console.log(`Added ${emotionCount} emotion entries across ${enhancedStory.passages.length} passages`);
    } catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }
}

main(); 