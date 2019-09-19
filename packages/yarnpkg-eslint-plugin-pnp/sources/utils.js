/**
 * Find the closest parent matching a list of types.
 * @param {ASTNode} node The node whose parents we are searching
 * @param {Array} types The node types to match
 * @returns {ASTNode} The matched node or undefined.
 */
// Source: https://github.com/eslint/eslint/blob/master/lib/rules/callback-return.js

function findClosestParentOfType(node, types) {
  if (!node.parent) {
      return null;
  }
  if (types.indexOf(node.parent.type) === -1) {
      return findClosestParentOfType(node.parent, types);
  }
  return node.parent;
}

/**
 * Find whether a loader/plugin is wrapped in a require.resolve() call.
 * @param {ASTNode} node The node whose parents we are searching
 * @returns {boolean} The result of the test
 */
function isQualified(literalNode) {
  const parent = findClosestParentOfType(literalNode, ["CallExpression"])
  if (!parent) {
    return false
  }
  return parent.callee.object.name === "require" && parent.callee.property.name === "resolve"
}

module.exports = {
  isQualified,
}
