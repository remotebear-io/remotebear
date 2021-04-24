const Joi = require("joi");
const companiesData = require("./companies-data.json");

const schema = Joi.array().items(
  Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    url: Joi.string().uri().required(),
    status: Joi.string().valid("enabled", "disabled"),
    scrapingStrategy: Joi.valid(
      "greenhouse",
      "lever",
      "workable",
      "workday",
      "recruitee",
      "personio",
      "smartrecruiters",
      "custom"
    ),
    scrapingConfig: Joi.object({
      id: Joi.string().required(),
      version: Joi.number(),
      url: Joi.string().uri(),
    }),
    crunchbaseConfig: Joi.object({
      id: Joi.string().required(),
    }),
    crunchbaseMeta: Joi.object({
      description: Joi.string(),
      ipo: Joi.string(),
      numberOfEmployesEnum: Joi.string(),
      foundedOn: Joi.string(),
    }),
    createdAt: Joi.number(),
  })
);

test("satisfies the schema", () => {
  const validationResult = schema.validate(companiesData);
  if (validationResult && validationResult.error) {
    console.error(validationResult.error.details);
  }
  expect(validationResult.error).toBeFalsy();
  expect(validationResult.errors).toBeFalsy();
  expect(validationResult.warning).toBeFalsy();
  expect(validationResult.value).toBeTruthy();
});
