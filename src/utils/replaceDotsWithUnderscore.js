// const replaceDotsWithUnderscore = async (content) => {

//     return content.replace(/id="([^"]*)"/g, (match, p1) => {
//         return `id="${p1.replace(/\./g, '_')}"`;
//     }).replace(/href="([^"]*)"/g, (match, p1) => {

//         const parts = p1.split('/');

//         let filePart = parts.pop();

//         let [fileNameWithAnchor, anchor] = filePart.split('#');

//         const lastDotIndex = fileNameWithAnchor.lastIndexOf('.');

//         if (lastDotIndex !== -1) {
//             const fileName = fileNameWithAnchor.substring(0, lastDotIndex);

//             const ext = fileNameWithAnchor.substring(lastDotIndex);

//             if (ext === '.dita' || ext === '.ditamap' || ext === '.pdf' || ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.html') {
//                 fileNameWithAnchor = fileName.replace(/\./g, '_') + ext;
//             } else {
//                 fileNameWithAnchor = fileNameWithAnchor.replace(/\./g, '_');
//             }

//         } else {
//             fileNameWithAnchor = fileNameWithAnchor.replace(/\./g, '_');
//         }

//         filePart = anchor ? `${fileNameWithAnchor}#${anchor.replace(/\./g, '_')}` : fileNameWithAnchor;

//         const modifiedParts = parts.map((part, index) => {
//             if (index === 0 && part === "..") {
//                 return part;
//             }

//             return part.replace(/\./g, '_').replace(/_dita/g, '.dita');
//         });

//         modifiedParts.push(filePart);

//         return `href="${modifiedParts.join('/')}"`;
//     });
// };

// module.exports=replaceDotsWithUnderscore

const replaceDotsWithUnderscore = async (content) => {
  // Replace `id` attributes
  content = content.replace(/id="([^"]*)"/g, (match, p1) => {
    return `id="${p1.replace(/\./g, "_")}"`;
  });
  // Replace `href` attributes
  content = content.replace(/href="([^"]*)"/g, (match, p1) => {
    const parts = p1.split("/");
    let filePart = parts.pop();

    // Split file part into filename and anchor (if exists)
    let [fileNameWithAnchor, anchor] = filePart.split("#");
    const lastDotIndex = fileNameWithAnchor.lastIndexOf(".");

    // Handle the filename replacement logic
    if (lastDotIndex !== -1) {
      const fileName = fileNameWithAnchor.substring(0, lastDotIndex);
      const ext = fileNameWithAnchor.substring(lastDotIndex);

      // Check and process specific extensions
      if (
        [
          ".dita",
          ".ditamap",
          ".pdf",
          ".jpg",
          ".jpeg",
          ".png",
          ".html",
        ].includes(ext)
      ) {
        fileNameWithAnchor = fileName.replace(/\./g, "_") + ext;
      } else {
        fileNameWithAnchor = fileNameWithAnchor.replace(/\./g, "_");
      }
    } else {
      fileNameWithAnchor = fileNameWithAnchor.replace(/\./g, "_");
    }

    // Append anchor (if exists) and replace dots
    filePart = anchor
      ? `${fileNameWithAnchor}#${anchor.replace(/\./g, "_")}`
      : fileNameWithAnchor;

    // Process the path parts
    const modifiedParts = parts.map((part, index) => {
      // Retain ".." for relative paths
      if (index === 0 && part === "..") {
        return part;
      }

      // Replace dots and handle "_dita" conversion
      return part.replace(/\./g, "_").replace(/_dita/g, ".dita");
    });

    // Rebuild the `href` attribute value
    modifiedParts.push(filePart);

    return `href="${modifiedParts.join("/")}"`;
  });

  return content;
};

// const cheerio = require('cheerio');

// const replaceDotsWithUnderscore = async (content) => {
//     // Load the HTML content into Cheerio
//     const $ = cheerio.load(content);

//     // Replace `id` attributes
//     $('[id]').each((_, elem) => {
//         const id = $(elem).attr('id');
//         if (id) {
//             $(elem).attr('id', id.replace(/\./g, '_'));
//         }
//     });

//     // Replace `href` attributes
//     $('[href]').each((_, elem) => {
//         let href = $(elem).attr('href');
//         if (href) {
//             const parts = href.split('/');
//             let filePart = parts.pop();

//             // Split file part into filename and anchor (if exists)
//             let [fileNameWithAnchor, anchor] = filePart.split('#');
//             const lastDotIndex = fileNameWithAnchor.lastIndexOf('.');

//             // Handle the filename replacement logic
//             if (lastDotIndex !== -1) {
//                 const fileName = fileNameWithAnchor.substring(0, lastDotIndex);
//                 const ext = fileNameWithAnchor.substring(lastDotIndex);

//                 // Check and process specific extensions
//                 if (['.dita', '.ditamap', '.pdf', '.jpg', '.jpeg', '.png', '.html'].includes(ext)) {
//                     fileNameWithAnchor = fileName.replace(/\./g, '_') + ext;
//                 } else {
//                     fileNameWithAnchor = fileNameWithAnchor.replace(/\./g, '_');
//                 }
//             } else {
//                 fileNameWithAnchor = fileNameWithAnchor.replace(/\./g, '_');
//             }

//             // Append anchor (if exists) and replace dots
//             filePart = anchor ? `${fileNameWithAnchor}#${anchor.replace(/\./g, '_')}` : fileNameWithAnchor;

//             // Process the path parts
//             const modifiedParts = parts.map((part, index) => {
//                 // Retain ".." for relative paths
//                 if (index === 0 && part === "..") {
//                     return part;
//                 }

//                 // Replace dots and handle "_dita" conversion
//                 return part.replace(/\./g, '_').replace(/_dita/g, '.dita');
//             });

//             // Rebuild the `href` attribute value
//             modifiedParts.push(filePart);
//             $(elem).attr('href', modifiedParts.join('/'));
//         }
//     });

//     // Return the modified HTML
//     return $.html();
// };

module.exports = replaceDotsWithUnderscore;
