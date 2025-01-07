const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

function modifyXmlForBackMatterAndAppendix(xmlStr) {
  const $ = cheerio.load(xmlStr, { xmlMode: true });
  const chapter = $("chapter").first();
  const appendices = $("appendices").first();
  const backmatter = $("backmatter").first();

  if (chapter.length) {
    // Handle Appendices
    if (appendices.length) {
      const appendix = appendices.find("appendix").first();
      if (appendix.length){
        const topicrefAppendix = $("<topicref>");
        // Copy all attributes and content from appendix to topicref
        Object.keys(appendix[0].attribs).forEach((attr) => {
          topicrefAppendix.attr(attr, appendix.attr(attr));
        });
        topicrefAppendix.html(appendix.html());
        chapter.append(topicrefAppendix);
      }
      appendices.remove();
    }

    // Handle Backmatter
    if (backmatter.length) {
      const backmatterTopicref = backmatter.find("topicref").first();
      if (backmatterTopicref.length) {
        const topicrefBackmatter = $("<topicref>");
        // Copy all attributes and content from backmatterTopicref to topicrefBackmatter
        Object.keys(backmatterTopicref[0].attribs).forEach((attr) => {
          topicrefBackmatter.attr(attr, backmatterTopicref.attr(attr));
        });
        topicrefBackmatter.html(backmatterTopicref.html());
        chapter.append(topicrefBackmatter);
      }

      // Move all remaining topicrefs inside backmatter to chapter
      backmatter.find("topicref").each((_, topicref) => {
        const importedTopicref = $(topicref).clone();
        chapter.append(importedTopicref);
      });

      backmatter.remove();
    }
  }

  return $.xml();
}

module.exports = modifyXmlForBackMatterAndAppendix;
