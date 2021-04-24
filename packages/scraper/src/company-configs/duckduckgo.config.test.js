const { scrapeJobs } = require("./duckduckgo.config");
const { mockResult, mockResponse } = require("./duckduckgo.config.mock");

describe("scrapeJobs", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test("succeeds", async () => {
    fetch.mockResponseOnce(JSON.stringify(mockResponse));
    const result = await scrapeJobs();
    expect(result).toEqual(mockResult);
  });
});
