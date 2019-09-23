# pnp/no-unqualified-webpack-config

Ensures that third party tools (CRA, Next, Vue-Cli, ...) resolve their own versions of loaders and presets.

When loaders and plugins are included as strings e.g `loader: 'file-loader'` in a `webpack.config.js` then Webpack will try to resolve it from the point of view of the project root. 

If the webpack config is located in a dependency, as with tools such as Create-React-App, Next.js and Gatsby, then Webpack might accidentally end up using an different hoisted version of a plugin. And this can cause various weird bugs and crashes.

If the tool used `require.resolve('file-loader')`, then Webpack would load the plugin through an absolute path so it is guaranteed to always use the loader/plugin it specifies in its own package.json.

## Rule Details

// TODO Add correct and incorrect use cases

## When Not To Use It

1. You're not a package maintainer
2. Your package's `webpack.config.js` is only used during the development of your package

## Further Reading

[Webpack Config](https://webpack.js.org/configuration/)
This is a temporary measure to address this [issue](https://github.com/webpack/webpack/issues/9648)
