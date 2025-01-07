

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

