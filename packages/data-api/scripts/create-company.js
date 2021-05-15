const { createCompany } = require("@remotebear/data-api");
const { hideBin } = require("yargs/helpers");
const yargs = require("yargs");

const { id, name, url, scrapingStrategy, crunchbaseId } = yargs(
  hideBin(process.argv)
)
  .option("id", {
    type: "string",
    description: "Company ID",
    demandOption: true,
  })
  .option("name", {
    type: "string",
    description: "Company name",
    demandOption: true,
  })
  .option("url", {
    type: "string",
    description: "Company website URL",
    demandOption: true,
  })
  .option("scraping-strategy", {
    type: "string",
    description: "Scraping strategy",
    demandOption: true,
  })
  .option("crunchbase-id", {
    type: "string",
    description: "Crunchbase ID (defaults to company ID)",
  }).argv;

createCompany({
  id,
  name,
  url,
  scrapingStrategy: { id: scrapingStrategy },
  crunchbaseConfig: { id: crunchbaseId },
});
