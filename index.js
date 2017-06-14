const staticMethods = require('./lib/static-methods');
const instanceMethods = require('./lib/instance-methods');

module.exports = Object.assign(staticMethods, { instanceMethods });
