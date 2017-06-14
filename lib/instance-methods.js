const staticMethods = require('./static-methods');

Object.keys(staticMethods).forEach((methodName) => {
  const instaceMethodName = methodName.charAt(0).toUpperCase() + methodName.slice(1);
  exports[`async${instaceMethodName}`] = async function (...args) {
    return staticMethods[methodName](this, ...args);
  };
});
