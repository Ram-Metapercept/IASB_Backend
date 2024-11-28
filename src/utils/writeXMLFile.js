const fss = require('fs/promises');


async function writeXMLFile(filePath, $) {
    const xmlContent = $.xml();
    await fss.writeFile(filePath, xmlContent, 'utf-8');
}


module.exports = writeXMLFile
