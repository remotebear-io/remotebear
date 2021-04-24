const {
  locationLooselyIncludes,
  locationKeywordsLooselyMatch,
} = require("./utils");

describe("locationLooselyIncludes", () => {
  test('returns true for "Remote-EU, Remote-Rest of World", "remote rest of world"', () => {
    expect(
      locationLooselyIncludes(
        "Remote EU, Remote Rest of World",
        "remote rest of world"
      )
    ).toBe(true);
  });
});

describe("locationKeywordsLooselyMatch", () => {
  const testTable = [
    ["Remote UK", ["UK", "Remote US"], false],
    ["Remote UK", ["UK", "Remote US", "Remote - UK"], true],
    ["Remote UK", ["UK", "Remote US", "UK (Remote)"], true],
    ["Remote UK", ["remote UK remote US"], false],
    ["Remote UK", ["remote UK remote"], true],
    ["UK", ["remote UK", "Remote US", "UK (Remote)"], false],
  ];
  test.each(testTable)(
    "%p keywords should match %p? %p",
    (str, cases, expectation) => {
      expect(locationKeywordsLooselyMatch(str, cases)).toEqual(expectation);
    }
  );
});
