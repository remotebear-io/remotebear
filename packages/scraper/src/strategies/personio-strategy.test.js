const { getJobsFromPersonio } = require("./personio-strategy");
const { input, output } = require("./personio-strategy.mock");

describe("getJobsFromPersonio", () => {
  test("succeeds", async () => {
    fetch.mockResponseOnce(JSON.stringify(input));
    const result = await getJobsFromPersonio(2, "stylight");
    expect(result).toEqual(output);
  });
});
