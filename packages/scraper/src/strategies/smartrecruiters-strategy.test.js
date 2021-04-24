const { getJobsFromSmartrecruiters } = require("./smartrecruiters-strategy");
const { input, output } = require("./smartrecruiters-strategy.mock");

describe("getJobsFromSmartrecruiters", () => {
  test("succeeds", async () => {
    fetch
      .mockResponseOnce(JSON.stringify(input[0]))
      .mockResponseOnce(JSON.stringify(input[1]));
    const result = await getJobsFromSmartrecruiters("shopify", { limit: 50 });
    expect(result).toEqual(output);
  });
});
