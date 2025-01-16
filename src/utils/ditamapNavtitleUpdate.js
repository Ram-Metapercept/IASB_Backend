// const path = require('path');
// const readXMLFile=require('./readXMLFile');
// const writeXMLFile=require('./writeXMLFile');
// const getNavTitleFromDITA=require('./getNavTitleFromDITA');
// const getMainBookTitle=require('./getMainBookTitle');
// async function updateNavTitleForTopicRef($, $topicRef, mapPath) {
//     const href = $topicRef.attr('href');
//     if (href) {
//         const hrefPath = path.resolve(path.dirname(mapPath), href);
//         const navTitle = await getNavTitleFromDITA(hrefPath);
//         if (navTitle) $topicRef.attr('navtitle', navTitle);
//     }
//     await Promise.all($topicRef.find('topicref').toArray().map(subTopicRef => updateNavTitleForTopicRef($, $(subTopicRef), mapPath)));
// }

// // Process and update the DITA map
// async function processDITAMap(mapPath) {
//     const $ = await readXMLFile(mapPath);
//     $('[chunk]').removeAttr('chunk');

//     Promise.all($('bookmap > chapter').toArray().map(topicRef => updateNavTitleForTopicRef($, $(topicRef), mapPath)));
//     await writeXMLFile(mapPath, $);
// }

// // Main function to update nav titles in DITA map
// async function updateDITAMapWithNavTitles(mapPath) {
//     try {
//         await processDITAMap(mapPath);
//     } catch (error) {
//         console.error('Error updating DITA map:', error);
//     }
// }



// // Update navtitle for each <mapref> in DITA map
// async function updateNavTitleForMapRef(mapRef, mapPath, $) {
//     const href = $(mapRef).attr('href');
//     if (href) {
//         const hrefPath = path.resolve(path.dirname(mapPath), href);
//         const mainBookTitle = await getMainBookTitle(hrefPath);
//         if (mainBookTitle) $(mapRef).attr('navtitle', mainBookTitle);
//     }
// }

// // Process and update DITA map with main book titles
// // async function processMainDITAMap(mapPath) {
// //     const $ = await readXMLFile(mapPath);
// //     const mapRefs = $('mapref');

// //     await Promise.all(mapRefs.map((_, mapRef) => updateNavTitleForMapRef(mapRef, mapPath, $)).get());
  
// // }

// async function processMainDITAMap(mapPath) {
//     const $ = await readXMLFile(mapPath);
//     const mapRefs = $('mapref');

// Promise.all(mapRefs.map((_, mapRef) => updateNavTitleForMapRef(mapRef, mapPath, $)).get());
// await writeXMLFile(mapPath, $);
// }


// // Main function to update main DITA map with nav titles
// async function updateMainDITAMapWithNavTitles(mapPath) {
//     try {
//         await processMainDITAMap(mapPath);
//     } catch (error) {
//         console.error('Error updating main DITA map:', error);
//     }
// }

// module.exports = { updateDITAMapWithNavTitles, updateMainDITAMapWithNavTitles };






const path = require('path');
const readXMLFile=require('./readXMLFile');
const writeXMLFile=require('./writeXMLFile');
const getNavTitleFromDITA=require('./getNavTitleFromDITA');
const getMainBookTitle=require('./getMainBookTitle');
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
