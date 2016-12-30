/**
 * @param {Array|string|Object|null|undefined} loaders
 * @returns {string}
 */
module.exports = function stringifyLoaders(loaders) {
  if (typeof loaders === 'string') {
    return loaders;
  }

  if (Array.isArray(loaders)) {
    return reduceLoadersToString(loaders);
  }

  if (loaders) {
    return stringifyLoaderObject(loaders);
  }

  return '';
};

/**
 * @param {({ loader: string, query: [Object] }|string)[]} loaders
 * @returns {string}
 */
function reduceLoadersToString(loaders) {
  const len = loaders.length;

  let i = -1;
  let combinedLoaders = '';

  while (++i < len) {
    const loader = loaders[i];

    if (!loader) {
      continue;
    }

    combinedLoaders = concatLoaders(combinedLoaders, loader);
  }

  return combinedLoaders;
}

/**
 * @param {string} combinedLoaders
 * @param {string|Object} loader
 * @returns {string}
 */
function concatLoaders(combinedLoaders, loader) {
  const loaderString = (typeof loader === 'string') ?
    loader :
    stringifyLoaderObject(loader);

  return concatLoaderStrings(combinedLoaders, loaderString);
}

/**
 * @param {{ loader: string, query: (string|Object) }} loaderObject
 * @returns {string}
 */
function stringifyLoaderObject(loaderObject) {
  const loader = loaderObject.loaders || loaderObject.loader;
  const query = loaderObject.query;

  if (typeof loader !== 'string') {
    return '';
  }

  return query ?
    `${loader}?${stringifyQuery(query)}` :
    loader;
}

/**
 * @param {string} combinedLoaders
 * @param {string} loader
 * @returns {string}
 */
function concatLoaderStrings(combinedLoaders, loader) {
  return combinedLoaders ?
    `${combinedLoaders}!${loader}` :
    loader;
}

/**
 * @param {string|Object} query
 * @returns {string}
 */
function stringifyQuery(query) {
  return (typeof query === 'string') ?
    query :
    JSON.stringify(query);
}

