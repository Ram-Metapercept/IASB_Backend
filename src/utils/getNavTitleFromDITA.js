const readXMLFile = require("./readXMLFile");

async function getNavTitleFromDITA(hrefPath) {
  try {
    const $ = await readXMLFile(hrefPath);
    const navTitle = $("titlealts > navtitle")
      .first()
      .text()
      .trim()
      .replace(/[\r\n\xA0]+/g, " ")
      .replace(/\s{2,}/g, " ");
    if (navTitle) return navTitle;
    const titleContent = $("title")
    .contents()
    .filter((_, el) => el.type === "text" || el.tagName === "ph")
    .map((_, el) => {
      // Check if the element is a 'ph' tag
      if (el.tagName === "ph") {
        return $(el).text().trim(); // Extract and trim 'ph' tag text
      }
      return $(el).text(); // Extract text directly
    })
    .get()
    .join("")
    .trim()
    .replace(/\s{2,}/g, " "); // Normalize spaces
  
  if (titleContent) return titleContent;
  

    const glossEntry = $("glossentry");
    if (glossEntry.length > 0) {
      const glossTerm = glossEntry.find("glossterm").first().text().trim();
      if (glossTerm) return glossTerm;
    }

    return $("paragraph > paranum").first().text().trim() || null;
  } catch (error) {
    // console.error(`Error reading DITA file: ${hrefPath}`, error);
    return null;
  }
}

module.exports = getNavTitleFromDITA;
