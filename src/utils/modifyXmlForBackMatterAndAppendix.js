const fs = require('fs');
const path = require('path');
const DOMParser = require('xmldom').DOMParser;
const XMLSerializer = require('xmldom').XMLSerializer;

function modifyXmlForBackMatterAndAppendix(xmlStr) {
    const parser = new DOMParser();
    const serializer = new XMLSerializer();

    const xmlDoc = parser.parseFromString(xmlStr, 'application/xml');

    const chapter = xmlDoc.getElementsByTagName('chapter')[0];
    const appendices = xmlDoc.getElementsByTagName('appendices')[0];
    const backmatter = xmlDoc.getElementsByTagName('backmatter')[0];

    if (chapter) {
        if (appendices) {
            const appendix = appendices.getElementsByTagName('appendix')[0];
            if (appendix) {
                const topicrefAppendix = xmlDoc.createElement('topicref');
                topicrefAppendix.setAttribute('href', appendix.getAttribute('href'));
                chapter.appendChild(topicrefAppendix);
            }
            chapter.removeChild(appendices);
        }
        if (backmatter) {
            const backmatterTopicref = backmatter.getElementsByTagName('topicref')[0];
            if (backmatterTopicref) {
                const topicrefBackmatter = xmlDoc.createElement('topicref');
                topicrefBackmatter.setAttribute('href', backmatterTopicref.getAttribute('href'));
                chapter.appendChild(topicrefBackmatter);
            }
            chapter.removeChild(backmatter);
        }
    }


    if (chapter) {
        if (backmatter) {
            const backmatterTopicrefs = backmatter.getElementsByTagName('topicref');

            Array.from(backmatterTopicrefs).forEach((backmatterTopicref) => {
                const importedTopicref = xmlDoc.importNode(backmatterTopicref, true);
                chapter.appendChild(importedTopicref);
            });
            backmatter.parentNode.removeChild(backmatter);
        }
    }

    return serializer.serializeToString(xmlDoc);
}

module.exports = modifyXmlForBackMatterAndAppendix;










