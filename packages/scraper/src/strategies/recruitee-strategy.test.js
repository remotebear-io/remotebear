const { getJobsFromRecruitee } = require("./recruitee-strategy");
const { input, output } = require("./recruitee-strategy.mock");

describe("getJobsFromRecruitee", () => {
  test("succeeds", async () => {
    fetch.mockResponseOnce(JSON.stringify(input));
    const result = await getJobsFromRecruitee("hotjar");
    expect(result).toEqual(output);
  });
});
