# p-iteration [![Build Status](https://travis-ci.org/toniov/p-iteration.svg?branch=master)](https://travis-ci.org/toniov/p-iteration) [![NPM version](https://badge.fury.io/js/p-iteration.svg)](http://badge.fury.io/js/p-iteration)


> Make array iteration easy when using async/await and promises

- Same functionality as the ES5 Array iteration methods we all know
- All the methods return a `Promise`, making them awaitable and thenable
- Allow the usage of async functions as callback
- Callbacks run concurrently
- Lightweight (no prd dependencies)


## Install

```
$ npm install --save p-iteration
```


## Usage

Smooth asynchronous iteration using `async/await`:

```js
const { map } = require('p-iteration');

// map passing an async function as callback
function getUsers (userIds) {
  return map(userIds, async userId => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  });
}

// map passing a non-async function as callback
async function getRawResponses (userIds) {
  const responses = await map(userIds, userId => fetch(`/api/users/${userId}`));
  // ... do some stuff
  return responses;
}

// ...
```

```js
const { filter } = require('p-iteration');

async function getFilteredUsers (userIds, name) {
  const filteredUsers = await filter(userIds, async userId => {
    const response = await fetch(`/api/users/${userId}`);
    const user = await response.json();
    return user.name === name;
  });
  // ... do some stuff
  return filteredUsers;
}

// ...
```

All methods return a Promise so they can just be used outside an async function just with plain Promises:

```js
const { map } = require('p-iteration');

map([123, 125, 156], (userId) => fetch(`/api/users/${userId}`))
  .then((result) => {
    // ...
  })
  .catch((error) => {
    // ...
  });
```

If there is a Promise in the array, it will be unwrapped before calling the callback:

```js
const { forEach } = require('p-iteration');
const fetchJSON = require('nonexistent-module');

function logUsers () {
  const users = [
    fetchJSON('/api/users/125'), // returns a Promise
    { userId: 123, name: 'Jolyne', age: 19 },
    { userId: 156, name: 'Caesar', age: 20 }
  ];
  return forEach(users, (user) => {
    console.log(user);
  });
}
```

```js
const { find } = require('p-iteration');
const fetchJSON = require('nonexistent-module');

function findUser (name) {
  const users = [
    fetchJSON('/api/users/125'), // returns a Promise
    { userId: 123, name: 'Jolyne', age: 19 },
    { userId: 156, name: 'Caesar', age: 20 }
  ];
  return find(users, (user) => user.name === name);
}
```

The callback will be invoked as soon as the Promise is unwrapped:

```js
const { forEach } = require('p-iteration');

// function that returns a Promise resolved after 'ms' passed
const delay = (ms) => new Promise(resolve => setTimeout(() => resolve(ms), ms));

// 100, 200, 300 and 500 will be logged in this order
async function logNumbers () {
  const numbers = [
    delay(500),
    delay(200),
    delay(300),
    100
  ];
  await forEach(numbers, (number) => {
    console.log(number);
  });
}
```

## API

The methods are implementations of the ES5 Array iteration methods we all know with the same syntax, but all return a `Promise`. Also, with the exception of `reduce()`, all methods callbacks are run concurrently. There is a series version of each method, called: `${methodName}Series`, series methods use the same API that their respective concurrent ones.

There is a link to the [original reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) of each method in the docs of this module:

- [`forEach`(array, callback, [thisArg])](https://toniov.github.io/p-iteration/global.html#forEach)

- [`forEachSeries`(array, callback, [thisArg])](https://toniov.github.io/p-iteration/global.html#forEachSeries)

- [`map`(array, callback, [thisArg])](https://toniov.github.io/p-iteration/global.html#map)

- [`mapSeries`(array, callback, [thisArg])](https://toniov.github.io/p-iteration/global.html#mapSeries)

- [`find`(array, callback, [thisArg])](https://toniov.github.io/p-iteration/global.html#find)

- [`findSeries`(array, callback, [thisArg])](https://toniov.github.io/p-iteration/global.html#findSeries)

- [`findIndex`(array, callback, [thisArg])](https://toniov.github.io/p-iteration/global.html#findIndex)

- [`findIndexSeries`(array, callback, [thisArg])](https://toniov.github.io/p-iteration/global.html#findIndexSeries)

- [`some`(array, callback, [thisArg])](https://toniov.github.io/p-iteration/global.html#some)

- [`someSeries`(array, callback, [thisArg])](https://toniov.github.io/p-iteration/global.html#someSeries)

- [`every`(array, callback, [thisArg])](https://toniov.github.io/p-iteration/global.html#every)

- [`everySeries`(array, callback, [thisArg])](https://toniov.github.io/p-iteration/global.html#everySeries)

- [`filter`(array, callback, [thisArg])](https://toniov.github.io/p-iteration/global.html#filter)

- [`filterSeries`(array, callback, [thisArg])](https://toniov.github.io/p-iteration/global.html#filterSeries)

- [`reduce`(array, callback, [initialValue])](https://toniov.github.io/p-iteration/global.html#reduce)


## Instance methods

Extending native objects is discouraged and I don't recommend it, but in case you know what you are doing, you can extend `Array.prototype` to use the above methods as instance methods. They have been renamed as `async${MethodName}`, so the original ones are not overwritten.

```js
const { instanceMethods } = require('p-iteration');

Object.assign(Array.prototype, instanceMethods);

async function example () {
  const foo = await [1, 2, 3].asyncMap((id) => fetch(`/api/example/${id}`));
}
```


## License

MIT © [Antonio V](https://github.com/toniov)