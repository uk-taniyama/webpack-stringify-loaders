import _ from 'lodash';
import test from 'tape';
import webpack1 from 'webpack-1';
import webpack2 from 'webpack-2';
import stringifyLoaders from '../src';

const packages = {
  'webpack@1': webpack1,
  'webpack@2': webpack2,
};

_.forEach(packages, (webpack, packageName) => {
  testWithWebpack(webpack, packageName);
});

/**
 * @param {Function} webpack
 * @param {string} packageName
 */
function testWithWebpack(webpack, packageName) {
  const prefix = `stringifyLoaders with ${packageName}`;

  test(`${prefix} with single string loader without query`, t => {
    const loaders = 'babel';

    build(t, webpack, loaders);
  });

  test(`${prefix} with single object loader with complex query`, t => {
    const loaders = [
      {
        loader: 'babel',
        query: {
          babelrc: false,
          plugins: [
            ['transform-es2015-template-literals', { 'loose': true }],
          ],
        },
      },
    ];

    build(t, webpack, loaders);
  });

  test(`${prefix} with multiple loaders(strings and objects) with and without queries`, t => {
    const loaders = [
      'null',
      {
        loader: 'checksum',
      },
      {
        loader: 'babel',
        query: {
          babelrc: false,
          plugins: [
            ['transform-es2015-template-literals', { 'loose': true }],
          ],
        },
      },
    ];

    build(t, webpack, loaders);
  });
}

/**
 * @param {Function} t
 * @param {Function} webpack
 * @param {string|(string|Object)[]} loaders
 */
function build(t, webpack, loaders) {
  const compiler = webpack(createConfig(loaders));
  compiler.run(_.partial(onConfigLoaded, t));
}

/**
 * @param {string|(string|Object)[]} loaders
 * @returns {Object}
 */
function createConfig(loaders) {
  return {
    entry: __dirname + '/example.js',
    output: {
      filename: '../.temp/example.bundle.js',
      library: 'Example',
      libraryTarget: 'umd',
    },
    module: {
      loaders: [
        { test: /\.js$/, exclude: /node_modules/, loader: stringifyLoaders(loaders) },
      ],
    },
  };
}

/**
 * @param {Function} t
 * @param {null|Error} err
 * @param {Stats} stats
 */
function onConfigLoaded(t, err, stats) {
  /* eslint-disable no-console */
  if (err) {
    console.log(err.stack || err);
  }

  t.equal(err, null, 'should not result in fatal error');

  if (stats) {
    const { errors, warnings } = stats.toJson();

    if (errors.length) {
      errors.forEach(error => {
        console.log(error);
      });
    }

    if (warnings.length) {
      warnings.forEach(warning => {
        console.log(warning);
      });
    }

    t.equal(stats.hasErrors(), false, 'should not result in compilation errors');
    t.equal(stats.hasWarnings(), false, 'should not result in compilation warnings');
  }

  t.end();
  /* eslint-enable no-console */
}

