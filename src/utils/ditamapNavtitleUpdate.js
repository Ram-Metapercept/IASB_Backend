// const fs = require('fs');
// const path = require('path');
// const xml2js = require('xml2js');
// const cheerio = require('cheerio');
// const util = require('util');
// const fss = require('fs').promises;
// const readFileAsync = util.promisify(fs.readFile);


// async function readXMLFile(filePath) {

//     const xmlData = await readFileAsync(filePath, 'utf8');

//     return xmlData
    
// }


// async function writeXMLFile(filePath, xmlObj) {
//     let xmlContent =xmlObj;
//     xmlContent = xmlContent.replace(/^<!--\?xml version="1.0" encoding="UTF-8"\?-->/, '<?xml version="1.0" encoding="UTF-8"?>\n');
//     fs.writeFileSync(filePath, xmlContent, 'utf8');
// }
// async function updateDITAMapWithNavTitles(mapPath) {
//     async function getNavTitleFromDITA(hrefPath) {
//         try {

//             const $ = await readXMLFile1(hrefPath);
//             const navTitle = $('titlealts > navtitle').first().text();
//             if (navTitle) {
//                 return navTitle.replace(/[\r\n\xA0]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
//             }

//             const titleContent = $('title').contents().map(function () {
//                 if (this.type === 'text') {
//                     return $(this).text();
//                 } else if (this.tagName === 'ph') {
//                     return $(this).text();
//                 }
//                 return '';
//             }).get().join(' ').replace(/\s{2,}/g, ' ').trim();

//             if (titleContent) {
//                 return titleContent;
//             }

//             const paraNum = $('paragraph > paranum').first().text();
//             if (paraNum) {
//                 return paraNum;
//             }
//         } catch (error) {
//             console.error(`Error reading DITA file: ${hrefPath}`, error);
//         }
//         return null;
//     }

//     // async function updateNavTitleForTopicRef(topicRef, mapPath) {

//     //     if (topicRef?.$?.href) {
//     //         const hrefPath = path.resolve(path.dirname(mapPath), topicRef.$.href);

//     //         const navTitle = await getNavTitleFromDITA(hrefPath);

//     //         if (navTitle) {
//     //             topicRef.$.navtitle = navTitle;
//     //         }
//     //     }
//     //     if (topicRef.topicref) {
//     //         for (const subTopicRef of topicRef.topicref) {
//     //             await updateNavTitleForTopicRef(subTopicRef, mapPath);
//     //         }
//     //     }
//     // }


//     async function updateNavTitleForTopicRef($topicRef, mapPath) {
//         // Check if the `href` attribute exists
//         const href = $topicRef.attr('href');
//         if (href) {
//             // Resolve the path to the DITA file
//             const hrefPath = path.resolve(path.dirname(mapPath), href);
    
//             // Get the navigation title from the DITA file
//             const navTitle = await getNavTitleFromDITA(hrefPath);
    
//             // Set the `navtitle` attribute if navTitle exists
//             if (navTitle) {
//                 $topicRef.attr('navtitle', navTitle);
//             }
//         }
    
//         // Recursively update nested topic references
//         $topicRef.find('topicref').each(async (_, subTopicRef) => {
//             await updateNavTitleForTopicRef($(subTopicRef), mapPath);
//         });
//     }
//     async function processDITAMap(mapPath) {

//         const ditaMap = await readXMLFile(mapPath);
//         const $ = cheerio.load(ditaMap, { xmlMode: true });
//         $('[chunk]').removeAttr('chunk');

     
//         // const topicRefs = ditaMap?.bookmap?.chapter || [];
//         // for (const topicRef of topicRefs) {
//         //     await updateNavTitleForTopicRef(topicRef, mapPath);
//         // }
//         const topicRefs = $('bookmap > chapter').toArray();

//         for (const topicRef of topicRefs) {
//             await updateNavTitleForTopicRef($(topicRef), mapPath);
//         }

//         await writeXMLFile(mapPath, $.xml());
//     }

//     await processDITAMap(mapPath);
// }

//-----------------------------------------------------


// async function updateDITAMapWithNavTitles(mapPath) {
//     async function getNavTitleFromDITA(hrefPath) {
//         try {
//             const $ = await readXMLFile1(hrefPath);
//             const navTitle = $('titlealts > navtitle').first().text();
//             if (navTitle) {
//                 return navTitle.replace(/[\r\n\xA0]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
//             }

//             const titleContent = $('title').contents().map(function () {
//                 if (this.type === 'text' || this.tagName === 'ph') {
//                     return $(this).text();
//                 }
//                 return '';
//             }).get().join(' ').replace(/\s{2,}/g, ' ').trim();

//             if (titleContent) {
//                 return titleContent;
//             }

//             const paraNum = $('paragraph > paranum').first().text();
//             if (paraNum) {
//                 return paraNum;
//             }
//         } catch (error) {
//             console.error(`Error reading DITA file: ${hrefPath}`, error);
//         }
//         return null;
//     }

