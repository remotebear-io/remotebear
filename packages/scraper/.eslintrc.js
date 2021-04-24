module.exports = {
  extends: ["../../.eslintrc.js"],
  env: {
    node: true,
  },
  overrides: [
    {
      files: ["*.test.js"],
      env: {
        jest: true,
      },
      globals: {
        fetch: "readonly",
      },
    },
  ],
};
