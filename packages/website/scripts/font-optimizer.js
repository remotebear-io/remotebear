#!/usr/bin/env node

/**
 * Minifies the fonts:
 * - Strips the unused glyphs from the font files.
 * - Converts the fonts to woff and woff2.
 * - Adds/updates the content-hash in the file name of the generated font to
 *   make it immutable for better caching.
 * - Updates the references to the font files (updating the hashes).
 *
 * The minified fonts are put in "/public/fonts/[font-name].min.[hash].[ext]".
 * Remember to run this script each time "assets/strings" is updated.
 */

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const Fontmin = require("fontmin");
const fs = require("fs");
const chalk = require("chalk");
const path = require("path");
const crypto = require("crypto");
const strings = require("../assets/strings.json");

const sourceDir = "assets/fonts";
const destinationDir = "public/fonts";
const filesReferencingFonts = ["styles/globals.css", "components/head.js"];

yargs(hideBin(process.argv))
  .command({
    command: "optimize",
    description: "Optimize fonts",
    handler: optimizeFonts,
  })
  .command({
    command: "validate",
    description: "Validate fonts",
    handler: validateFonts,
  }).argv;

function generateHash(input) {
  return crypto.createHash("md5").update(input).digest("hex").slice(0, 10);
}

function optimizeFonts() {
  // Clean-up the existing font files
  fs.rmdirSync(destinationDir, { recursive: true });
  Object.entries(strings).forEach(([fontName, fontStrings]) => {
    // Get all the unique glyphs
    const fontGlyphs = [...new Set(fontStrings.join(""))].join("");
    // Generate the minified fonts
    new Fontmin()
      .src(`${sourceDir}/${fontName}.ttf`)
      .dest(destinationDir)
      .use(Fontmin.glyph({ text: fontGlyphs }))
      .use(Fontmin.ttf2woff())
      .use(Fontmin.ttf2woff2())
      .run(function (err, files) {
        if (err) throw err;
        files.forEach((file) => {
          // Save the font file (with a content hash in its name)
          const hash = generateHash(fs.readFileSync(file.path));
          const fontExt = path.extname(file.path);
          const updatedFontName = `${fontName}.min.${hash}`;
          fs.renameSync(
            file.path,
            file.path.replace(fontName, updatedFontName)
          );
          console.log(
            `Optimized "${fontName}" into "${updatedFontName}${fontExt}"`
          );
          filesReferencingFonts.forEach((partialFilePath) => {
            // Update all the references of the font file to the new name
            const filePath = path.resolve(process.cwd(), partialFilePath);
            const file = fs.readFileSync(filePath, "utf-8");
            const updatedFile = file.replace(
              new RegExp(
                `${fontName}.min.[a-fA-F0-9]{10}${fontExt}(?=[^a-zA-Z0-9])`,
                "g"
              ),
              `${updatedFontName}${fontExt}`
            );
            fs.writeFileSync(filePath, updatedFile, "utf8");
            console.log(`Updated "${fontName}" references in ${filePath}`);
          });
        });
        console.log(
          `${chalk.green("✔")} "${fontName}" font optimization completed.`
        );
      });
  });
}

function validateFonts() {
  Object.keys(strings).forEach((fontName) => {
    filesReferencingFonts.forEach((partialFilePath) => {
      const filePath = path.resolve(process.cwd(), partialFilePath);
      const file = fs.readFileSync(filePath, "utf-8");
      const [, hashUsedInFile, fontExtUsedInFile] = file.match(
        new RegExp(`${fontName}.min.([^.]+).([\\w]{0,5})`)
      );
      const fontFileName = `${fontName}.min.${hashUsedInFile}.${fontExtUsedInFile}`;
      let fontFile;
      try {
        fontFile = fs.readFileSync(`${destinationDir}/${fontFileName}`);
      } catch (err) {
        console.log("err", err.message);
        console.error(
          `Cannot find "${fontFileName}" referenced in "${partialFilePath}".`
        );
        process.exit(1);
      }
      const expectedHash = generateHash(fontFile);
      if (expectedHash !== hashUsedInFile) {
        console.error(
          `Wrong hash for "${fontFileName}": its hash should be "${expectedHash}".`
        );
        process.exit(1);
      }
    });
  });
  console.log(`${chalk.green("✔")} Font validation succeeded.`);
}
