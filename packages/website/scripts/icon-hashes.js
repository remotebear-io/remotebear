#!/usr/bin/env node

/**
 * Refresh the icon file names by updating their content-hash.
 * This should be ran every time a company logo/favicon is updated.
 */

const yargs = require("yargs");
const chalk = require("chalk");
const { hideBin } = require("yargs/helpers");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const { allCompanies } = require("@remotebear/data-api");

const iconDirNames = ["company-favicons", "company-logos"];

function generateHash(input) {
  return crypto.createHash("md5").update(input).digest("hex").slice(0, 10);
}

function findHashedFile(allFiles, id, extension = "png") {
  const expectedNameRegExp = new RegExp(`^${id}.[a-fA-F0-9]{10}.${extension}$`);
  return allFiles.find((filename) => expectedNameRegExp.test(filename));
}

function refreshIconHashes(dir) {
  if (!fs.existsSync(dir)) {
    throw new Error(`${dir} does not exist`);
  }
  const files = fs.readdirSync(dir);
  allCompanies.forEach((company) => {
    const oldIconName =
      findHashedFile(files, company.id) ||
      // also look for files without hashes
      files.find((filename) => filename === `${company.id}.png`);
    if (!oldIconName) {
      console.error(`${chalk.red(`⚠ ${company.id} → Icon not found`)}`);
      return;
    }
    const oldIconPath = path.resolve(dir, oldIconName);
    const hash = generateHash(fs.readFileSync(oldIconPath));
    const newIconName = `${company.id}.${hash}.png`;
    const newIconPath = path.resolve(dir, newIconName);
    fs.renameSync(oldIconPath, newIconPath);
    if (oldIconName !== newIconName) {
      console.log(`${chalk.green(`✔`)} ${oldIconName} → ${newIconName}`);
    }
  });
  console.log("Refresh completed.");
}

function validateIconHashes(dir) {
  if (!fs.existsSync(dir)) {
    throw new Error(`${dir} does not exist`);
  }
  const files = fs.readdirSync(dir);
  allCompanies.forEach((company) => {
    const fileName = findHashedFile(files, company.id);
    if (!fileName) {
      console.error(
        chalk.red(`Couldn't find an hashed file for "${company.id}" in ${dir}.`)
      );
      process.exit(0);
    }
    const hash = fileName.match(/\.([^.]+)\./)[1];
    const filePath = path.resolve(dir, fileName);
    const expectedHash = generateHash(fs.readFileSync(filePath));
    if (hash !== expectedHash) {
      console.error(
        `Wrong hash for "${fileName}": its hash should be "${expectedHash}".`
      );
      process.exit(1);
    }
  });
  console.log("Validation succeeded.");
}

function refreshIconHashesHandler() {
  iconDirNames.forEach((dirName) => {
    const dir = path.resolve(__dirname, "../public", dirName);
    console.log(`Updating "${dir}" icons...`);
    refreshIconHashes(dir);
    console.log("");
  });
}

function validateIconHashesHandler() {
  iconDirNames.forEach((dirName) => {
    const dir = path.resolve(__dirname, "../public", dirName);
    console.log(`Validating "${dir}" icon hashes...`);
    validateIconHashes(dir);
    console.log("");
  });
}

yargs(hideBin(process.argv))
  .command({
    command: "refresh",
    description: "Update icon hashes",
    handler: refreshIconHashesHandler,
  })
  .command({
    command: "validate",
    description: "validate icon hashes",
    handler: validateIconHashesHandler,
  }).argv;

module.exports = {
  refreshIconHashes,
  validateIconHashes,
};
