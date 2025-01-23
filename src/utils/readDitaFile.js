const { readFile} = require('fs/promises');
const readDitaFile = async (filePath) => {
    try {
        return await readFile(filePath, 'utf8');
    } catch (error) {
        throw new Error(`Failed to process DITA file: ${filePath}`);
    }
};

module.exports = readDitaFile


// const { createReadStream } = require('fs');

// const readDitaFile = async (filePath) => {
//     return new Promise((resolve, reject) => {
//         const chunks = [];
//         const stream = createReadStream(filePath, { encoding: 'utf8' });

//         stream.on('data', (chunk) => {
//             chunks.push(chunk);
//         });

//         stream.on('end', () => {
//             resolve(chunks.join(''));
//         });

//         stream.on('error', (error) => {
//             reject(new Error(`Failed to process DITA file: ${filePath}. Error: ${error.message}`));
//         });
//     });
// };

// module.exports = readDitaFile;
