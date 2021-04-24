function uniq(arr) {
  return [...new Set(arr)];
}

function sanitizeLocation(location) {
  return location
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]+/g, "")
    .replace(/  +/g, " ")
    .trim();
}

function keywordifyLocation(location) {
  const removableKeywords = [
    "or",
    "in",
    "the",
    "east",
    "eastern",
    "west",
    "western",
    "hq",
    "hemisphere",
    "north",
    "only",
    "within",
    "central",
    "coast",
  ];
  return uniq(sanitizeLocation(location).split(" "))
    .filter((keyword) => !removableKeywords.includes(keyword))
    .sort();
}

function locationLooselyMatches(location, cases = []) {
  cases = typeof cases === "string" ? [cases] : cases;
  return cases.map(sanitizeLocation).includes(sanitizeLocation(location));
}

function locationKeywordsLooselyMatch(location, cases = []) {
  cases = typeof cases === "string" ? [cases] : cases;
  const locationKeywords = keywordifyLocation(location);
  return cases.some(
    (x) => keywordifyLocation(x).toString() === locationKeywords.toString()
  );
}

function locationLooselyIncludes(location, cases = []) {
  cases = typeof cases === "string" ? [cases] : cases;
  return cases.some((x) =>
    sanitizeLocation(location).includes(sanitizeLocation(x))
  );
}

function locationLooselyStartsWith(location, cases = []) {
  cases = typeof cases === "string" ? [cases] : cases;
  return cases.some((x) =>
    sanitizeLocation(location).startsWith(sanitizeLocation(x))
  );
}

function locationLooselyEndsWith(location, cases = []) {
  cases = typeof cases === "string" ? [cases] : cases;
  return cases.some((x) =>
    sanitizeLocation(location).endsWith(sanitizeLocation(x))
  );
}

module.exports = {
  uniq,
  sanitizeLocation,
  locationLooselyMatches,
  locationLooselyIncludes,
  locationLooselyStartsWith,
  locationLooselyEndsWith,
  locationKeywordsLooselyMatch,
};
