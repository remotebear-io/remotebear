// Automatically export every file that ends with ".config.js" from this dir,
// using whatever comes before ".config.js" as the export name.
// So putting a file named "twitter.config.js" in this dir means its content
// will be accessible like this: require("company-configs").twitter.
const glob = require("glob");

glob.sync(`${__dirname}/**.config.js`).forEach(function (file) {
  const companyConfig = require(file);
  const companyId = file
    .substr(file.lastIndexOf("/") + 1)
    .replace(/.config.js/, "");
  module.exports[companyId] = companyConfig;
});
