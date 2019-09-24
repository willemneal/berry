// Source: https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/imports.js
module.exports = {
  plugins: ["pnp"],
  rules: {
    "pnp/no-node-modules-string": 2,
    "pnp/no-unqualified-webpack-config": 2
  }
};
