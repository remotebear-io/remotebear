const departmentNormalizer = require("./department-normalizer");
const locationNormalizer = require("./location-normalizer");
const normalizationValidator = require("./normalization-validator");
const utils = require("./utils");

module.exports = {
  ...departmentNormalizer,
  ...locationNormalizer,
  ...normalizationValidator,
  ...utils,
};
