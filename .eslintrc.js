module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    // browser: true,
    es6: true,
    node: true,
  },
  extends: [
    "standard-with-typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended", // This line
    "prettier",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/no-var-requires": "off"
  },
};
