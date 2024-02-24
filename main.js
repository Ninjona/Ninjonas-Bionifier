const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');

const Prefs = {
    MAX_FIXATION_PARTS: 5,
    FIXATION_LOWER_BOUND: 3,
    BR_WORD_STEM_PERCENTAGE: 0.5,
    NON_FIXATION_OPACITY: 1, // Opacity for non-fixation text
    FIXATION_OPACITY: 0.2, // Opacity for fixation text
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
            // Load the EPUB content into the zip instance
            const loadedZip = await JSZip.loadAsync(epubFile);
            4
            // Apply strong tag modifications
            await applyStrongTag(loadedZip);

            // Generate the modified EPUB as a Buffer
            const modifiedEpubBuffer = await loadedZip.generateAsync({type: "nodebuffer"});

            // Save the modified EPUB with a new filename
            fs.writeFileSync(outputFilePath, modifiedEpubBuffer);
            console.log(`Modified EPUB saved to: ${outputFilePath}`);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

async function applyStrongTag(loadedZip) {
    for (const fileName in loadedZip.files) {
        if (fileName.endsWith('.xhtml') || fileName.endsWith('.html')) {
            console.log(`Processing file: ${fileName}`);
            const fileContent = await loadedZip.files[fileName].async('string');

            const modifiedContent = enhanceHTML(fileContent);
            loadedZip.file(fileName, modifiedContent);
        }
    }
}

function enhanceHTML(htmlString, contentStyle) {
    try {
        // Parse and enhance the HTML string
        const enhancedHTML = htmlString.replace(/>([^<]+)</g, (match, textContent) => {
            // Process the text content between tags
            const highlightedTextContent = highlightText(textContent, Prefs);
            return `>${highlightedTextContent}<`;

        }).replace(/<head>/, (match) => {
            // Inject dynamic styles for saccades into the head
            return `<head><style>
            [br-mode=on] span strong, [br-mode=on] span span {
                opacity: var(--fixation-edge-opacity, ${Prefs.FIXATION_OPACITY});
            }
            span:not([fixation]) {
                opacity: ${Prefs.NON_FIXATION_OPACITY};
            }
        </style>`;
        }).replace(/<body>/, (match) => {
            // Add the content style to the body tag
            return `<body style="${contentStyle}">`;
        });

        return enhancedHTML;
    } catch (error) {
        console.error(error);
        // Return the original HTML in case of an error
        return htmlString;
    }

    function highlightText(textContent, genericPrefs) {
        return textContent.replace(/\p{L}+/gu, (word) => {
            // Exclude modifying escaped characters

            if (word === 'amp') {
                console.log(word);
                return word;
            } else {
                const {length} = word;
                const brWordStemWidth = length > 3 ? Math.round(length * genericPrefs.BR_WORD_STEM_PERCENTAGE) : length;
                const firstHalf = word.slice(0, brWordStemWidth);
                const secondHalf = word.slice(brWordStemWidth);
                return `<span ${secondHalf.length ? '' : 'fixation="true"'}><strong>${firstHalf}</strong>${secondHalf.length ? `<span>${secondHalf}</span>` : ''}</span>`;
            }
        });
    }


}

const args = process.argv.slice(2);

if (args.length !== 1) {
    console.error("Please provide the path to the EPUB file as a command-line argument.");
} else {
    const epubFilePath = args[0];
    modifyEPUB(epubFilePath);
}
