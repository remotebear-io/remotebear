const departmentsData = require("@remotebear/data/departments/departments-data.json");

const departmentIds = departmentsData.reduce((acc, department) => {
  acc[department.id] = department.id;
  return acc;
}, {});

module.exports = {
  allDepartments: departmentsData,
  departmentIds,
};
