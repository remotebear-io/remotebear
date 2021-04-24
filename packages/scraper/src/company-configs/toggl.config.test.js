const { extractLocationFromJobDescription } = require("./toggl.config");

describe("extractLocationFromJobDescription", () => {
  const testTable = [
    [
      "As an integral part of the business intelligence team, you will develop, automate, and take ownership of data models, analyses, and visualizations that empower our awesome, remote-first team to make informed decisions. The salary for this position is €48,000 annually. You can work from anywhere in the world.",
      "Remote",
    ],
    [
      "As part of our Operations team you will design and implement best practices in all People & Culture areas to ensure high-quality leadership across the organisation, continuous people/performance development, and growth of our organisational culture. You'll be leading a team of 3 people. The salary for this position is €65,000 annually. You can work remotely from anywhere in Europe.",
      "Remote - EU",
    ],
    [
      "You will be a part of our Product Team bringing Toggl Track to whole new levels. The salary for this position is €60,000 annually and you can work from anywhere in the world.",
      "Remote",
    ],
    [
      "You will be a part of our Product Team bringing Toggl Track to whole new levels. The salary for this position is €45,000 annually. You can work from anywhere in the world.",
      "Remote",
    ],
    [
      "You love to code slick and fast web apps. You take pride in products you build. We work with Golang and PostgreSQL in RESTful systems with JSON formatted payloads. Knowledge of Heroku, AWS and GraphQL is a plus. The salary for this position is €52,000 annually. You need to be based in Europe.",
      "Remote - EU",
    ],
    [
      "We are looking for a talented Email marketing manager to take the lead with our email marketing strategies. Your main duties include running email marketing campaigns end-to-end, managing email databases and creating newsletters. If you’re interested in web technologies and can generate innovative ideas to increase sales, we would like to meet you. For this role, you should be able to work during European time zones. The gross salary for the role is €45,000 annually plus some great benefits.",
      "Remote - EU",
    ],
  ];

  test.each(testTable)(
    "extracts locations from jobs description",
    (input, output) => {
      expect(extractLocationFromJobDescription(input)).toBe(output);
    }
  );
});
