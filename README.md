# webpack-stringify-loaders

[![npm](https://img.shields.io/npm/v/webpack-stringify-loaders.svg?style=flat-square)](https://www.npmjs.com/package/webpack-stringify-loaders)
[![License](https://img.shields.io/npm/l/webpack-stringify-loaders.svg?style=flat-square)](https://github.com/le0nik/webpack-stringify-loaders/blob/master/LICENSE)

## Installation

```sh
npm install webpack-stringify-loaders --save-dev
```

## Why?
Mainly for compatibility with some webpack plugins and tools, that expect a string `loader`, instead of array of objects in `loaders`.

This module has been tested and fully supports latest versions of webpack-1 and webpack-2. If you find a problem, please file an issue.

## Difference from [webpack-combine-loaders](https://github.com/jsdf/webpack-combine-loaders)
This module works with a mix of loaders strings and objects.
It also correctly stringifies nested queries, so that webpack can parse them.

For example it works with this query:

```js
{
  plugins: [
    ['transform-es2015-template-literals', { 'loose': true }]
  ]
}
```

## Usage
```js
import stringifyLoaders from 'webpack-stringify-loaders';

module.exports = {
  module: {
    loaders: {
      test: /\.css$/
      loader: stringifyLoaders([ // property has to be 'loader'. Webpack expects it to be a string and 'loaders' - an array.
        'style',
        {
          loader: 'css',
          query: {
            module: true,
          }
        },
        ifProd({ // This loader will be `undefined` for non-production environment. Don't worry, `stringifyLoaders` will ignore it in that case.
          loaders: 'postcss', // also supports 'loaders' property, instead of 'loader'
          query: 'pack=defaults', // also supports query as string
        })
      ])
    },
  }
}
```

## License

[MIT License](https://github.com/le0nik/eslint-config-sensible/blob/master/LICENSE)

