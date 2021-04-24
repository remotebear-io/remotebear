require("dotenv").config();

const config = {
  GITHUB_API_TOKEN: process.env.GITHUB_API_TOKEN,
  GITHUB_OWNER: process.env.GITHUB_OWNER,
  GITHUB_REPO: process.env.GITHUB_REPO,
};

module.exports = config;
