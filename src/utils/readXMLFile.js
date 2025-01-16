const path = require('path');
const fss = require('fs/promises');
const cheerio = require('cheerio');

// Utility to read XML file
async function readXMLFile(filePath) {
    const data = await fss.readFile(filePath, 'utf-8');
    return cheerio.load(data, { xmlMode: true, decodeEntities: false });
}


module.exports = readXMLFile;










// const path = require('path');
// const fs = require('fs');
// const cheerio = require('cheerio');

// // Utility to read XML file in chunks
// async function readXMLFile(filePath) {
//     return new Promise((resolve, reject) => {
//         const chunks = [];
//         const stream = fs.createReadStream(filePath, { encoding: 'utf-8' });

//         stream.on('data', (chunk) => {
//             chunks.push(chunk);
//         });

//         stream.on('end', () => {
//             const data = chunks.join('');
//             try {
//                 const $ = cheerio.load(data, { xmlMode: true, decodeEntities: false });
//                 resolve($);
//             } catch (err) {
//                 reject(err);
//             }
//         });

//         stream.on('error', (err) => {
//             reject(err);
//         });
//     });
// }

// module.exports = readXMLFile;
