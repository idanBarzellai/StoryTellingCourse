const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command, description) {
    console.log(`\n🔄 ${description}...`);
    try {
        execSync(command, { stdio: 'inherit' });
        console.log(`✅ ${description} completed successfully`);
    } catch (error) {
        console.error(`❌ Error in ${description}:`, error.message);
        process.exit(1);
    }
}

function runInteractiveCommand(command, description) {
    console.log(`\n🔄 ${description}...`);
    console.log('This step requires user interaction. Please follow the prompts.');
    try {
        execSync(command, { stdio: 'inherit' });
        console.log(`✅ ${description} completed successfully`);
    } catch (error) {
        console.error(`❌ Error in ${description}:`, error.message);
        process.exit(1);
    }
}

function main() {
    console.log('🚀 Starting story processing pipeline...\n');

    // Step 1: Check if character setup is needed and run it if necessary
    const characterConfigPath = 'assets/character_config.json';
    if (!fs.existsSync(characterConfigPath)) {
        console.log('⚠️  Character configuration not found!');
        console.log('Running character setup first...\n');

        try {
            runInteractiveCommand(
                'node scripts/setupCharacters.js',
                'Setting up character information'
            );
        } catch (error) {
            console.error('❌ Character setup failed. Please run manually: npm run setup');
            process.exit(1);
        }
    }

    // Step 2: Fix asset names
    runCommand(
        'node scripts/fixAssetNames.js',
        'Fixing asset names and creating character duplicates'
    );

    // Step 2: Trim HTML
    runCommand(
        'node scripts/trimHtmlScript.js assets/trimmed.html',
        'Trimming HTML file'
    );

    // Step 3: Convert to story.json format
    runCommand(
        'node scripts/convertToStoryJson.js assets/trimmed.html assets/story.json',
        'Converting to story.json format'
    );

    // Step 4: Generate manifest
    runCommand(
        'node scripts/generateManifest.js assets/manifest.json',
        'Generating manifest from assets'
    );

    // Step 5: Add emotions to story
    runCommand(
        'node scripts/addEmotions.js assets/story.json assets/manifest.json assets/story.json',
        'Adding emotions to story'
    );

    // Step 6: Standardize assets
    runCommand(
        'node scripts/standardizeAssets.js',
        'Standardizing assets'
    );

    // Step 7: Apply standardized assets
    runCommand(
        'node scripts/applyStandardizedAssets.js',
        'Applying standardized assets'
    );

    console.log('\n🎉 Story processing pipeline completed successfully!');
    console.log('\n📁 Generated files:');
    console.log('  - assets/trimmed.html (trimmed Twine HTML)');
    console.log('  - assets/story.json (final story with emotions)');
    console.log('  - assets/manifest.json (asset manifest)');
    console.log('  - assets_standardized/ (standardized assets)');

    // Clean up intermediate files
    console.log('\n🧹 Cleaning up intermediate files...');
    try {
        fs.unlinkSync('assets/trimmed.html');
        console.log('✅ Intermediate files cleaned up');
    } catch (error) {
        console.log('⚠️  Could not clean up some intermediate files');
    }

    console.log('\n✨ Final output: assets/story.json');
}

main(); 