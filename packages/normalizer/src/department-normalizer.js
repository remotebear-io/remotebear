const { allDepartments } = require("@remotebear/data-api");

const departmentIds = allDepartments.reduce((acc, department) => {
  acc[department.id] = department.id;
  return acc;
}, {});

function sanitizeString(str) {
  return (str || "").toLowerCase().replace(/[^a-zA-Z0-9 ]+/g, "");
}

function stringIncludes(str, cases = []) {
  return Array.isArray(cases)
    ? cases.some((x) => sanitizeString(str).includes(sanitizeString(x)))
    : sanitizeString(str).includes(sanitizeString(cases));
}

function isDepartmentEngineering(job) {
  return (
    stringIncludes(job.department, "engineer") ||
    stringIncludes(job.title, [
      "engineer",
      "sre",
      "devops",
      "sysadmin",
      "developer",
      "solutions architect",
    ])
  );
}

function getNormalizedDepartment(job) {
  if (isDepartmentEngineering(job)) {
    return departmentIds.engineering;
  }
  return undefined;
}

module.exports = {
  departmentIds,
  getNormalizedDepartment,
};