//     async function updateNavTitleForTopicRef($, $topicRef, mapPath) {
//         const href = $topicRef.attr('href');
//         if (href) {
//             const hrefPath = path.resolve(path.dirname(mapPath), href);
//             const navTitle = await getNavTitleFromDITA(hrefPath);
//             console.log({navTitle});
//             if (navTitle) {
//                 $topicRef.attr('navtitle', navTitle);
//             }
//         }

//         $topicRef.find('topicref').each(async (_, subTopicRef) => {
//             await updateNavTitleForTopicRef($, $(subTopicRef), mapPath);
//         });
//     }

//     async function processDITAMap(mapPath) {
//         const ditaMap = await readXMLFile(mapPath);
//         const $ = cheerio.load(ditaMap, { xmlMode: true });
//         $('[chunk]').removeAttr('chunk');

//         const topicRefs = $('bookmap > chapter').toArray();
//         for (const topicRef of topicRefs) {
//             await updateNavTitleForTopicRef($, $(topicRef), mapPath);
//         }

//         await writeXMLFile(mapPath, $.xml());
//     }

//     await processDITAMap(mapPath);
// }
















// // Helper function to read XML file using fs
// async function readXMLFile(filePath) {
//     const data = await fss.readFile(filePath, 'utf-8');
//     // const data = await readFileAsync(filePath, 'utf-8');
//     return cheerio.load(data, { xmlMode: true, decodeEntities: false });
// }

// // Helper function to write the modified XML back to file
// async function writeXMLFile(filePath, data) {
//     await fss.writeFile(filePath, data, 'utf-8');
// }

// // Function to get the navtitle from the .dita file
// async function getNavTitleFromDITA(hrefPath) {
//     try {
//         const $ = await readXMLFile(hrefPath);
        
//         // Try to get navtitle from <titlealts>
//         const navTitle = $('titlealts > navtitle').first().text();
//         if (navTitle) {
//             return navTitle.replace(/[\r\n\xA0]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
//         }

//         // If navtitle is not found, try to get it from <title> contents
//         const titleContent = $('title').contents().map(function () {
//             if (this.type === 'text' || this.tagName === 'ph') {
//                 return $(this).text();
//             }
//             return '';
//         }).get().join(' ').replace(/\s{2,}/g, ' ').trim();

//         if (titleContent) {
//             return titleContent;
//         }

//         // If no title or navtitle, fallback to paragraph number
//         const paraNum = $('paragraph > paranum').first().text();
//         if (paraNum) {
//             return paraNum;
//         }
//     } catch (error) {
//         console.error(`Error reading DITA file: ${hrefPath}`, error);
//     }
//     return null;
// }

// // Function to update navtitle for each <topicref> in the DITA map
// async function updateNavTitleForTopicRef($, $topicRef, mapPath) {
//     // Check if the href attribute exists in topicRef
//     const href = $topicRef.attr('href');
//     if (href) {
//         // Resolve the full path to the DITA file
//         const hrefPath = path.resolve(path.dirname(mapPath), href);

//         // Get the navigation title from the DITA file
//         const navTitle = await getNavTitleFromDITA(hrefPath);

//         // If we found a valid navTitle, update the navtitle attribute on topicRef
//         if (navTitle) {
//             $topicRef.attr('navtitle', navTitle);
//         }
  
//     }
//     // Process all sub topicref elements recursively
//     const subTopicRefs = $topicRef.find('topicref');
//     for (const subTopicRef of subTopicRefs.toArray()) {
//         // Await the asynchronous update for each subTopicRef
//         await updateNavTitleForTopicRef($, $(subTopicRef), mapPath);
//     }
// }

// // Main function to process the DITA map
// async function processDITAMap(mapPath) {
//     const $ = await readXMLFile(mapPath);
//     $('[chunk]').removeAttr('chunk');

//     const topicRefs = $('bookmap > chapter').toArray();
//     for (const topicRef of topicRefs) {
//         await updateNavTitleForTopicRef($, $(topicRef), mapPath);
//     }
//     await writeXMLFile(mapPath, $.xml());
// }

// async function updateDITAMapWithNavTitles(mapPath) {
//     try {
//         await processDITAMap(mapPath);
//     } catch (error) {
//         console.error('Error updating DITA map:', error);
//     }
// }
// //------------------------------------------------------------------------------

// async function updateMainDITAMapWithNavTitles(mapPath) {

//     async function readXMLFile(filePath) {
//         const content = await fss.readFile(filePath, 'utf8');
//         return cheerio.load(content, { xmlMode: true, decodeEntities: false });
        
//     }

//     async function writeXMLFile(filePath, $) {
//         const xmlContent = $.xml(); // Generate XML string from Cheerio object
   
//         await fss.writeFile(filePath, xmlContent, 'utf8');
//     }

//     async function getMainBookTitle(hrefPath) {
//         try {
//             const $ = await readXMLFile(hrefPath);
//             const mainTitle = $('booktitle > mainbooktitle').text().trim(); // Extract mainbooktitle text

