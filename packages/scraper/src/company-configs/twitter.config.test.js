const { scrapeJobs } = require("./twitter.config");
const { input, output } = require("./twitter.config.mock");

describe("getJobs", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test("succeeds", async () => {
    fetch.mockResponse(JSON.stringify(input));
    const result = await scrapeJobs();
    expect(result).toEqual(output);
  });
});
