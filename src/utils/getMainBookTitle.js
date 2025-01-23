

// const readXMLFile=require('./readXMLFile');
// async function getMainBookTitle(hrefPath) {
//     try {
//         const $ = await readXMLFile(hrefPath);
//         const mainTitle = $('booktitle > mainbooktitle').text().trim();
//         const phElements = $('booktitle > mainbooktitle > ph').map((_, el) => $(el).text()).get();
//         return phElements.length > 0 ? phElements.join(' ') : mainTitle || null;
//     } catch (error) {
//         console.error(`Error reading bookmap file: ${hrefPath}`, error);
//         return null;
//     }
// }

// module.exports= getMainBookTitle




const readXMLFile=require('./readXMLFile');
async function getMainBookTitle(hrefPath) {
    try {
        const $ = await readXMLFile(hrefPath);
        const mainTitle = $('booktitle > mainbooktitle').text().trim();
        const phElements = $('booktitle > mainbooktitle > ph').map((_, el) => $(el).text()).get();
        return phElements.length > 0 ? phElements.join(' ') : mainTitle || null;
    } catch (error) {
        console.error(`Error reading bookmap file: ${hrefPath}`, error);
        return null;
    }
}

module.exports= getMainBookTitle



// const readXMLFile = require('./readXMLFile');

// async function getMainBookTitle(hrefPath) {
//     try {
//         // Load the XML file
//         const $ = await readXMLFile(hrefPath);

    
//         // Attempt to extract the main title from booktitle > mainbooktitle
//         const mainTitle = $('booktitle > mainbooktitle').first().text().trim();

//         // Check for <ph> elements within <mainbooktitle> and concatenate their text
//         const phElements = $('booktitle > mainbooktitle > ph')
//             .map((_, el) => $(el).text().trim())
//             .get();

//         // Return concatenated <ph> text if present, otherwise return the main title
//         if (phElements.length > 0) {
//             return phElements.join(' ');
//         }

//         // Fallback to main title or return null if all else fails
//         return mainTitle || null;
//     } catch (error) {
//         console.error(`Error reading bookmap file: ${hrefPath}`, error);
//         return null;
//     }
// }

// module.exports = getMainBookTitle;
