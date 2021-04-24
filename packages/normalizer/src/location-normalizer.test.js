const { companyConfigs } = require("@remotebear/scraper");
const { getNormalizedLocation } = require("./index");
const mock = require("./location-normalizer.mock.json");

const testTable = [
  ...mock.map(([companyId, output, location]) => [
    [location, companyId],
    output,
  ]),
];

test.each(testTable)("normalizes %p into %p", (input, output) => {
  const job = Array.isArray(input)
    ? { location: input[0], companyId: input[1] }
    : { location: input };
  expect(getNormalizedLocation(job, companyConfigs)).toEqual(output.sort());
});
