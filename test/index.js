'use strict';

const test = require('ava');
const { forEach, map, find, findIndex, some, every, filter, reduce } = require('../');
const { asyncForEach } = require('../').instanceMethods;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms || 0));

test('forEach, check callbacks are run in parallel', async (t) => {
  let total = 0;
  const parallelCheck = [];
  await forEach([2, 1, 3], async (num, index, array) => {
    await delay(num * 100);
    t.is(array[index], num);
    parallelCheck.push(num);
    total += num;
  });
  t.deepEqual(parallelCheck, [1, 2, 3]);
  t.is(total, 6);
});

test('forEach passing a non-async function', async (t) => {
  let total = 0;
  await forEach([2, 1, 3], (num, index, array) => {
    t.is(array[index], num);
    total += num;
  });
  t.is(total, 6);
});

test('forEach unwraps Promises in the array', async (t) => {
  let total = 0;
  await forEach([2, Promise.resolve(1), 3], async (num, index, array) => {
    t.is(await Promise.resolve(array[index]), num);
    total += num;
  });
  t.is(total, 6);
});

test('forEach, check this with arrow callback function', async function (t) {
  let total = 0;
  this.test = 'test';
  await forEach([2, 1, 3], (num, index, array) => {
    t.is(this.test, 'test');
    t.is(array[index], num);
    total += num;
  });
  t.is(total, 6);
});

test('forEach, throw inside callback', async function (t) {
  const err = await t.throws(forEach([2, 1, 3], () => {
    throw new Error('test');
  }));
  t.is(err.message, 'test');
});

test('forEach using thisArg', async (t) => {
  let total = 0;
  const testObj = { test: 1 };
  await forEach([1, 2, 3], async function (num, index, array) {
    await delay();
    t.is(array[index], num);
    t.deepEqual(this, testObj);
    total += num;
  }, testObj);
  t.is(total, 6);
});

test.cb('forEach used with promises in a non-async function', (t) => {
  let total = 0;
  forEach([1, 2, 3], async function (num, index, array) {
    await delay();
    t.is(array[index], num);
    total += num;
  }).then(() => {
    t.is(total, 6);
    t.end();
  });
});

test('forEach should not execute any callback if array is empty', async (t) => {
  let count = 0;
  await forEach([], async () => {
    await delay();
    count++;
  });
  t.is(count, 0);
});

test('map, check callbacks are run in parallel', async (t) => {
  const parallelCheck = [];
  const arr = await map([3, 1, 2], async (num, index, array) => {
    await delay(num * 100);
    t.is(array[index], num);
    parallelCheck.push(num);
    return num * 2;
  });
  t.deepEqual(arr, [6, 2, 4]);
  t.deepEqual(parallelCheck, [1, 2, 3]);
});

test('map unwraps Promises in the array', async (t) => {
  const arr = await map([2, Promise.resolve(1), 3], async (num, index, array) => {
    t.is(await Promise.resolve(array[index]), num);
    return num * 2;
  });
  t.deepEqual(arr, [4, 2, 6]);
});


test('map passing a non-async function that return a promise', async (t) => {
  const arr = await map([1, 2, 3], (num) => Promise.resolve(num * 2));
  t.deepEqual(arr, [2, 4, 6]);
});

test('map, throw inside callback', async function (t) {
  const err = await t.throws(map([2, 1, 3], () => {
    throw new Error('test');
  }));
  t.is(err.message, 'test');
});

test.cb('map used with promises in a non-async function', (t) => {
  map([1, 2, 3], async function (num) {
    await delay();
    return num * 2;
  }).then((result) => {
    t.deepEqual(result, [2, 4, 6]);
    t.end();
  });
});

test('map should return an empty array if passed array is empty', async (t) => {
  const count = 0;
  const arr = await map([], async () => {
    await delay();
    return 3;
  });
  t.deepEqual(arr, []);
  t.deepEqual(count, 0);
});

test('find', async (t) => {
  const foundNum = await find([1, 2, 3], async (num, index, array) => {
    await delay();
    t.is(array[index], num);
    if (num === 2) {
      return true;
    }
  });
  t.is(foundNum, 2);
});


