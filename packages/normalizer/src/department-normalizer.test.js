const {
  getNormalizedDepartment,
  departmentIds,
} = require("./department-normalizer");

const engineeringTestCases = [
  ["Engineering"],
  ["Ads Solution Engineering"],
  ["Anti-Evil Engineering"],
  ["Solutions Engineering"],
  ["Software Engineering"],
  ["Infrastructure Engineering"],
  ["Engineering", "Senior Software Engineer, Git Client"],
  ["Engineering & IT", "Software Engineer, Git Client"],
  ["Drivers", "Chief of Staff (Engineering)"],
  ["Product Engineering", "Sr. Implementation Services Engineer, II"],
  ["Legal", "Senior Cloud Security Engineer"],
  ["Engineering", "Android Engineer - Consumer Revenue"],
  ["Engineering", "Graphics Engineer, Canvas Render"],
  ["Engineering", "iOS Engineer - Consumer Revenue"],
  ["Engineering", "Full Stack Software Engineer"],
  ["Support", "Senior Software Engineer, C/C++"],
  ["Legal", "Sales Engineer - UK Education"],
  ["Engineering", "Android Developer"],
  ["Engineering", "Developer Partner Marketing Manage"],
  ["Engineering", "Software Engineering Manager, Developer Productivity"],
  ["Product Engineering", "Software Developer"],
  ["Cloud Services", "Creative Developer"],
  ["Support", "Developer Advocate (EMEA)"],
  ["Billing", "Lead C# Developer"],
  ["Engineering", "Web Developer"],
  ["Engineering", "Cloud SRE - Cloud Services"],
  ["Product Engineering", "Senior Site Reliability Engineer (SRE)"],
  ["IT", "Security DevOps Engineer"],
  ["Engineering", "Senior DevOps Engineer"],
  ["Engineering", "Infrastructure (DevOps) Manager"],
  ["Solutions Engineering", "Enterprise Solutions Engineer"],
  ["Customer Engineering", "Associate Solutions Engineer"],
];

const nonEngineeringTestCases = [
  // Product
  ["Product"],
  ["Product Manager"],
  ["Product Management"],
  ["Product", "Senior Product Manager - Search"],
  ["Product", "Product Manager - Community"],
  ["Product Management", "Product Manager, Onboarding"],
  ["Product", "Product Manager - Payments"],
  ["MoPub", "Senior Product Manager, MoPub"],
  // Design
  ["Design"],
  ["UX"],
  ["Design and Research"],
  // Sales
  ["Sales"],
  ["Sales & Customer Success"],
  ["Commercial Sales"],
  ["Commercial Sales - Mid-Market"],
  ["Enterprise Sales"],
  ["Enterprise Sales - EMEA"],
  ["Sales and Partnerships"],
];

const testTable = [
  ...engineeringTestCases.map((x) => [x, departmentIds.engineering]),
  ...nonEngineeringTestCases.map((x) => [x, undefined]),
];

test.each(testTable)("normalizes %p into %p", (input, output) => {
  const job = {
    department: input[0] || "",
    title: input[1] || "",
  };
  expect(getNormalizedDepartment(job)).toEqual(output);
});
