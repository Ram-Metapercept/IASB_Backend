const { updateDITAMapWithNavTitles, updateMainDITAMapWithNavTitles } = require('../utils/ditamapNavtitleUpdate.js');



const updateDITAMaps = async (filePath) => {
    try {
        await Promise.all([
            updateDITAMapWithNavTitles(filePath),
            updateMainDITAMapWithNavTitles(filePath),
        ]);
    } catch (error) {
        console.error(`Error updating DITA maps for file (${filePath}): ${error.message}`);
        throw new Error(`Failed to update DITA maps for file: ${filePath}`);
    }
};

module.exports = updateDITAMaps