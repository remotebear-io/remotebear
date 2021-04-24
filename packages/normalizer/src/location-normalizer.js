const { locationIds, allLocationPatterns } = require("@remotebear/data-api");
const {
  uniq,
  locationLooselyMatches,
  locationLooselyStartsWith,
  locationLooselyEndsWith,
  locationKeywordsLooselyMatch,
} = require("./utils");

function sanitizeNormalizedLocation(normalizedLocation) {
  return uniq(normalizedLocation).sort();
}

function getNormalizedLocation(job, companyConfigs) {
  const { location } = job;
  let normalizedLocation = [];

  // Try to get the normalized location based on the company customizations
  const companyConfig = companyConfigs && companyConfigs[job.companyId];
  if (companyConfig && companyConfig.getNormalizedLocation) {
    normalizedLocation = companyConfig.getNormalizedLocation(job);
    if (normalizedLocation.length) {
      return sanitizeNormalizedLocation(normalizedLocation);
    }
  }

  // Try to get the normalized location based on the location patterns
  const patternTypesToFuncs = [
    { type: "match", func: locationLooselyMatches },
    { type: "starts-with", func: locationLooselyStartsWith },
    { type: "ends-with", func: locationLooselyEndsWith },
    { type: "keywords", func: locationKeywordsLooselyMatch },
  ];
  for (const { type, func } of patternTypesToFuncs) {
    const matchedPattern = allLocationPatterns
      .filter((x) => x.type === type)
      .find((x) => func(location, x.pattern));
    if (matchedPattern) {
      normalizedLocation = sanitizeNormalizedLocation(
        matchedPattern.locationIds
      );
      break;
    }
  }

  // If global or not found, default to "companyConfig.defaultGlobalLocation"
  if (
    !normalizedLocation.length ||
    (normalizedLocation.length === 1 &&
      normalizedLocation[0] === locationIds.global)
  ) {
    if (companyConfig && companyConfig.defaultGlobalLocation) {
      normalizedLocation = [companyConfig.defaultGlobalLocation];
    }
  }

  return sanitizeNormalizedLocation(normalizedLocation);
}

module.exports = {
  locationIds,
  getNormalizedLocation,
};
