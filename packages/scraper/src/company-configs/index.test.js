const companyConfigs = require("./");

const allowedConfigFields = [
  "scrapeJobs",
  "applyPostScrapingCustomizations",
  "getNormalizedLocation",
  "defaultGlobalLocation",
  "extractLocationFromJobDescription", // Just for testing purposes (see toggl.config)
];

Object.entries(companyConfigs).forEach(([companyId, companyConfig]) => {
  test(`the "${companyId}" config exports only valid customization fields`, () => {
    const configFields = Object.keys(companyConfig);
    const invalidConfigFields = configFields.filter(
      (configField) => !allowedConfigFields.includes(configField)
    );
    expect(invalidConfigFields.length).toBe(0);
  });
});
