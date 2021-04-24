const { getJobsFromGreenhouse } = require("./greenhouse-strategy");
const { input, output } = require("./greenhouse-strategy.mock");

describe("getJobsFromGreenhouse", () => {
  test("succeeds", async () => {
    fetch.mockResponseOnce(JSON.stringify(input));
    const result = await getJobsFromGreenhouse("netlify");
    expect(result).toEqual(output);
  });
});
