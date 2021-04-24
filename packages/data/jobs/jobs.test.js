const Joi = require("joi");
const jobsData = require("./jobs-data.json");
const companiesData = require("../companies/companies-data.json");
const locationsData = require("../locations/locations-data.json");
const departmentsData = require("../departments/departments-data.json");

const schema = Joi.array().items(
  Joi.object({
    companyId: Joi.string().valid(
      ...companiesData.map((company) => company.id)
    ),
    department: Joi.any(),
    url: Joi.string().uri().required(),
    id: Joi.string().required(),
    location: Joi.string().required(),
    normalizedLocation: Joi.array()
      .optional()
      .items(
        Joi.string().valid(...locationsData.map((location) => location.id))
      ),
    normalizedDepartment: Joi.optional().valid(
      ...departmentsData.map((department) => department.id)
    ),
    title: Joi.string().required(),
    createdAt: Joi.date().timestamp().required(),
    _id: Joi.any(),
    _updatedAt: Joi.any(),
  })
);

test("satisfies the schema", () => {
  const validationResult = schema.validate(jobsData);
  if (validationResult && validationResult.error) {
    console.error(validationResult.error.details);
  }
  expect(validationResult.error).toBeFalsy();
  expect(validationResult.errors).toBeFalsy();
  expect(validationResult.warning).toBeFalsy();
  expect(validationResult.value).toBeTruthy();
});
