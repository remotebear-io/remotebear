const chalk = require("chalk");
const { allJobs } = require("@remotebear/data-api");
const { allCompanies } = require("@remotebear/data-api");
const {
  validateNormalization,
  getNormalizedLocation,
  getNormalizedDepartment,
} = require("@remotebear/normalizer");
const { hideBin } = require("yargs/helpers");
const yargs = require("yargs");

const { onlyMissing, companyId } = yargs(hideBin(process.argv))
  .option("company-id", {
    type: "string",
    description: "Run only for a specific company",
  })
  .option("only-missing", {
    type: "boolean",
    description: "Show only invalid normalizations",
  }).argv;

(function checkNormalizations({ type = "location" }) {
  const { globalResults, resultsByCompanyId } = validateNormalization({
    jobs: companyId
      ? allJobs.filter((x) => x.companyId === companyId)
      : allJobs,
    allCompanies: allCompanies.filter((x) => x.status !== "disabled"),
    getNormalizedValue:
      type === "location" ? getNormalizedLocation : getNormalizedDepartment,
    fieldName: type,
  });

  Object.entries(resultsByCompanyId)
    .filter(([, companyResult]) =>
      onlyMissing
        ? companyResult.jobsCount > 0 &&
          companyResult.successfulJobNormalizationsCount <
            companyResult.jobsCount
        : true
    )
    .forEach(([companyId, companyResult]) => {
      const company = allCompanies.find((company) => companyId === company.id);
      console.log(chalk.bold.magenta(`» ${company.name}`));
      companyResult.normalizations
        .filter((normalization) =>
          onlyMissing ? !normalization.successful : true
        )
        .forEach((normalization) => {
          const symbol = normalization.successful
            ? chalk.green("✓")
            : chalk.red("x");
          const prettyOutput =
            (Array.isArray(normalization.output)
              ? normalization.output.join(", ")
              : normalization.output) || "not found";
          console.log(
            `- ${symbol} ${chalk.bold(
              normalization.input
            )} → ${prettyOutput} (${normalization.jobsCount} jobs)`
          );
        });
      const successPercentage = parseFloat(
        (companyResult.successfulJobNormalizationsCount /
          companyResult.jobsCount) *
          100 || 0
      ).toFixed(2);
      console.log(
        `${successPercentage}% of ${company.name} job locations have been normalized successfully.\n`
      );
    });

  const globalSuccessPercentage = parseFloat(
    (globalResults.successfulJobNormalizationsCount / globalResults.jobsCount) *
      100
  ).toFixed(2);
  console.log(
    chalk.bold(
      `${globalSuccessPercentage}% of all job location have been matched successfully (${globalResults.successfulJobNormalizationsCount} out of ${globalResults.jobsCount}).\n`
    )
  );
})();
