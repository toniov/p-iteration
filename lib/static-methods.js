/**
 * forEach implementation in parallel
 * @param {*[]} array
 * @param {Function} callback
 * @param {Object} thisArg
 */
exports.forEach = async (array, callback, thisArg) => {
  const promiseArray = [];
  for (let i = 0; i < array.length; i++) {
    promiseArray.push(callback.call(thisArg || this, await array[i], i, array));
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
    await callback.call(thisArg || this, await array[i], i, array);
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
      promiseArray[i] = callback.call(thisArg || this, await array[i], i, array);
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
      result[i] = await callback.call(thisArg || this, await array[i], i, array);
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
    if (array.length === 0) {
      return resolve();
    }
    let counter = 1;
    for (let i = 0; i < array.length; i++) {
      const check = (found) => {
        if (found) {
          resolve(array[i]);
        } else if (counter === array.length) {
          resolve();
        }
        counter++;
      };
      Promise.resolve(array[i])
        .then((elem) => callback.call(thisArg || this, elem, i, array))
        .then(check)
        .catch(reject);
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
    if (await callback.call(thisArg || this, await array[i], i, array)) {
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
    if (array.length === 0) {
      return resolve(-1);
    }
    let counter = 1;
    for (let i = 0; i < array.length; i++) {
      const check = (found) => {
        if (found) {
          resolve(i);
        } else if (counter === array.length) {
          resolve(-1);
        }
        counter++;
      };
      Promise.resolve(array[i])
        .then((elem) => callback.call(thisArg || this, elem, i, array))
        .then(check)
        .catch(reject);
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
    if (await callback.call(thisArg || this, await array[i], i, array)) {
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
    if (array.length === 0) {
      return resolve(false);
    }
    for (let i = 0; i < array.length; i++) {
      const check = (found) => {
        if (found) {
          resolve(true);
        } else if (i === array.length - 1) {
          resolve(false);
        }
      };
      Promise.resolve(array[i])
        .then((elem) => callback.call(thisArg || this, elem, i, array))
        .then(check)
        .catch(reject);
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
    if (await callback.call(thisArg || this, await array[i], i, array)) {
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
    if (array.length === 0) {
      return resolve(true);
    }
    for (let i = 0; i < array.length; i++) {
      const check = (found) => {
        if (!found) {
          resolve(false);
        } else if (i === array.length - 1) {
          resolve(true);
        }
      };
      Promise.resolve(array[i])
        .then((elem) => callback.call(thisArg || this, elem, i, array))
        .then(check)
        .catch(reject);
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
    if (!await callback.call(thisArg || this, await array[i], i, array)) {
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
  /* two loops are necessary in order to do the filtering concurrently
   * while keeping the order of the elements
   * (if you find a better way to do it please send a PR!)
   */ 
  const promiseArray = [];
  for (let i = 0; i < array.length; i++) {
    if (i in array) {
      promiseArray[i] = callback.call(thisArg || this, await array[i], i, array);
    }
  }
  const filteredArray = [];
  for (let i = 0; i < promiseArray.length; i++) {
    if (await promiseArray[i]) {
      filteredArray.push(await array[i]);
    }
  }
  return filteredArray;
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
      if (await callback.call(thisArg || this, await array[i], i, array)) {
        result.push(await array[i]);
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
  if (array.length === 0 && !initialValue) {
    throw TypeError('Reduce of empty array with no initial value');
  }
  let i;
  let previousValue;
  if (initialValue) {
    previousValue = initialValue;
    i = 0;
  } else {
    previousValue = array[0];
    i = 1;
  }
  for (i; i < array.length; i++) {
    if (i in array) {
      previousValue = await callback(await previousValue, await array[i], i, array);
    }
  }
  return previousValue;
};
