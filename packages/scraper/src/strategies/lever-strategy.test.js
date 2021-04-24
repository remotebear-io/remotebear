const { getJobsFromLever } = require("./lever-strategy");
const { input, output } = require("./lever-strategy.mock");

describe("getJobsFromLever", () => {
  test("succeeds", async () => {
    fetch.mockResponseOnce(JSON.stringify(input));
    const result = await getJobsFromLever("1password");
    expect(result).toEqual(output);
  });
});
