const { pathToRegexp } = require("path-to-regexp");

const METHODS = ["get", "post", "put", "delete"];
module.exports.METHODS = METHODS;

const Filter = function Filter(filter) {
    const filterOptions = filter.options || {};

    this.path = filter.path || "/";
    this.middleware = filter.middleware;
    setMethod.call(this, filter.method);
    this.keys = [];

    this.options = {
        global: filterOptions.global
    };

    this.regex = pathToRegexp(filter.path, this.keys, { sensetive: filterOptions.caseSensetiveRouting });
};

Filter.prototype.setNewPath = function setNewPath(newPath) {
    this.path = newPath.path || "/";
    this.options.global = newPath.options.global;
    this.keys = [];

    this.regex = pathToRegexp(this.path, this.keys, { sensitive: newPath.options.caseSensetiveRouting });

    return this;
};

function setMethod(method) {
    if (method) {
        if (METHODS.includes(method)) {
            this.method = method;
        } else {
            throw TypeError(`Unknown method "${method}"`);
        }
    }
}

module.exports.Filter = Filter;