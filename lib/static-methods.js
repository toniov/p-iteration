/**
 * Implements ES5 [`Array#forEach()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) method.<br><br>
 * Executes the provided callback once for each element.<br>
 * Callbacks are run concurrently,
 * and are only invoked for properties of the array that have been initialized (including those initialized with *undefined*), for unassigned ones `callback` is not run.<br>
 * @param {Array} array - Array to iterate over.
 * @param {Function} callback - Function to apply each item in `array`. Accepts three arguments: `currentValue`, `index` and `array`.
 * @param {Object} [thisArg] - Value to use as *this* when executing the `callback`.
 * @return {Promise} - Returns a Promise with undefined value.
 */
exports.forEach = async (array, callback, thisArg) => {
  const promiseArray = [];
  for (let i = 0; i < array.length; i++) {
    if (i in array) {
      const p = Promise.resolve(array[i]).then((currentValue) => {
        return callback.call(thisArg || this, currentValue, i, array);
      });
      promiseArray.push(p);
    }
  }
  await Promise.all(promiseArray);
};

/**
 * Same functionality as [`forEach()`](global.html#forEach), but runs only one callback at a time.
 * @param {Array} array - Array to iterate over.
 * @param {Function} callback - Function to apply each item in `array`. Accepts three arguments: `currentValue`, `index` and `array`.
 * @param {Object} [thisArg] - Value to use as *this* when executing the `callback`.
 * @return {Promise} - Returns a Promise with undefined value.
 */
exports.forEachSeries = async (array, callback, thisArg) => {
  for (let i = 0; i < array.length; i++) {
    if (i in array) {
      await callback.call(thisArg || this, await array[i], i, array);
    }
  }
};

/**
 * Implements ES5 [`Array#map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) method.<br><br>
 * Creates a new array with the results of calling the provided callback once for each element.<br>
 * Callbacks are run concurrently,
 * and are only invoked for properties of the array that have been initialized (including those initialized with *undefined*), for unassigned ones`callback` is not run.<br>
 * Resultant *Array* is always the same *length* as the original one.
 * @param {Array} array - Array to iterate over.
 * @param {Function} callback - Function to apply each item in `array`. Accepts three arguments: `currentValue`, `index` and `array`.
 * @param {Object} [thisArg] - Value to use as *this* when executing the `callback`.
 * @return {Promise} - Returns a Promise with the resultant *Array* as value.
 */
exports.map = async (array, callback, thisArg) => {
  const promiseArray = [];
  for (let i = 0; i < array.length; i++) {
    if (i in array) {
      promiseArray[i] = Promise.resolve(array[i]).then((currentValue) => {
        return callback.call(thisArg || this, currentValue, i, array);
      });
    }
  }
  return Promise.all(promiseArray);
};

/**
 * Same functionality as [`map()`](global.html#map), but runs only one callback at a time.
 * @param {Array} array - Array to iterate over.
 * @param {Function} callback - Function to apply each item in `array`. Accepts three arguments: `currentValue`, `index` and `array`.
 * @param {Object} [thisArg] - Value to use as *this* when executing the `callback`.
 * @return {Promise} - Returns a Promise with the resultant *Array* as value.
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
 * Implements ES5 [`Array#find()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) method.<br><br>
 * Returns the value of the element that satisfies the provided `callback`. The value returned is the one found first.<br>
 * Callbacks are run concurrently, meaning that all the callbacks are going to run even if the returned value is found in one of the first elements of `array`,
 * depending on the async calls you are going to use, consider using instead [`findSeries()`](global.html#findSeries).<br>
 * @param {Array} array - Array to iterate over.
 * @param {Function} callback - Function to apply each item in `array`. Accepts three arguments: `currentValue`, `index` and `array`.
 * @param {Object} [thisArg] - Value to use as *this* when executing the `callback`.
 * @return {Promise} - Returns a Promise with the element that passed the test as value, otherwise *undefined*.
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
 * Same functionality as [`find()`](global.html#find), but runs only one callback at a time.
 * @param {Array} array - Array to iterate over.
 * @param {Function} callback - Function to apply each item in `array`. Accepts three arguments: `currentValue`, `index` and `array`.
 * @param {Object} [thisArg] - Value to use as *this* when executing the `callback`.
 * @return {Promise} - Returns a Promise with the element that passed the test as value, otherwise *undefined*.
 */
