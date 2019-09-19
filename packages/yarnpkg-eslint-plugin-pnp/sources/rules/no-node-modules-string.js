/**
 * @fileoverview Rule to flag node_modules in string literals.
 * @author Will Griffiths
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: "suggestion",

    docs: {
      description: "disallow node_modules in string literals",
      category: "Best Practices"
      // recommended: false,
      // url: ""
    },

    schema: []
  },

  create(context) {
    return {
      Literal(node) {
        if (typeof node.value !== "string") {
          return;
        }

        const match = node.raw.match(/node_modules/g);

        if (match) {
          context.report({
            node,
            message:
              "Don't use node_modules in strings. Import modules by their names.",
            data: { string: node.raw }
          });
        }
      }
    };
  }
};
