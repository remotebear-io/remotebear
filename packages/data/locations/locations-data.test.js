const Joi = require("joi");
const locationsData = require("./locations-data.json");

const schema = Joi.array().items(
  Joi.object({
    id: Joi.string().required(),
    label: Joi.string().required(),
  })
);

test("satisfies the schema", () => {
  const validationResult = schema.validate(locationsData);
  if (validationResult && validationResult.error) {
    console.error(validationResult.error.details);
  }
  expect(validationResult.error).toBeFalsy();
  expect(validationResult.errors).toBeFalsy();
  expect(validationResult.warning).toBeFalsy();
  expect(validationResult.value).toBeTruthy();
});
