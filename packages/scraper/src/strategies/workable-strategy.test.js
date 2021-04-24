const { getJobsFromWorkable } = require("./workable-strategy");
const { input, output } = require("./workable-strategy.mock");

describe("getJobsFromWorkable", () => {
  test("succeeds", async () => {
    fetch.mockResponseOnce(JSON.stringify(input));
    const result = await getJobsFromWorkable("doist");
    expect(result).toEqual(output);
  });
});
