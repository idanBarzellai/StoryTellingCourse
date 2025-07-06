const fs = require('fs');
const path = require('path');

function findHtmlFile(assetsDir) {
  try {
    const files = fs.readdirSync(assetsDir);
    const htmlFile = files.find(file => file.toLowerCase().endsWith('.html'));

    if (!htmlFile) {
      throw new Error(`No HTML file found in ${assetsDir}`);
    }

    return path.join(assetsDir, htmlFile);
  } catch (error) {
    throw new Error(`Error reading assets directory: ${error.message}`);
  }
}

function extractBodyToTwStoryData(html) {
  const bodyStartMatch = html.match(/<body[^>]*>/i);
  const storydataEndMatch = html.match(/<\/tw-storydata>/i);

  if (!bodyStartMatch || !storydataEndMatch) {
    throw new Error("Could not find <body> or </tw-storydata> in the HTML.");
  }

  const startIdx = bodyStartMatch.index;
  const endIdx = storydataEndMatch.index + storydataEndMatch[0].length;

  return html.slice(startIdx, endIdx);
}

function main() {
  const [, , outputPath] = process.argv;

  if (!outputPath) {
    console.error("Usage: node trimHtml.js output.html");
    process.exit(1);
  }

  try {
    const assetsDir = 'assets';
    const inputPath = findHtmlFile(assetsDir);

    console.log(`Found HTML file: ${inputPath}`);

    const html = fs.readFileSync(inputPath, 'utf8');
    const trimmed = extractBodyToTwStoryData(html);
    fs.writeFileSync(outputPath, trimmed, 'utf8');
    console.log(`Trimmed HTML written to ${outputPath}`);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

main();
