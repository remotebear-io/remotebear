module.exports = {
  extends: ["../../.eslintrc.js"],
  env: {
    es6: true,
    node: true,
  },
  overrides: [
    {
      files: ["components/**", "pages/**", "lib/**"],
      env: {
        browser: true,
      },
    },
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "react/prop-types": "off",
  },
};
