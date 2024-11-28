const { readFile} = require('fs/promises');

const readDitaFile = async (filePath) => {
    try {
        return await readFile(filePath, 'utf8');
    } catch (error) {
        console.error(`Error reading DITA file (${filePath}): ${error.message}`);
        throw new Error(`Failed to process DITA file: ${filePath}`);
    }
};

module.exports = readDitaFile