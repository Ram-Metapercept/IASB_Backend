const path = require("path");
const readXMLFile = require("./readXMLFile");
const writeXMLFile = require("./writeXMLFile");
const getNavTitleFromDITA = require("./getNavTitleFromDITA");
const getMainBookTitle = require("./getMainBookTitle");

// async function updateNavTitleForGlossaryTopicRef($, $topicRef, mapPath) {
//   const href = $topicRef.attr("href");

//   if (href) {
//     const hrefPath = path.resolve(path.dirname(mapPath), href);
//     const navTitle = await getNavTitleFromDITA(hrefPath);
//     if (navTitle) $topicRef.attr("navtitle", navTitle);
//   }
//   await Promise.all(
//     $topicRef
//       .find("topicref")
//       .toArray()
//       .map((subTopicRef) =>
//         updateNavTitleForGlossaryTopicRef($, $(subTopicRef), mapPath)
//       )
//   );
// }

// Process and update the DITA map


async function updateNavTitleForGlossaryTopicRef($, $topicRef, mapPath) {
    const href = $topicRef.attr("href");
  
    if (href) {
      const hrefPath = path.resolve(path.dirname(mapPath), href);
      const navTitle = await getNavTitleFromDITA(hrefPath);
      if (navTitle) $topicRef.attr("navtitle", navTitle);
    }
  
    await Promise.all(
      $topicRef
        .find("topicref")
        .toArray()
        .map((subTopicRef) =>
          updateNavTitleForGlossaryTopicRef($, $(subTopicRef), mapPath)
        )
    );
  }
  

//   async function updateNavTitleForTopicRef($, $topicRef, mapPath) {
//     const href = $topicRef.attr("href");
//     if (href) {
//       const hrefPath = path.resolve(path.dirname(mapPath), href);
//       const navTitle = await getNavTitleFromDITA(hrefPath);
//       console.log({navTitle});
//       if (navTitle) $topicRef.attr("navtitle", navTitle);
//     }
//     await Promise.all(
//       $topicRef
//         .find("topicref")
//         .toArray()
//         .map((subTopicRef) =>
//           updateNavTitleForTopicRef($, $(subTopicRef), mapPath)
//         )
//     );
//   }
  

// async function processDITAMap(mapPath) {
//   const $ = await readXMLFile(mapPath);
//   $("[chunk]").removeAttr("chunk");

//   await Promise.all(
//     $("bookmap > chapter")
//       .toArray()
//       .map((topicRef) => updateNavTitleForTopicRef($, $(topicRef), mapPath))
//   );
//   await writeXMLFile(mapPath, $);
// }



async function updateNavTitleForTopicRef($, $topicRef, mapPath) {
    const href = $topicRef.attr("href");
    if (href) {
      const hrefPath = path.resolve(path.dirname(mapPath), href);
      const navTitle = await getNavTitleFromDITA(hrefPath);
      console.log({navTitle});
      if (navTitle) $topicRef.attr("navtitle", navTitle);
    }
  
    // Update nested topicrefs recursively
    await Promise.all(
      $topicRef
        .find("topicref") // Look for child topicrefs within the current topicref
        .toArray()
        .map((subTopicRef) => updateNavTitleForTopicRef($, $(subTopicRef), mapPath))
    );
  }
  
  async function processDITAMap(mapPath) {
    const $ = await readXMLFile(mapPath);
    $("[chunk]").removeAttr("chunk");
  
    // Process each chapter and update navtitle for each topicref within the chapter
    await Promise.all(
      $("bookmap > chapter > topicref") // Directly process topicrefs within chapters
        .toArray()
        .map((topicRef) => updateNavTitleForTopicRef($, $(topicRef), mapPath))
    );
  
    await writeXMLFile(mapPath, $);
  }
  

// async function processGlossaryDITAMap(mapPath) {
//   // Read and parse the XML file
//   const $ = await readXMLFile(mapPath);

//   // Remove the 'chunk' attribute from all elements with the 'chunk' attribute
//   $("[chunk]").removeAttr("chunk");
//   console.log($("bookmap > frontmatter > booklists > glossarylist").toArray());
//   // Process all <glossarylist> elements inside <bookmap><booklists>
//   await Promise.all(
//     $("bookmap > booklists > glossarylist")
//       .toArray()
//       .map((topicRef) =>
//         updateNavTitleForGlosaryTopicRef($, $(topicRef), mapPath)
//       )
//   );

//   // Write the updated XML back to the file
//   await writeXMLFile(mapPath, $);
// }

// Main function to update nav titles in DITA map
// async function processGlossaryDITAMap(mapPath) {
//     // Read and parse the XML file
//     const $ = await readXMLFile(mapPath);
  
//     // Remove the 'chunk' attribute from all elements with the 'chunk' attribute
//     $("[chunk]").removeAttr("chunk");
  
//     const topicRefs = [];
//     $("frontmatter")
//       .find("topicref")
//       .each((index, element) => {
//         const href = $(element).attr("href");
//         if (href) {
//           topicRefs.push(href); // Store each href in the array
//         }
//       });
  
//     await Promise.all(
//       topicRefs.map((topicRef) =>
//         updateNavTitleForGlossaryTopicRef($, topicRef, mapPath) // Corrected the parameters here
//       )
//     );
  
//     // Write the updated XML back to the file
//     await writeXMLFile(mapPath, $);
//   }
  

async function processGlossaryDITAMap(mapPath) {
    // Read and parse the XML file
    const $ = await readXMLFile(mapPath);
  
    // Remove the 'chunk' attribute from all elements with the 'chunk' attribute
    $("[chunk]").removeAttr("chunk");
  
    const topicRefs = [];
    $("frontmatter")
      .find("topicref")
      .each((index, element) => {
        const href = $(element).attr("href");
        if (href) {
          topicRefs.push($(element)); // Store the whole element (not just href)
        }
      });
  
    await Promise.all(
      topicRefs.map(($topicRef) =>
        updateNavTitleForGlossaryTopicRef($, $topicRef, mapPath) // Pass the jQuery object of the element
      )
    );
  
    // Write the updated XML back to the file
    await writeXMLFile(mapPath, $);
  }
  
async function updateDITAMapWithNavTitles(mapPath) {
  try {
    await processDITAMap(mapPath);
    await processGlossaryDITAMap(mapPath);
  } catch (error) {
    console.error("Error updating DITA map:", error);
  }
}

async function updateNavTitleForMapRef(mapRef, mapPath, $) {
    const href = $(mapRef).attr("href");
    if (href) {
      const hrefPath = path.resolve(path.dirname(mapPath), href);
      const mainBookTitle = await getMainBookTitle(hrefPath);
      if (mainBookTitle) {
        $(mapRef).attr("navtitle", mainBookTitle);
      }
    }
  }
  
  // Process and update DITA map with main book titles
  async function processMainDITAMap(mapPath) {
    const $ = await readXMLFile(mapPath);
    const mapRefs = $("mapref");
  
    // Use a for loop with await for better handling of async operations
    for (let i = 0; i < mapRefs.length; i++) {
      const mapRef = mapRefs[i];
      await updateNavTitleForMapRef(mapRef, mapPath, $);
    }
  
    await writeXMLFile(mapPath, $);
  }
// Main function to update main DITA map with nav titles
async function updateMainDITAMapWithNavTitles(mapPath) {
  try {
    await processMainDITAMap(mapPath);
  } catch (error) {
    console.error("Error updating main DITA map:", error);
  }
}

module.exports = { updateDITAMapWithNavTitles, updateMainDITAMapWithNavTitles };
