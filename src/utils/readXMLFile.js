const path = require('path');
const fss = require('fs/promises');
const cheerio = require('cheerio');

// Utility to read XML file
async function readXMLFile(filePath) {
    const data = await fss.readFile(filePath, 'utf-8');
    return cheerio.load(data, { xmlMode: true, decodeEntities: false });
}


module.exports = readXMLFile;








