module.exports = {
  parserOptions: {
    project: "./tsconfig.json",
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  parser: "@typescript-eslint/parser",
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint", "prettier"],
  env: {
    browser: true,
    mocha: true,
    es6: true,
    node: true,
  },
};