//             const phElements = $('booktitle > mainbooktitle > ph').map((i, el) => $(el).text()).get();
//             if (phElements.length > 0) {
//                 return phElements.join(' '); // Join <ph> elements if they exist
//             }
//             return mainTitle || null;
//         } catch (error) {
//             console.error(`Error reading bookmap file: ${hrefPath}`, error);
//         }
//         return null;
//     }

//     async function updateNavTitleForMapRef(mapRef, mapPath, $) {
//         const href = $(mapRef).attr('href');
//         if (href) {
//             const hrefPath = path.resolve(path.dirname(mapPath), href);
//             const mainBookTitle = await getMainBookTitle(hrefPath); // Get main book title for mapref

//             if (mainBookTitle) {
//                 $(mapRef).attr('navtitle', mainBookTitle); // Update navtitle
//             }
//         }
//     }

//     async function processDITAMap(mapPath) {
//         const $ = await readXMLFile(mapPath); 
//         const mapRefs = $('mapref'); 

//         await Promise.all(mapRefs.map((i, mapRef) => updateNavTitleForMapRef(mapRef, mapPath, $)).get());
//         await writeXMLFile(mapPath, $); 
//     }

//     await processDITAMap(mapPath);
// }



// module.exports = { updateDITAMapWithNavTitles, updateMainDITAMapWithNavTitles };















const path = require('path');
const fss = require('fs/promises');
const cheerio = require('cheerio');

// Utility to read XML file
async function readXMLFile(filePath) {
    const data = await fss.readFile(filePath, 'utf-8');
    return cheerio.load(data, { xmlMode: true, decodeEntities: false });
}

// Utility to write XML data back to file
async function writeXMLFile(filePath, $) {
    const xmlContent = $.xml();
    await fss.writeFile(filePath, xmlContent, 'utf-8');
}

// Fetch navigation title from a DITA file
async function getNavTitleFromDITA(hrefPath) {
    try {
        const $ = await readXMLFile(hrefPath);
        const navTitle = $('titlealts > navtitle').first().text().trim().replace(/[\r\n\xA0]+/g, ' ').replace(/\s{2,}/g, ' ');

        if (navTitle) return navTitle;

        const titleContent = $('title').contents().filter((_, el) => el.type === 'text' || el.tagName === 'ph')
            .map((_, el) => $(el).text()).get().join(' ').trim().replace(/\s{2,}/g, ' ');
        if (titleContent) return titleContent;

        return $('paragraph > paranum').first().text().trim() || null;
    } catch (error) {
        console.error(`Error reading DITA file: ${hrefPath}`, error);
        return null;
    }
}
async function updateNavTitleForTopicRef($, $topicRef, mapPath) {
    const href = $topicRef.attr('href');
    if (href) {
        const hrefPath = path.resolve(path.dirname(mapPath), href);
        const navTitle = await getNavTitleFromDITA(hrefPath);
        if (navTitle) $topicRef.attr('navtitle', navTitle);
    }
    await Promise.all($topicRef.find('topicref').toArray().map(subTopicRef => updateNavTitleForTopicRef($, $(subTopicRef), mapPath)));
}

// Process and update the DITA map
async function processDITAMap(mapPath) {
    const $ = await readXMLFile(mapPath);
    $('[chunk]').removeAttr('chunk');

    await Promise.all($('bookmap > chapter').toArray().map(topicRef => updateNavTitleForTopicRef($, $(topicRef), mapPath)));
    await writeXMLFile(mapPath, $);
}

// Main function to update nav titles in DITA map
async function updateDITAMapWithNavTitles(mapPath) {
    try {
        await processDITAMap(mapPath);
    } catch (error) {
        console.error('Error updating DITA map:', error);
    }
}

// Fetch the main book title for <mapref>
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

// Update navtitle for each <mapref> in DITA map
async function updateNavTitleForMapRef(mapRef, mapPath, $) {
    const href = $(mapRef).attr('href');
    if (href) {
        const hrefPath = path.resolve(path.dirname(mapPath), href);
        const mainBookTitle = await getMainBookTitle(hrefPath);
        if (mainBookTitle) $(mapRef).attr('navtitle', mainBookTitle);
    }
}

// Process and update DITA map with main book titles
async function processMainDITAMap(mapPath) {
    const $ = await readXMLFile(mapPath);
    const mapRefs = $('mapref');

    await Promise.all(mapRefs.map((_, mapRef) => updateNavTitleForMapRef(mapRef, mapPath, $)).get());
    await writeXMLFile(mapPath, $);
}

// Main function to update main DITA map with nav titles
async function updateMainDITAMapWithNavTitles(mapPath) {
    try {
        await processMainDITAMap(mapPath);
    } catch (error) {
        console.error('Error updating main DITA map:', error);
    }
}

module.exports = { updateDITAMapWithNavTitles, updateMainDITAMapWithNavTitles };
