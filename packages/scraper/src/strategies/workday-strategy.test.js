const { getJobsFromWorkday } = require("./workday-strategy");
const { input, output } = require("./workday-strategy.mock");

describe("getJobsFromWorkday", () => {
  test.skip("succeeds", async () => {
    fetch.mockResponses(...input);
    const result = await getJobsFromWorkday(
      "https://zoom.wd5.myworkdayjobs.com/Zoom"
    );
    expect(result).toEqual(output);
  });
});
