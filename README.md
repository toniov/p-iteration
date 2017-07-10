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
const getSurname = require('nonexistent-module');

async function addSurnames () {
  // map passing an async function as callback
  const completeNames = await map(['Jolyne', 'Joseph', 'Caesar'], async (name) => {
    const surname = await getSurname(name);
    return name + surname;
  });
  // do some stuff
  return completeNames;
}

async function getSurnames () {
  // map passing a non-async function as callback that returns a Promise
  const surNames = await map(['Jolyne', 'Joseph', 'Caesar'], (name) => getSurname(name));
  // do some stuff
  return surNames; 
}

// ...
```

All methods return a Promise so they can just be used outside an async function just with plain Promises:

```js
const { map } = require('p-iteration');
const getSurname = require('nonexistent-module');

map(['Jolyne', 'Joseph', 'Caesar'], (name) => name + getSurname(name)).then((result) => {
  // ...
}).catch((error) => {
  // ...
});
```

If there is a Promise inside the array, it will be unwrapped before calling the callback:

```js
const { each } = require('p-iteration');
const getNameFromID = require('nonexistent-module');

async function logNames () {
  const names = [
    'Jolyne',
    getNameFromID(123), // returns a Promise
    'Caesar'
  ];
  await each(names, (name) => {
    console.log(name);
  });
}
```

```js
const { find } = require('p-iteration');
const getUserFromID = require('nonexistent-module');

// non-async function that just returns a Promise with the found user as value
function findUser (name) {
  const users = [
    getUserFromID(123), // returns a Promise
    { name: 'Jolyne', foo: 'bar' },
    { name: 'Caesar', foo: 'bar' }
  ];
  return find(users, (user) => user.name === name);
}
```

## API

The methods are implementations of the ES5 Array iteration methods we all know with the same syntax, but all return a `Promise`. Also, excepting `reduce`, all methods callbacks are run concurrently. There is a series version of each method, called: `${methodName}Series`, series methods use the same API that their respective concurrent ones.

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

Extending native objects is discouraged and I don't recommend it, but in case you know what you are doing, you can extend `Array.prototype` to use the above methods as instance methods. They have been renamed as `async${MethodName}` so the original ones are not overwritten.

```js
const { instanceMethods } = require('p-iteration');
const asyncCall = require('nonexistent-module');

Object.assign(Array.prototype, instanceMethods);

async function example () {
  const foo = await [1, 2, 3].asyncMap((num) => asyncCall(num));  
}
```


## License

MIT © [Antonio V](https://github.com/toniov)