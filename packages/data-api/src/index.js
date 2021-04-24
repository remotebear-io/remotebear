if (typeof window !== "undefined" && process.env.NODE_ENV !== "test") {
  // Safety check to make sure we're not importing this file in "website" because
  // it's not treeshakeable and it would end up increasing the bundle size with
  // the entire list of jobs, locations, etc...
  // You can still import stuff from the sub-dirs if needed by updating the
  // package.json's externals field.
  throw new Error(
    `This file must not be imported in a web app because it's not treeshakeable. Please import the data granularly from their own sub-directories.`
  );
}

module.exports = {
  ...require("./companies"),
  ...require("./locations"),
  ...require("./jobs"),
  ...require("./location-patterns"),
  ...require("./departments"),
};