test('find returns undefined if did not find anything', async (t) => {
  const foundNum = await find([1, 2], async () => {
    await delay();
    return false;
  });
  t.is(foundNum, undefined);
});

test('find returns undefined if array is empty', async (t) => {
  const foundNum = await find([], async () => {
    await delay();
    return false;
  });
  t.is(foundNum, undefined);
});

test('find unwraps Promises in the array', async (t) => {
  const foundNum = await find([1, Promise.resolve(2), 3], async (num, index, array) => {
    await delay();
    t.is(await Promise.resolve(array[index]), num);
    if (num === 2) {
      return true;
    }
  });
  t.is(foundNum, 2);
});

test('find passing a non-async callback', async (t) => {
  const foundNum = await find([1, 2, 3], (num, index, array) => {
    t.is(array[index], num);
    if (num === 2) {
      return true;
    }
  });
  t.is(foundNum, 2);
});

test('findIndex', async (t) => {
  const foundIndex = await findIndex([1, 2, 3], async (num, index, array) => {
    await delay();
    t.is(array[index], num);
    if (num === 2) {
      return true;
    }
  });
  t.is(foundIndex, 1);
});

test('findIndex returns -1 if did not find anything', async (t) => {
  const notFound = await findIndex([1, 2], async () => {
    await delay();
    return false;
  });
  t.is(notFound, -1);
});

test('findIndex returns -1 if array is empty', async (t) => {
  const notFound = await findIndex([], async () => {
    await delay();
    return false;
  });
  t.is(notFound, -1);
});

test('findIndex unwraps Promises in the array', async (t) => {
  const foundIndex = await findIndex([Promise.resolve(1), 2, 3], async (num, index, array) => {
    await delay();
    t.is(await Promise.resolve(array[index]), num);
    if (num === 2) {
      return true;
    }
  });
  t.is(foundIndex, 1);
});

test('some', async (t) => {
  const isIncluded = await some([1, 2, 3], async (num, index, array) => {
    await delay();
    t.is(array[index], num);
    if (num === 3) {
      return true;
    }
  });
  t.true(isIncluded);
});

test('some unwraps Promises in the array', async (t) => {
  const isIncluded = await some([1, Promise.resolve(2), 3], async (num, index, array) => {
    await delay();
    t.is(await Promise.resolve(array[index]), num);
    if (num === 3) {
      return true;
    }
  });
  t.true(isIncluded);
});

test('some passing a non-async callback', async (t) => {
  const isIncluded = await some([1, 2, 3], (num, index, array) => {
    t.is(array[index], num);
    if (num === 3) {
      return true;
    }
  });
  t.true(isIncluded);
});

test('some (return false)', async (t) => {
  const isIncluded = await some([1, 2, 3], async (num, index, array) => {
    await delay();
    t.is(array[index], num);
    if (num === 4) {
      return true;
    }
  });
  t.false(isIncluded);
});

test('some with empty array should return false', async (t) => {
  const isIncluded = await some([], async () => {
    await delay();
    return false;
  });
  t.false(isIncluded);
});

test('every', async (t) => {
  const allIncluded = await every([1, 2, 3], async (num, index, array) => {
    await delay();
    t.is(array[index], num);
    if (typeof num === 'number') {
      return true;
    }
  });
  t.true(allIncluded);
});

test('every unwraps Promises in the array', async (t) => {
  const allIncluded = await every([Promise.resolve(1), 2, 3], async (num, index, array) => {
    await delay();
    t.is(await Promise.resolve(array[index]), num);
    if (typeof num === 'number') {
      return true;
    }
  });
  t.true(allIncluded);
});

test('every passing a non-async callback', async (t) => {
  const allIncluded = await every([1, 2, 3], (num, index, array) => {
    t.is(array[index], num);
    if (typeof num === 'number') {
      return true;
    }
  });
  t.true(allIncluded);
});

test('every (return false)', async (t) => {
  const allIncluded = await every([1, 2, '3'], async (num, index, array) => {
    await delay();
    t.is(array[index], num);
    if (typeof num === 'number') {
      return true;
    }
  });
  t.false(allIncluded);
});

