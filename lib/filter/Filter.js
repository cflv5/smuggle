const { pathToRegexp} = require("path-to-regexp");

const Filter = function Filter(filter) {
    const filterOptions = filter.options || {};

    this.path = filter.path || "/";
    this.middleware = filter.middleware;
    this.method = filter.method;
    this.keys = [];

    this.options = {
        global: filterOptions.global
    };

    this.regex = pathToRegexp(filter.path, this.keys, {sensetive: filterOptions.caseSensetiveRouting});
};

module.exports = Filter;