'use strict';

const test = require('ava');
const async = require('../');
const { asyncForEach } = async.instanceMethods;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms || 0));

test('forEach is run in parallel', async (t) => {
  let total = 0;
  const parallelCheck = [];
  await async.forEach([2, 1, 3], async (num, index, array) => {
    await delay(num * 100);
    t.is(array[index], num);
    parallelCheck.push(num);
    total += num;
  });
  t.deepEqual(parallelCheck, [1, 2, 3]);
  t.is(total, 6);
});

test('forEach using thisArg', async (t) => {
  let total = 0;
  const testObj = { test: 1 };
  await async.forEach([1, 2, 3], async function (num, index, array) {
    await delay();
    t.is(array[index], num);
    t.deepEqual(this, testObj);
    total += num;
  }, testObj);
  t.is(total, 6);
});

test('map is run in parallel', async (t) => {
  const parallelCheck = [];
  const arr = await async.map([3, 1, 2], async (num, index, array) => {
    await delay(num * 100);
    t.is(array[index], num);
    parallelCheck.push(num);
    return num * 2;
  });
  t.deepEqual(arr, [6, 2, 4]);
  t.deepEqual(parallelCheck, [1, 2, 3])
});

test('find', async (t) => {
  const foundNum = await async.find([1, 2, 3], async (num, index, array) => {
    await delay();
    t.is(array[index], num);
    if (num === 2) {
      return true;
    };
  });
  t.is(foundNum, 2);
});

test('findIndex', async (t) => {
  const foundIndex = await async.findIndex([1, 2, 3], async (num, index, array) => {
    await delay();
    t.is(array[index], num);
    if (num === 2) {
      return true;
    };
  });
  t.is(foundIndex, 1);
});

test('some', async (t) => {
  const isIncluded = await async.some([1, 2, 3], async (num, index, array) => {
    await delay();
    t.is(array[index], num);
    if (num === 3) {
      return true;
    };
  });
  t.true(isIncluded);
});

test('some (return false)', async (t) => {
  const isIncluded = await async.some([1, 2, 3], async (num, index, array) => {
    await delay();
    t.is(array[index], num);
    if (num === 4) {
      return true;
    };
  });
  t.false(isIncluded);
});

test('every', async (t) => {
  const allIncluded = await async.every([1, 2, 3], async (num, index, array) => {
    await delay();
    t.is(array[index], num);
    if (typeof num === 'number') {
      return true;
    };
  });
  t.true(allIncluded);
});

test('every (return false)', async (t) => {
  const allIncluded = await async.every([1, 2, '3'], async (num, index, array) => {
    await delay();
    t.is(array[index], num);
    if (typeof num === 'number') {
      return true;
    };
  });
  t.false(allIncluded);
});

test('filter is run in parallel', async (t) => {
  const parallelCheck = [];
  const numbers = await async.filter([2, 1, '3'], async (num, index, array) => {
    await delay(num * 100);
    t.is(array[index], num);
    if (typeof num === 'number') {
      parallelCheck.push(num);
      return true;
    };
  });
  t.deepEqual(parallelCheck, [1, 2]);
  t.deepEqual(numbers, [2, 1]);
});

test('reduce with initialValue', async (t) => {
  const sum = await async.reduce([1, 2, 3], async (accumulator, currentValue, index, array) => {
    await delay();
    t.is(array[index], currentValue);
    return accumulator + currentValue;
  }, 1);
  t.is(sum, 7);
});

test('reduce without initialValue', async (t) => {
  const sum = await async.reduce([1, 2, 3], async (accumulator, currentValue, index, array) => {
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
