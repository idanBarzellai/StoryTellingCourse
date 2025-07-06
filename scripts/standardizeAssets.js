const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration for standardized sizes - only characters use 1024px width with proportional height
const STANDARD_SIZES = {
    // Only characters will be standardized
    characters: {
        width: 1024,
        height: null, // Will be calculated proportionally
        fit: 'contain', // Maintains aspect ratio
        preserveTransparency: true // Keep transparent backgrounds
    }
};

// File type detection
function getAssetType(filePath) {
    const fileName = path.basename(filePath).toLowerCase();
    const dirPath = path.dirname(filePath);

    // Check directory structure
    if (dirPath.includes('bg') || dirPath.includes('background')) {
        return 'backgrounds';
    }

    if (dirPath.includes('characters') || dirPath.includes('char')) {
        return 'characters';
    }

    if (dirPath.includes('UI') || dirPath.includes('ui')) {
        // Determine UI type based on filename
        if (fileName.includes('button') || fileName.includes('choice')) {
            return 'ui.buttons';
        }
        if (fileName.includes('mute') || fileName.includes('autoplay')) {
            return 'ui.icons';
        }
        if (fileName.includes('dialog') || fileName.includes('box')) {
            return 'ui.dialogBox';
        }
        return 'ui.icons'; // Default for UI elements
    }

    // Default based on file size and dimensions
    return 'characters';
}

// Get nested object property
function getNestedProperty(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
}

// Process a single image
async function processImage(inputPath, outputPath, config) {
    try {
        console.log(`Processing: ${path.basename(inputPath)}`);

        // Get original image metadata to calculate proportional height
        const metadata = await sharp(inputPath).metadata();
        const originalWidth = metadata.width;
        const originalHeight = metadata.height;

        // Calculate proportional height if height is null
        let targetWidth = config.width;
        let targetHeight = config.height;

        if (targetHeight === null && originalWidth && originalHeight) {
            targetHeight = Math.round((originalHeight / originalWidth) * targetWidth);
        }

        let sharpInstance = sharp(inputPath);

        // Apply resize with specified configuration
        sharpInstance = sharpInstance.resize(targetWidth, targetHeight, {
            fit: config.fit,
            position: config.position || 'center'
        });

        // Ensure output directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Save the processed image with transparency preserved
        if (config.preserveTransparency) {
            await sharpInstance.png({ quality: 90 }).toFile(outputPath);
        } else {
            await sharpInstance.png({ quality: 90 }).toFile(outputPath);
        }

        console.log(`  ✓ Saved: ${path.basename(outputPath)} (${targetWidth}x${targetHeight})`);

    } catch (error) {
        console.error(`  ✗ Error processing ${path.basename(inputPath)}: ${error.message}`);
    }
}

// Process all images in a directory recursively
async function processDirectory(inputDir, outputDir, assetType) {
    if (!fs.existsSync(inputDir)) {
        console.log(`Directory not found: ${inputDir}`);
        return;
    }

    const items = fs.readdirSync(inputDir);

    for (const item of items) {
        const inputPath = path.join(inputDir, item);
        const outputPath = path.join(outputDir, item);
        const stat = fs.statSync(inputPath);

        if (stat.isDirectory()) {
            // Recursively process subdirectories
            await processDirectory(inputPath, outputPath, assetType);
        } else if (stat.isFile()) {
            // Process image files
            const ext = path.extname(item).toLowerCase();
            if (['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff'].includes(ext)) {
                const type = getAssetType(inputPath);
                const config = getNestedProperty(STANDARD_SIZES, type);

                if (config) {
                    await processImage(inputPath, outputPath, config);
                } else {
                    console.log(`  ⚠ No config found for: ${item} (type: ${type})`);
                }
            }
        }
    }
}

// Main function
async function main() {
    console.log('🎨 Asset Standardization Tool');
    console.log('==============================\n');

    const assetsDir = path.join(__dirname, '..', 'assets');
    const backupDir = path.join(__dirname, '..', 'assets_backup');
    const outputDir = path.join(__dirname, '..', 'assets_standardized');

    // Create backup
    console.log('📦 Creating backup of original assets...');
    if (fs.existsSync(assetsDir)) {
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        // Copy assets to backup
        const copyRecursive = (src, dest) => {
            if (fs.statSync(src).isDirectory()) {
                if (!fs.existsSync(dest)) {
                    fs.mkdirSync(dest, { recursive: true });
                }
                fs.readdirSync(src).forEach(file => {
                    copyRecursive(path.join(src, file), path.join(dest, file));
                });
            } else {
                fs.copyFileSync(src, dest);
            }
        };

        copyRecursive(assetsDir, backupDir);
        console.log(`  ✓ Backup created at: ${backupDir}`);
    }

    // Create output directory
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('\n🔄 Processing assets...\n');

    // First, copy everything from original assets to output
    console.log('📋 Copying all assets...');
    const copyRecursive = (src, dest) => {
        if (fs.statSync(src).isDirectory()) {
            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest, { recursive: true });
            }
            fs.readdirSync(src).forEach(file => {
                copyRecursive(path.join(src, file), path.join(dest, file));
            });
        } else {
            fs.copyFileSync(src, dest);
        }
    };

    copyRecursive(assetsDir, outputDir);
    console.log('  ✓ All assets copied');

    // Now process only the character folder in the output directory
    const characterOutputPath = path.join(outputDir, 'characters');
    const characterInputPath = path.join(assetsDir, 'characters');

    if (fs.existsSync(characterInputPath)) {
        console.log(`📁 Processing characters...`);
        await processDirectory(characterInputPath, characterOutputPath, 'characters');
        console.log('');
    }

    console.log('\n✅ Asset standardization complete!');
    console.log(`📁 Original assets backed up to: ${backupDir}`);
    console.log(`📁 Standardized assets saved to: ${outputDir}`);
    console.log('\n📊 Standardization Summary:');
    console.log(`   • Characters only: 1024px width with proportional height`);
    console.log(`   • Backgrounds and UI: Left unchanged`);
    console.log(`   • Transparency: Preserved in all character images`);
    console.log('\n💡 To use the standardized assets, replace the contents of your assets folder with the standardized version.');
}

// Run the script
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { processImage, processDirectory, STANDARD_SIZES }; 