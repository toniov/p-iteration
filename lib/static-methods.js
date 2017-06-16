/**
 * Check if passed parameter is a Promise
 * @param {Object} obj
 */
const isPromise = (obj) => {
  return typeof obj === 'object' && typeof obj.then === 'function';
};

/**
 * forEach implementation in parallel
 * @param {*[]} array
 * @param {Function} callback
 * @param {Object} thisArg
 */
exports.forEach = async (array, callback, thisArg) => {
  const promiseArray = [];
  for (let i = 0; i < array.length; i++) {
    promiseArray.push(callback.call(thisArg || this, array[i], i, array));
  }
  await Promise.all(promiseArray);
};

/**
 * forEach implementation in series
 * @param {*[]} array
 * @param {Function} callback
 * @param {Object} thisArg
 */
exports.forEachSeries = async (array, callback, thisArg) => {
  for (let i = 0; i < array.length; i++) {
    await callback.call(thisArg || this, array[i], i, array);
  }
};

/**
 * map implementation in parallel
 * @param {*[]} array
 * @param {Function} callback
 * @param {Object} thisArg
 */
exports.map = async (array, callback, thisArg) => {
  const promiseArray = [];
  for (let i = 0; i < array.length; i++) {
    if (i in array) {
      promiseArray[i] = callback.call(thisArg || this, array[i], i, array);
    }
  }
  return Promise.all(promiseArray);
};

/**
 * map implementation in series
 * @param {*[]} array
 * @param {Function} callback
 * @param {Object} thisArg
 */
exports.mapSeries = async (array, callback, thisArg) => {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (i in array) {
      result[i] = await callback.call(thisArg || this, array[i], i, array);
    }
  }
  return result;
};

/**
 * find implementation in parallel
 * @param {*[]} array
 * @param {Function} callback
 * @param {Object} thisArg
 */
exports.find = (array, callback, thisArg) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < array.length; i++) {
      const check = (found) => {
        if (found) {
          resolve(array[i]);
        }
      };
      const result = callback.call(thisArg || this, array[i], i, array);
      if (isPromise(result)) {
        result.then(check).catch(reject);
      } else {
        check(result);
      }
    }
  });
};

/**
 * find implementation in series
 * @param {*[]} array
 * @param {Function} callback
 * @param {Object} thisArg
 */
exports.findSeries = async (array, callback, thisArg) => {
  for (let i = 0; i < array.length; i++) {
    if (await callback.call(thisArg || this, array[i], i, array)) {
      return array[i];
    }
  }
};

/**
 * findIndex implementation in parallel
 * @param {*[]} array
 * @param {Function} callback
 * @param {Object} thisArg
 */
exports.findIndex = (array, callback, thisArg) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < array.length; i++) {
      const check = (found) => {
        if (found) {
          resolve(i);
        }
      };
      const result = callback.call(thisArg || this, array[i], i, array);
      if (isPromise(result)) {
        result.then(check).catch(reject);
      } else {
        check(result);
      }
    }
  });
};

/**
 * findIndex implementation in series
 * @param {*[]} array
 * @param {Function} callback
 * @param {Object} thisArg
 */
exports.findIndexSeries = async (array, callback, thisArg) => {
  for (let i = 0; i < array.length; i++) {
    if (await callback.call(thisArg || this, array[i], i, array)) {
      return i;
    }
  }
};

/**
 * some implementation in parallel
 * @param {*[]} array
 * @param {Function} callback
 * @param {Object} thisArg
 */
exports.some = (array, callback, thisArg) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < array.length; i++) {
      const check = (found) => {
        if (found) {
          resolve(true);
        } else if (i === array.length - 1) {
          resolve(false);
        }
      };
      const result = callback.call(thisArg || this, array[i], i, array);
      if (isPromise(result)) {
        result.then(check).catch(reject);
      } else {
        check(result);
      }
    }
  });
};

/**
 * some implementation in series
 * @param {*[]} array
 * @param {Function} callback
 * @param {Object} thisArg
 */
exports.someSeries = async (array, callback, thisArg) => {
  for (let i = 0; i < array.length; i++) {
    if (await callback.call(thisArg || this, array[i], i, array)) {
      return true;
    }
  }
  return false;
};

/**
 * every implementation in parallel
 * @param {*[]} array
 * @param {Function} callback
 * @param {Object} thisArg
 */
exports.every = (array, callback, thisArg) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < array.length; i++) {
      const check = (found) => {
        if (!found) {
          resolve(false);
        } else if (i === array.length - 1) {
          resolve(true);
        }
      };
      const result = callback.call(thisArg || this, array[i], i, array);
      if (isPromise(result)) {
        result.then(check).catch(reject);
      } else {
        check(result);
      }
    }
  });
};

/**
 * every implementation in series
 * @param {*[]} array
 * @param {Function} callback
 * @param {Object} thisArg
 */
exports.everySeries = async (array, callback, thisArg) => {
  for (let i = 0; i < array.length; i++) {
    if (!await callback.call(thisArg || this, array[i], i, array)) {
      return false;
    }
  }
  return true;
};

/**
 * filter implementation in parallel
 * @param {*[]} array
 * @param {Function} callback
 * @param {Object} thisArg
 */
exports.filter = async (array, callback, thisArg) => {
  const promiseArray = [];
  for (let i = 0; i < array.length; i++) {
    if (i in array) {
      promiseArray[i] = callback.call(thisArg || this, array[i], i, array);
    } else {
      continue;
    }
  }
  return Promise.all(promiseArray).then(results => {
    const filteredArray = [];
    results.forEach((result, index) => {
      if (result) {
        filteredArray.push(array[index]);
      }
    });
    return filteredArray;
  });
};

/**
 * filter implementation in series
 * @param {*[]} array
 * @param {Function} callback
 * @param {Object} thisArg
 */
exports.filterSeries = async (array, callback, thisArg) => {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (i in array) {
      if (await callback.call(thisArg || this, array[i], i, array)) {
        result.push(array[i]);
      }
    }
  }
  return result;
};

/**
 * reduce implementation
 * @param {*[]} array
 * @param {Function} callback
 * @param {*} initialValue
 */
exports.reduce = async (array, callback, initialValue) => {
  let previousValue;
  for (let i = 0; i < array.length; i++) {
    if (i === 0) {
      if (initialValue) {
        previousValue = initialValue;
      } else {
        previousValue = array[i];
        continue;
      }
    }
    if (i in array) {
      previousValue = await callback(previousValue, array[i], i, array);
    }
  }
  return previousValue;
};
