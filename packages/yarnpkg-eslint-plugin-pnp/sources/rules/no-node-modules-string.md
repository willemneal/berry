# Forbid the use of `node_modules` in strings (no-node-modules-string)

If a string literal includes "node_modules" else it is likely a sign that the package is doing shady things with node_modules which would likely fail under PnP.

One of the big benefits of Plug-n-Play is that it does away with `node_modules` directories to achieve zero installs, increased stability and reliability. Therefore, resolutions that rely on the presence of a `node_modules` will fail.

```js
var foo = require("../../node_modules/lodash)";
```

Setting aside Plug'n'Play requirements, resolving packages using `node_modules` this way is brittle and may result unpredictable packages versions.

## Rule Details

This rule disallows node_modules in string literals.

Examples of **incorrect** code for this rule:

```js
/*eslint no-node-modules-strings: "error"*/

var module = require("../node_modules/lodash");
```

Examples of **correct** code for this rule:

```js
/*eslint no-node-modules-strings: "error"*/

var foo = require("lodash"); // importing a module by its name
```

## Further Reading

* [Introduction to `plug-n-play`](https://next.yarnpkg.com/features/pnp)
