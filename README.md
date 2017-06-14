# asyncitt

> Make array iteration easy with async/await

- Same functionality as the ES5 Array iteration methods
- All the methods return a `Promise`, making them awaitable
- Allow the usage of async functions as callback
- Callbacks run in parallel
- Lightweight (no prd dependencies)

## Install

```
$ npm install --save asyncitt
```

## Usage

```js
const { map } = require('asyncitt');

// map passing an async function as callback
const foo = await map([1, 2, 3], async (num) => {
  const result = await asyncCall();
  return num * result;
});

// map passing a non-async function as callback that returns a Promise
const bar = await map([1, 2, 3], (num) => asyncCall2(num));
```


## API

Check the [JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) for details about the API, they use the same syntax, but all return a `Promise`.

Excepting `reduce`, all methods callbacks are run in parallel. There is a series version of each method, called: `${methodName}Series`. Series methods use the same API that their respective parallel ones.

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
const { instanceMethods } = require('asyncitt');
Object.assign(Array.prototype, instanceMethods);

const foo = await [1, 2, 3].asyncMap((num) => asyncCall(num));
```

## License

MIT © [Antonio V](https://github.com/antonvs2)