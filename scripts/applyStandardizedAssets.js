const fs = require('fs');
const path = require('path');

function copyDirectory(src, dest) {
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    // Read source directory
    const items = fs.readdirSync(src);

    for (const item of items) {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        const stat = fs.statSync(srcPath);

        if (stat.isDirectory()) {
            // Recursively copy subdirectories
            copyDirectory(srcPath, destPath);
        } else {
            // Copy files
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function main() {
    console.log('🔄 Applying Standardized Assets');
    console.log('===============================\n');

    const assetsDir = path.join(__dirname, '..', 'assets');
    const standardizedDir = path.join(__dirname, '..', 'assets_standardized');

    if (!fs.existsSync(standardizedDir)) {
        console.error('❌ Standardized assets directory not found!');
        console.error('Please run "npm run standardize" first.');
        process.exit(1);
    }

    // Remove existing assets directory
    if (fs.existsSync(assetsDir)) {
        console.log('🗑️  Removing existing assets...');
        fs.rmSync(assetsDir, { recursive: true, force: true });
    }

    // Copy standardized assets to assets directory
    console.log('📋 Copying standardized assets...');
    copyDirectory(standardizedDir, assetsDir);

    console.log('✅ Standardized assets applied successfully!');
    console.log('🎮 Your game now has consistent asset proportions.');
}

if (require.main === module) {
    main();
}

module.exports = { copyDirectory }; 