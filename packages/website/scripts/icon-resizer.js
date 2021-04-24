#!/usr/bin/env node
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const path = require("path");
const sharp = require("sharp");
const { allCompanies } = require("@remotebear/data-api");

const faviconPath = path.resolve(__dirname, "../public/company-favicons/");
const logoPath = path.resolve(__dirname, "../public/company-logos/");

const argv = yargs(hideBin(process.argv))
  .option("company-id", {
    type: "string",
    description: "Run only for a specific company",
  })
  .option("limit", {
    type: "number",
    description: "Run only on the first n companies",
  }).argv;

const { companyId, limit } = argv;

(async function run() {
  let companies = allCompanies;
  if (companyId) {
    companies = [companies.find((company) => company.id === companyId)];
  }
  if (limit) {
    companies = companies.slice(0, limit);
  }

  await Promise.all(
    companies.map(async (company) => {
      try {
        await sharp(`${faviconPath}/${company.id}.png`)
          .png()
          .resize(32)
          .toFile(`${faviconPath}/raw/${company.id}.png`);
        await sharp(`${logoPath}/${company.id}.png`)
          .png()
          .resize(144)
          .toFile(`${logoPath}/raw/${company.id}.png`);
        console.log(`Icons of "${company.id}" resized successfully.`);
      } catch (err) {
        console.error(
          `Couldn't resize icons of "${company.id}": ${err.message}`
        );
      }
    })
  );
})();
