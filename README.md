# p-iteration [![Build Status](https://travis-ci.org/toniov/p-iteration.svg?branch=master)](https://travis-ci.org/toniov/p-iteration)

> Make array iteration easy with async/await and promises

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

All methods return a promise so they can just be used outside an async function:

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
const { each, find } = require('p-iteration');
const { getNameFromID, getUserFromID } = require('nonexistent-module');

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

// this function is not async, but just returns a promise with the found user
function findUser (name) {
  const users = [
    getUserFromID(123), // returns a Promise
    { name: 'Jolyne', foo: 'bar' },
    { name: 'Caesar', foo: 'bar' }
  ];
  return find(users, (user) => user.name === name);
}

// ...

```


## API

Check the [JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) for details about the API, they use the same syntax, but all return a `Promise`.

Excepting `reduce`, all methods callbacks are run concurrently. There is a series version of each method, called: `${methodName}Series`. Series methods use the same API that their respective concurrent ones.

### forEach(array, callback, [thisArg])
[docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)

### map(array, callback, [thisArg])
[docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

### find(array, callback, [thisArg])
[docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)

### findIndex(array, callback, [thisArg])
[docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)

### some(array, callback, [thisArg])
[docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)

### every(array, callback, [thisArg])
[docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)

### filter(array, callback, [thisArg])
[docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

### reduce(array, callback, [initialValue])
[docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)


## Instance methods

Extending native objects is discouraged and I don't recommend it, but in case you know what you are doing, you can extend `Array.prototype` to use the above methods as instance methods. They have been renamed as `async${MethodName}` so the original ones are not overwritten.

```js
const { instanceMethods } = require('p-iteration');
Object.assign(Array.prototype, instanceMethods);

async function example () {
  const foo = await [1, 2, 3].asyncMap((num) => asyncCall(num));  
}
```


## License

MIT © [Antonio V](https://github.com/toniov)