test('every with empty array should return true', async (t) => {
  const allIncluded = await every([], async () => {
    await delay();
    return false;
  });
  t.true(allIncluded);
});

test('filter, check callbacks are run in parallel', async (t) => {
  const parallelCheck = [];
  const numbers = await filter([2, 1, '3'], async (num, index, array) => {
    await delay(num * 100);
    t.is(array[index], num);
    if (typeof num === 'number') {
      parallelCheck.push(num);
      return true;
    }
  });
  t.deepEqual(parallelCheck, [1, 2]);
  t.deepEqual(numbers, [2, 1]);
});

test('filter unwraps Promises in the array', async (t) => {
  const parallelCheck = [];
  const numbers = await filter([Promise.resolve(2), 1, '3'], async (num, index, array) => {
    await delay(num * 100);
    t.is(await Promise.resolve(array[index]), num);
    if (typeof num === 'number') {
      parallelCheck.push(num);
      return true;
    }
  });
  t.deepEqual(parallelCheck, [1, 2]);
  t.deepEqual(numbers, [2, 1]);
});

test('reduce with initialValue', async (t) => {
  const sum = await reduce([1, 2, 3], async (accumulator, currentValue, index, array) => {
    await delay();
    t.is(array[index], currentValue);
    return accumulator + currentValue;
  }, 1);
  t.is(sum, 7);
});

test('filter should return an empty array if passed array is empty', async (t) => {
  let count = 0;
  const empty = await filter([], async () => {
    await delay();
    count++;
    return true;
  });
  t.deepEqual(count, 0);
  t.deepEqual(empty, []);
});

test('reduce unwrap Promises in the array', async (t) => {
  const sum = await reduce([Promise.resolve(1), 2, 3], async (accumulator, currentValue, index, array) => {
    await delay();
    t.is(await Promise.resolve(array[index]), currentValue);
    return accumulator + currentValue;
  }, 1);
  t.is(sum, 7);
});

test('reduce unwrap Promises in the initialValue', async (t) => {
  const sum = await reduce([1, 2, 3], async (accumulator, currentValue, index, array) => {
    await delay();
    t.is(await Promise.resolve(array[index]), currentValue);
    return accumulator + currentValue;
  }, Promise.resolve(1));
  t.is(sum, 7);
});

test('reduce without initialValue', async (t) => {
  const sum = await reduce([1, 2, 3], async (accumulator, currentValue, index, array) => {
    await delay();
    t.is(array[index], currentValue);
    return accumulator + currentValue;
  });
  t.is(sum, 6);
});

test('reduce of array with two elements without initialValue', async (t) => {
  const sum = await reduce([1, 2], async (accumulator, currentValue, index, array) => {
    await delay();
    t.is(array[index], currentValue);
    return accumulator + currentValue;
  });
  t.is(sum, 3);
});


test('reduce of empty array without initialValue should throw TypeError', async (t) => {
  const err = await t.throws(
    reduce([], async (accumulator, currentValue) => {
      await delay();
      return accumulator + currentValue;
    })
  );
  t.is(err.name, 'TypeError');
  t.is(err.message, 'Reduce of empty array with no initial value');
});

test('reduce of empty array with initialValue should return initialValue', async (t) => {
  let count = 0;
  const sum = await reduce([], async (accumulator, currentValue) => {
    await delay();
    count++;
    return accumulator + currentValue;
  }, 6);
  t.is(count, 0);
  t.is(sum, 6);
});

test('reduce of array with one element and no initialValue should return that element', async (t) => {
  let count = 0;
  const sum = await reduce([6], async (accumulator, currentValue) => {
    await delay();
    count++;
    return accumulator + currentValue;
  });
  t.is(count, 0);
  t.is(sum, 6);
});

test('asyncForEach', async (t) => {
  let total = 0;
  await asyncForEach.call([2, 1, 3], async (num, index, array) => {
    await delay(num * 100);
    t.is(array[index], num);
    total += num;
  });
  t.is(total, 6);
});
