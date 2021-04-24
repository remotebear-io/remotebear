const { getTempCompanyJobs } = require("@remotebear/data-api");
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { companyId } = yargs(hideBin(process.argv)).option("company-id", {
  type: "string",
  description: "Company ID",
  demandOption: true,
}).argv;

function uniqueByLocation(arr) {
  return arr.filter((item, index, self) => {
    return index === self.findIndex((t) => t.location === item.location);
  });
}

(function printLocationsForTestFile() {
  console.log(
    JSON.stringify(
      uniqueByLocation(getTempCompanyJobs(companyId))
        .map((x) => [x.companyId, x.normalizedLocation, x.location])
        .sort((a, b) => (a[1].toString() > b[1].toString() ? 1 : -1))
    )
  );
})();
