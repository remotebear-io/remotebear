let companiesData = require("@remotebear/data/companies/companies-data.json");
const fs = require("fs");
const path = require("path");

const companiesDataPath = "../../data/companies/companies-data.json";

const allCompanies = companiesData;

const allCompaniesById = companiesData.reduce((acc, company) => {
  acc[company.id] = company;
  return acc;
}, {});

function getCompany(companyId) {
  return allCompaniesById[companyId];
}

function validateCompany(company) {
  if (!company) {
    throw new Error(`Invalid (nullish) company.`);
  }
  const requiredFields = ["id", "name", "url"];
  const missingRequiredField = requiredFields.some(
    (requiredField) => !Object.keys(company).includes(requiredField)
  );
  if (missingRequiredField) {
    throw new Error(
      `The company is missing the "${missingRequiredField}" field.`
    );
  }
}

async function createCompany(company) {
  validateCompany(company);
  if (companiesData.find((x) => x.id === company.id)) {
    throw new Error(`A company with id "${company.id}" already exists.`);
  }
  const newCompany = {
    id: company.id,
    name: company.name,
    url: company.url,
    crunchbaseConfig: company.crunchbaseConfig || { id: company.id },
    crunchbaseMeta: company.crunchbaseMeta || {},
    scrapingConfig: company.scrapingConfig || { id: company.id },
    scrapingStrategy: company.scrapingStrategy || "custom",
    status: company.status || "enabled",
    createdAt: company.createdAt || Date.now(),
  };
  const updatedCompaniesData = [...companiesData, newCompany];
  fs.writeFileSync(
    path.resolve(__dirname, companiesDataPath),
    JSON.stringify(updatedCompaniesData)
  );
  companiesData = updatedCompaniesData;
  return newCompany;
}

async function updateCompany(companyId, company) {
  const existingCompany = companiesData.find((x) => x.id === companyId);
  if (!existingCompany) {
    throw new Error(`A company with id "${companyId}" does not exist.`);
  }
  existingCompany.name = company.name || existingCompany.name;
  existingCompany.url = company.url || existingCompany.url;
  existingCompany.crunchbaseConfig =
    company.crunchbaseConfig || existingCompany.crunchbaseConfig;
  existingCompany.scrapingConfig =
    company.scrapingConfig || existingCompany.scrapingConfig;
  existingCompany.scrapingStrategy =
    company.scrapingStrategy || existingCompany.scrapingStrategy;
  existingCompany.status = company.status || existingCompany.status;
  existingCompany.createdAt = company.createdAt || existingCompany.createdAt;
  fs.writeFileSync(
    path.resolve(__dirname, companiesDataPath),
    JSON.stringify(companiesData)
  );
  return existingCompany;
}

module.exports = {
  allCompanies,
  allCompaniesById,
  getCompany,
  createCompany,
  updateCompany,
};
