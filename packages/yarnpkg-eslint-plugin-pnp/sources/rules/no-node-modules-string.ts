/**
 * @fileoverview Rule to flag node_modules in string literals.
 * @author Will Griffiths
 */

"use strict";
import {Rule} from "eslint";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: "disallow node_modules in string literals",
      category: "Best Practices",
      // recommended: false,
      // url: ""
    },

    schema: [],
  },

  create(context) {
    return {
      Literal(node) {
        // Guard because types don't understand Selectors
        if (node.type !== "Literal")
          return;

        if (node.raw === undefined)
          return;

        const match = node.raw.match(/node_modules/g);

        if (match) {
          context.report({
            node,
            message:
              "Don't use node_modules in strings. Import modules by their names.",
            data: {string: node.raw},
          });
        }
      },
    };
  },
};


module.exports = rule;
