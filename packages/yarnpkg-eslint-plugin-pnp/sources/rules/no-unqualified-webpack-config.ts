import {Rule}        from "eslint";
import {Node}        from "estree";

import {isQualified} from "../utils";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: "disallow disallow unqualified webpack loaders and presets in webpack configs",
      category: "Best Practices",
      // recommended: false,
      // url: ""
    },

    schema: [],
  },


  create(context) {
    function validate(node: Node): void {
      const isWebpackConfig = /webpack.config.js/.test(context.getFilename());
      if (!isWebpackConfig)
        return;

      if (node.type !== "Literal")
        return;

      if (isQualified(node))
        return;

      context.report({
        node: node,
        message: "Do not use string literals for resolving modules in your webpack config",
      });
    }

    return {
      "Literal[value=/.*loader.*/]": validate,
      "Property[key.name='presets'] > ArrayExpression > Literal": validate,
    };
  },
};

module.exports = rule;
