const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');

const Prefs = {
    BR_WORD_STEM_PERCENTAGE: 0.5, // Percentage of the word stem to use for the fixation
};


function modifyEPUB(epubFilePath) {
    const outputFileName = path.basename(epubFilePath, path.extname(epubFilePath)) + '-bionified.epub';
    const outputFilePath = path.join(path.dirname(epubFilePath), outputFileName);

    // Read the EPUB file
    return new Promise((resolve, reject) => {
        fs.readFile(epubFilePath, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    })
        .then(async (epubFile) => {
            const loadedZip = await JSZip.loadAsync(epubFile);
            for (const fileName in loadedZip.files) {
                if (fileName.endsWith('.xhtml') || fileName.endsWith('.html')) {
                    console.log(`Processing file: ${fileName}`);

                    const fileContent = await loadedZip.files[fileName].async('string');
                    const modifiedContent = bionizeHTML(fileContent);
                    loadedZip.file(fileName, modifiedContent);
                }
            }

            const modifiedEpubBuffer = await loadedZip.generateAsync({type: "nodebuffer"});
            fs.writeFileSync(outputFilePath, modifiedEpubBuffer);
            console.log(`Modified EPUB saved to: ${outputFilePath}`);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}


function bionizeHTML(htmlString, contentStyle) {
    try {
        return htmlString.replace(/>([^<]+)</g, (match, textContent) => {
            let highlightedTextContent = '';

            textContent.replace(/&[a-zA-Z0-9#]+;|\S+|\s+/g, (match) => {
                if (match.startsWith('&')) {
                    console.log(match);
                    highlightedTextContent += match;
                } else {
                    const {length} = match;
                    const brWordStemWidth = length > 3 ? Math.round(length * Prefs.BR_WORD_STEM_PERCENTAGE) : length;
                    const firstHalf = match.slice(0, brWordStemWidth);
                    const secondHalf = match.slice(brWordStemWidth);
                    highlightedTextContent += `<span ${secondHalf.length ? '' : 'fixation="true"'}><strong>${firstHalf}</strong>${secondHalf.length ? `<span>${secondHalf}</span>` : ''}</span>`;
                }
            });

            return `>${highlightedTextContent}<`;
            /* }).replace(/<head>/, (match) => {
                 // Inject dynamic styles for saccades into the head
                 return `<head>`; */

        }).replace(/<body>/, (match) => {
            // Add the content style to the body tag
            return `<body style="${contentStyle}">`;
        });
    } catch (error) {
        console.error(error);
        return htmlString;
    }
}


const args = process.argv.slice(2);
if (args.length !== 1) {
    console.error("Please provide the path to the EPUB file as a command-line argument.");
} else {
    const epubFilePath = args[0];
    modifyEPUB(epubFilePath);
}