exports.findSeries = async (array, callback, thisArg) => {
  for (let i = 0; i < array.length; i++) {
    if (await callback.call(thisArg || this, await array[i], i, array)) {
      return array[i];
    }
  }
};

/**
 * Implements ES5 [`Array#findIndex()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex) method.<br><br>
 * Returns the index of the element that satisfies the provided `callback`. The index returned is the one found first.<br>
 * Callbacks are run concurrently, meaning that all the callbacks are going to run even if the returned index is found in one of the first elements of `array`,
 * depending on the async calls you are going to use, consider using instead [`findSeries()`](global.html#findSeries).<br>
 * @param {Array} array - Array to iterate over.
 * @param {Function} callback - Function to apply each item in `array`. Accepts three arguments: `currentValue`, `index` and `array`.
 * @param {Object} [thisArg] - Value to use as *this* when executing the `callback`.
 * @return {Promise} - Returns a Promise with the index that passed the test as value, otherwise *-1*.
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
 * Same functionality as [`findIndex()`](global.html#findIndex), but runs only one callback at a time.
 * @param {Array} array - Array to iterate over.
 * @param {Function} callback - Function to apply each item in `array`. Accepts three arguments: `currentValue`, `index` and `array`.
 * @param {Object} [thisArg] - Value to use as *this* when executing the `callback`.
 * @return {Promise} - Returns a Promise with the index that passed the test, otherwise *-1*.
 */
exports.findIndexSeries = async (array, callback, thisArg) => {
  for (let i = 0; i < array.length; i++) {
    if (await callback.call(thisArg || this, await array[i], i, array)) {
      return i;
    }
  }
};

/**
 * Implements ES5 [`Array#some()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some) method.<br><br>
 * Test if some element in `array` passes the test implemented in `callback`.<br>
 * Callbacks are run concurrently, meaning that all the callbacks are going to run even if some of the first elements pass the test,
 * depending on the async calls you are going to use, consider using instead [`someSeries()`](global.html#someSeries).<br>
 * @param {Array} array - Array to iterate over.
 * @param {Function} callback - Function to apply each item in `array`. Accepts three arguments: `currentValue`, `index` and `array`.
 * @param {Object} [thisArg] - Value to use as *this* when executing the `callback`.
 * @return {Promise} - Returns a Promise with *true* as value if some element passed the test, otherwise *false*.
 */
