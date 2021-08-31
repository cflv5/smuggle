const Filter = require("./Filter");

const FilterManager = function FilterManager() {
    this.filterChain = [];
};

FilterManager.prototype.addFilter = function addFilter(filterRequest) {
    const that = this;
    const path = filterRequest.path;
    const method = filterRequest.method;
    const options = filterRequest.options;

    const middlewares = filterRequest.middlewares;

    middlewares.forEach(middleware => {
        if (!middleware) {
            throw new TypeError("Provide a valid middleware function.");
        }

        if (middleware.constructor.name !== "AsyncFunction") {
            throw new TypeError("Middleware function must be an async function.");
        }

        that.filterChain.push(new Filter({
            path,
            method,
            middleware,
            options
        }));
    });

    return this;
};

module.exports = FilterManager;