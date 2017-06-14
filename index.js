const staticMethods = require('./static-methods');
const instanceMethods = require('./instance-methods');

module.exports = Object.assign(staticMethods, { instanceMethods });