exports.some = (array, callback, thisArg) => {
  return new Promise((resolve, reject) => {
    if (array.length === 0) {
      return resolve(false);
    }
    let counter = 1;
    for (let i = 0; i < array.length; i++) {
      if (!(i in array)) {
        counter++;
        continue;
      }
      const check = (found) => {
        if (found) {
          resolve(true);
        } else if (counter === array.length) {
          resolve(false);
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
 * Same functionality as [`some()`](global.html#some), but runs only one callback at a time.
 * @param {Array} array - Array to iterate over.
 * @param {Function} callback - Function to apply each item in `array`. Accepts three arguments: `currentValue`, `index` and `array`.
 * @param {Object} [thisArg] - Value to use as *this* when executing the `callback`.
 * @return {Promise} - Returns a Promise with *true* as value if some element passed the test, otherwise *false*.
 */
exports.someSeries = async (array, callback, thisArg) => {
  for (let i = 0; i < array.length; i++) {
    if (i in array && await callback.call(thisArg || this, await array[i], i, array)) {
      return true;
    }
  }
  return false;
};

/**
 * Implements ES5 [`Array#every()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every) method.<br><br>
 * Test if all elements in `array` pass the test implemented in `callback`.<br>
 * Callbacks are run concurrently, meaning that all the callbacks are going to run even if any of the first elements do not pass the test,
 * depending on the async calls you are going to use, consider using instead [`everySeries()`](global.html#everySeries).<br>
 * @param {Array} array - Array to iterate over.
 * @param {Function} callback - Function to apply each item in `array`. Accepts three arguments: `currentValue`, `index` and `array`.
 * @param {Object} [thisArg] - Value to use as *this* when executing the `callback`.
 * @return {Promise} - Returns a Promise with *true* as value if all elements passed the test, otherwise *false*.
 */
exports.every = (array, callback, thisArg) => {
  return new Promise((resolve, reject) => {
    if (array.length === 0) {
      return resolve(true);
    }
    let counter = 1;
    for (let i = 0; i < array.length; i++) {
      if (!(i in array)) {
        counter++;
        continue;
      }
      const check = (found) => {
        if (!found) {
          resolve(false);
        } else if (counter === array.length) {
          resolve(true);
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
 * Same functionality as [`every()`](global.html#every), but runs only one callback at a time.<br><br>
 * @param {Array} array - Array to iterate over.
 * @param {Function} callback - Function to apply each item in `array`. Accepts three arguments: `currentValue`, `index` and `array`.
 * @param {Object} [thisArg] - Value to use as *this* when executing the `callback`.
 * @return {Promise} - Returns a Promise with *true* as value if all elements passed the test, otherwise *false*.
 */
exports.everySeries = async (array, callback, thisArg) => {
  for (let i = 0; i < array.length; i++) {
    if (i in array && !await callback.call(thisArg || this, await array[i], i, array)) {
      return false;
    }
  }
  return true;
};

/**
 * Implements ES5 [`Array#filter()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) method.<br><br>
 * Creates a new array with the elements that passed the test implemented in `callback`.<br>
 * Callbacks are run concurrently.<br>
 * @param {Array} array - Array to iterate over.
 * @param {Function} callback - Function to apply each item in `array`. Accepts three arguments: `currentValue`, `index` and `array`.
 * @param {Object} [thisArg] - Value to use as *this* when executing the `callback`.
 * @return {Promise} - Returns a Promise with the resultant filtered *Array* as value.
 */
exports.filter = (array, callback, thisArg) => {
  /* two loops are necessary in order to do the filtering concurrently
   * while keeping the order of the elements
   * (if you find a better way to do it please send a PR!)
   */
  return new Promise(async (resolve, reject) => {
    const promiseArray = [];
    for (let i = 0; i < array.length; i++) {
      if (i in array) {
        promiseArray[i] = Promise.resolve(array[i]).then((currentValue) => {
          return callback.call(thisArg || this, currentValue, i, array);
        }).catch(reject);
      }
    }
    const filteredArray = [];
    for (let i = 0; i < promiseArray.length; i++) {
      if (await promiseArray[i]) {
        filteredArray.push(await array[i]);
      }
    }
    resolve(filteredArray);
  });
};

/**
 * Same functionality as [`filter()`](global.html#filter), but runs only one callback at a time.
 * @param {Array} array - Array to iterate over.
 * @param {Function} callback - Function to apply each item in `array`. Accepts three arguments: `currentValue`, `index` and `array`.
 * @return {Promise} - Returns a Promise with the resultant filtered *Array* as value.
 */
exports.filterSeries = async (array, callback, thisArg) => {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (i in array && await callback.call(thisArg || this, await array[i], i, array)) {
      result.push(await array[i]);
    }
  }
  return result;
};

/**
 * Implements ES5 [`Array#reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) method.<br><br>
 * Applies a `callback` against an accumulator and each element in `array`.
 * @param {Array} array - Array to iterate over.
 * @param {Function} callback - Function to apply each item in `array`. Accepts four arguments: `accumulator`, `currentValue`, `currentIndex` and `array`.
 * @param {Object} [initialValue] - Used as first argument to the first call of `callback`.
 * @return {Promise} - Returns a Promise with the resultant value from the reduction.
 */
exports.reduce = async (array, callback, initialValue) => {
  if (array.length === 0 && initialValue === undefined) {
    throw TypeError('Reduce of empty array with no initial value');
  }
  let i;
  let previousValue;
  if (initialValue !== undefined) {
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
