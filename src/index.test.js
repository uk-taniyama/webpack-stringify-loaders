import _ from 'lodash';
import test from 'tape';
import stringifyLoaders from './index';

test('should be a function', t => {
  t.equal(_.isFunction(stringifyLoaders), true);

  t.end();
});

test('called with a string as an argument', t => {
  t.equal(stringifyLoaders('style-loader'), 'style-loader', 'should return that string');

  t.end();
});

test('called with non String or Array argument', t => {
  t.equal(stringifyLoaders(3), '', 'should return an empty string');

  t.end();
});

test('called with null', t => {
  t.equal(stringifyLoaders(null), '', 'should return an empty string');

  t.end();
});

test('called with undefined', t => {
  t.equal(stringifyLoaders(), '', 'should return an empty string');

  t.end();
});

test('called with an empty string', t => {
  t.equal(stringifyLoaders(''), '', 'should return an empty string');

  t.end();
});

test('called with an array of', t => {
  test('a single loader string without query', t => {
    const actual = stringifyLoaders(['style-loader']);
    const expected = 'style-loader';

    t.equal(actual, expected, 'should return correct string');

    t.end();
  });

  test('a single loader string with query', t => {
    const actual = stringifyLoaders(['style-loader?foo=bar']);
    const expected = 'style-loader?foo=bar';

    t.equal(actual, expected, 'should return correct string');

    t.end();
  });

  test('single falsy value as a loader', t => {
    const actual = stringifyLoaders([null]);
    const expected = '';

    t.equal(actual, expected, 'should return correct string');

    t.end();
  });

  test('loaders, containing a falsy value', t => {
    const actual = stringifyLoaders(['style-loader', null]);
    const expected = 'style-loader';

    t.equal(actual, expected, 'should return correct string');

    t.end();
  });

  test('multiple string loaders without queries', t => {
    const actual = stringifyLoaders(['style-loader', 'css-loader']);
    const expected = 'style-loader!css-loader';

    t.equal(actual, expected, 'should return correct string');

    t.end();
  });

  test('multiple string loader with queries', t => {
    const actual = stringifyLoaders(['style-loader?foo=bar', 'css?bar=baz']);
    const expected = 'style-loader?foo=bar!css?bar=baz';

    t.equal(actual, expected, 'should return correct string');

    t.end();
  });

  test('a single loader object(but no array) with a `loader` property without `query`', t => {
    const actual = stringifyLoaders({ loader: 'style-loader' });
    const expected = 'style-loader';

    t.equal(actual, expected, 'should return correct string');

    t.end();
  });

  test('a single loader object with a `loader` property without `query`', t => {
    const actual = stringifyLoaders([{ loader: 'style-loader' }]);
    const expected = 'style-loader';

    t.equal(actual, expected, 'should return correct string');

    t.end();
  });

  test('loader objects with a non-string `loader` property with and without `query`', t => {
    const actual = stringifyLoaders([
      { loader: null },
      { loader: [], query: { foo: 'bar' } },
      { loader: 'style-loader' },
    ]);
    const expected = 'style-loader';

    t.equal(actual, expected, 'should return correct string');

    t.end();
  });

  test('loader object with a `loaders` property without `query`', t => {
    const actual = stringifyLoaders([{ loaders: 'style-loader' }]);
    const expected = 'style-loader';

    t.equal(actual, expected, 'should return correct string');

    t.end();
  });

  test('a single loader object with query', t => {
    const query = { foo: 'bar' };
    const actual = stringifyLoaders([{ loader: 'style-loader', query }]);
    const expected = `style-loader?${JSON.stringify(query)}`;

    t.equal(actual, expected, 'should return correct string');

    t.end();
  });

  test('a single loader object with a string query', t => {
    const query = 'foo=bar&baz=qux';
    const actual = stringifyLoaders([{ loader: 'style-loader', query }]);
    const expected = `style-loader?${query}`;

    t.equal(actual, expected, 'should return correct string');

    t.end();
  });

  test('a mix of string and loader objects with and without queries', t => {
    const styleQuery = { foo: 'bar' };
    const actual = stringifyLoaders([
      'null-loader',
      { loader: 'less-loader' },
      { loader: 'style-loader', query: styleQuery },
    ]);
    const expected = `null-loader!less-loader!style-loader?${JSON.stringify(styleQuery)}`;

    t.equal(actual, expected, 'should return correct string');

    t.end();
  });

  t.end();
});
