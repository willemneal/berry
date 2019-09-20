/**
 * Find the closest parent matching a list of types.
 * @param {ASTNode} node The node whose parents we are searching
 * @param {Array} types The node types to match
 * @returns {ASTNode} The matched node or undefined.
 */
// Source: https://github.com/eslint/eslint/blob/master/lib/rules/callback-return.js
import {Literal, Node} from "estree";

function findClosestParentOfType(node: Node, types: Array<Node['type']>): Node | null {
  const {parent} = (node as any);

  if (!parent)
    return null;

  if (types.indexOf(parent.type) === -1)
    return findClosestParentOfType(parent, types);

  return (parent as Node);
}

/**
 * Find whether a loader/plugin is wrapped in a require.resolve() call.
 * @param {ASTNode} node The node whose parents we are searching
 * @returns {boolean} The result of the test
 */
export function isQualified(literalNode:Literal) : boolean {
  const parent = findClosestParentOfType(literalNode, ["CallExpression"]);

  if (!parent)
    return false;

  if (parent.type !== "CallExpression")
    return false;

  if (parent.callee.type !== "MemberExpression")
    return false;

  if (parent.callee.object.type !== "Identifier")
    return false;

  if (parent.callee.property.type !== "Identifier")
    return false;

  return parent.callee.object.name === "require" && parent.callee.property.name === "resolve";
}
