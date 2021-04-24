function validateNormalization({
  jobs,
  allCompanies,
  fieldName,
  getNormalizedValue,
}) {
  const resultsByCompanyId = {};
  allCompanies.forEach((company) => {
    const companyResult = (resultsByCompanyId[company.id] = {});
    companyResult.normalizations = [];
    const companyJobs = jobs.filter((job) => job.companyId === company.id);
    companyResult.jobsCount = companyJobs.length;
    companyJobs.forEach((job) => {
      const existingNormalization = companyResult.normalizations.find(
        (result) => result.input === job[fieldName]
      );
      if (existingNormalization) {
        existingNormalization.jobsCount++;
      } else {
        const output = getNormalizedValue(job);
        companyResult.normalizations.push({
          input: job[fieldName],
          output,
          successful: Array.isArray(output) ? output.length : !!output,
          jobsCount: 1,
        });
      }
    });
    companyResult.successfulJobNormalizationsCount = companyResult.normalizations
      .filter((normalization) => normalization.successful)
      .map((normalization) => normalization.jobsCount)
      .reduce((a, b) => a + b, 0);
    companyResult.successfulJobNormalizationsRate =
      companyResult.successfulJobNormalizationsCount / companyResult.jobsCount;
  });

  const globalResults = {};
  globalResults.jobsCount = Object.values(resultsByCompanyId)
    .map((companyResult) => companyResult.jobsCount)
    .reduce((a, b) => a + b, 0);
  globalResults.successfulJobNormalizationsCount = Object.values(
    resultsByCompanyId
  )
    .map((companyResult) => companyResult.successfulJobNormalizationsCount)
    .reduce((a, b) => a + b, 0);

  return { globalResults, resultsByCompanyId };
}

module.exports = {
  validateNormalization,
};
