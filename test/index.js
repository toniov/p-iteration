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
  const err = await t.throws(forEach([2, 1, 3], (num, index, array) => {
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

test('map passing a non-async function that return a promise', async (t) => {
  const arr = await map([1, 2, 3], (num) => Promise.resolve(num * 2));
  t.deepEqual(arr, [2, 4, 6]);
});

test('map, throw inside callback', async function (t) {
  const err = await t.throws(map([2, 1, 3], (num, index, array) => {
    throw new Error('test');
  }));
  t.is(err.message, 'test');
});

test.cb('map used with promises in a non-async function', (t) => {
  map([1, 2, 3], async function (num, index, array) {
    await delay();
    return num * 2;
  }).then((result) => {
    t.deepEqual(result, [2, 4, 6]);
    t.end();
  });
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

test('reduce with initialValue', async (t) => {
  const sum = await reduce([1, 2, 3], async (accumulator, currentValue, index, array) => {
    await delay();
    t.is(array[index], currentValue);
    return accumulator + currentValue;
  }, 1);
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

test('asyncForEach', async (t) => {
  let total = 0;
  await asyncForEach.call([2, 1, 3], async (num, index, array) => {
    await delay(num * 100);
    t.is(array[index], num);
    total += num;
  });
  t.is(total, 6);
});
