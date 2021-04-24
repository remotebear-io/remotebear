#!/usr/bin/env node
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const fs = require("fs");
const path = require("path");
const request = require("request");
const sharp = require("sharp");
const { allCompanies } = require("@remotebear/data-api");

const faviconOutputPath = path.resolve(
  __dirname,
  "../public/company-favicons/"
);
const logoOutputPath = path.resolve(__dirname, "../public/company-logos/");

const argv = yargs(hideBin(process.argv))
  .option("company-id", {
    type: "string",
    description: "Run only for a specific company",
  })
  .option("limit", {
    type: "number",
    description: "Run only on the first n companies",
  })
  .option("override-existing", {
    type: "boolean",
    description: "Override companies with existing icon?",
  }).argv;

const { companyId, limit, overrideExisting } = argv;

async function fetchFavicon(url, size) {
  const prefixLessUrl = new URL(url || "").hostname;
  let iconUrl = `https://api.faviconkit.com/${prefixLessUrl}`;
  if (size) {
    iconUrl = `${iconUrl}/${size}`;
  }
  return new Promise((resolve, reject) => {
    request({ url: iconUrl, encoding: null }, (e, res, body) => {
      if (e) {
        return reject(e);
      } else if (200 <= res.statusCode && res.statusCode < 300) {
        return resolve(body);
      } else {
        return reject(
          new Error(`Unexpected response status ${res.statusCode}`)
        );
      }
    });
  });
}

(async function run() {
  let companies = allCompanies;
  if (companyId) {
    companies = [companies.find((company) => company.id === companyId)];
  }
  if (!overrideExisting) {
    companies = companies.filter(
      (company) =>
        !fs.existsSync(`${faviconOutputPath}/${company.id}.png`) &&
        !fs.existsSync(`${logoOutputPath}/${company.id}.png`)
    );
  }
  if (limit) {
    companies = companies.slice(0, limit);
  }

  await Promise.all(
    companies.map(async (company) => {
      try {
        const faviconData32 = await fetchFavicon(company.url);
        await sharp(faviconData32)
          .png()
          .resize(32)
          .toFile(`${faviconOutputPath}/${company.id}.png`);
        const faviconData144 = await fetchFavicon(company.url, 144);
        await sharp(faviconData144)
          .png()
          .resize(144)
          .toFile(`${logoOutputPath}/${company.id}.png`);
        console.log(`Icons of "${company.id}" downloaded successfully.`);
      } catch (err) {
        console.error(
          `Couldn't download icons of "${company.id}": ${err.message}`
        );
      }
    })
  );
})();
