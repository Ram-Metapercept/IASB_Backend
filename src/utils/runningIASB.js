const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const SaxonJS = require("saxon-js");

async function runningIASB(ditaFiles) {
  const iasbJsonPath = path.resolve(
    __dirname,
    "../../../public/XSLT_Files/IASB.sef.json"
  );
  const testJsonDir = path.dirname(iasbJsonPath);

  if (!fs.existsSync(testJsonDir)) {
    fs.mkdirSync(testJsonDir, { recursive: true });
  }

  try {
    execSync(
      `xslt3 -t -xsl:${path.resolve(
        __dirname,
        "../../public/XSLT_Files/IASB.xsl"
      )} -export:${iasbJsonPath} -nogo`
    );
  } catch (error) {
    throw new Error(`XSLT transformation failed: ${error.message}`);
  }

  if (!fs.existsSync(iasbJsonPath)) {
    throw new Error(
      "XSLT transformation failed to create the required JSON files."
    );
  }
  for (const ditaInput of ditaFiles) {
    const abso = path.resolve(ditaInput);

    try {
      const tagResult = SaxonJS.transform({
        stylesheetFileName: iasbJsonPath,
        sourceFileName: abso,
        destination: "serialized",
      }).principalResult;
      fs.writeFileSync(abso, tagResult, "utf8");
    } catch (error) {
      console.error(`Failed to transform file ${ditaInput}: ${error.message}`);
    }
  }
}

module.exports = runningIASB;
