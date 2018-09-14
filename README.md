# p-iteration-with-concurrency


> Make array iteration easy when using async/await and promises

- Same functionality as the ES5 Array iteration methods we all know
- All the methods return a `Promise`, making them awaitable and thenable
- Allow the usage of async functions as callback
- Callbacks run concurrently
- Lightweight (no prd dependencies)


## Install

```
$ npm install --save p-iteration-with-concurrency
```


## Usage

Smooth asynchronous iteration using `async/await`:

```js
const { map } = require('p-iteration-with-concurrency');

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
const { filter } = require('p-iteration-with-concurrency');

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
const { map } = require('p-iteration-with-concurrency');

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
const { forEach } = require('p-iteration-with-concurrency');
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
const { find } = require('p-iteration-with-concurrency');
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
const { forEach } = require('p-iteration-with-concurrency');

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