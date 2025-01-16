
const readXMLFile=require('./readXMLFile');

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
        // console.error(`Error reading DITA file: ${hrefPath}`, error);
        return null;
    }
}

module.exports= getNavTitleFromDITA