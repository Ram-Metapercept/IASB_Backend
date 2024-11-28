const AdmZip = require('adm-zip');


const createZipFromDirectory = async (directoryPath, zipFilePath) => {
    try {
        const zip = new AdmZip();
        zip.addLocalFolder(directoryPath);
        zip.writeZip(zipFilePath);
        console.log(`ZIP file created successfully at ${zipFilePath}`);
    } catch (error) {
        console.error(`Error creating ZIP file: ${error.message}`);
        throw new Error('Failed to create ZIP file.');
    }
};

module.exports = createZipFromDirectory
