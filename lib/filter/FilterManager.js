const { Filter, METHODS } = require("./Filter");

const FilterManager = function FilterManager(app) {
    this.filterChain = [];
    this.app = app;
};

function addFilter(filterRequest) {
    const that = this;
    const middlewares = filterRequest.middlewares;
    const options = filterRequest.options || {};
    options.caseSensetiveRouting = this.app ? this.app.get("case sensetive") : false;

    middlewares.forEach(middleware => {
        if (!middleware) {
            throw new TypeError("Provide a valid middleware function.");
        }

        if (typeof middleware === "function") {
            if (middleware.constructor.name !== "AsyncFunction") {
                throw new TypeError("Middleware function must be an async function.");
            } else {
                const path = filterRequest.path;
                const method = filterRequest.method;

                that.filterChain.push(new Filter({
                    path,
                    method,
                    middleware,
                    options
                }));
            }
        } else if (middleware instanceof FilterManager) {
            const router = middleware;

            router.filterChain.forEach(routerMiddleware => {
                const path = filterRequest.path + routerMiddleware.path;
                const routerOptions = Object.assign({}, options);
                routerOptions.global = routerOptions.global || routerMiddleware.options.global;

                that.filterChain.push(routerMiddleware.setNewPath({ path, options: routerOptions }));
            });
        } else {
            throw new TypeError("Provide a valid middleware function.");
        }
    });

    return this;
}

FilterManager.prototype.use = function use() {
    commonUse.call(this, null, ...arguments);
    return this;
};

METHODS.forEach(method => {
    FilterManager.prototype[method] = function () {
        commonUse.call(this, method, ...arguments);
        return this;
    };
});

function commonUse(method, path) {
    const filter = {
        method,
        options: {}
    };
    filter.path = "/";

    switch (typeof path) {
        case "string":
            filter.path = path;
            filter.middlewares = Array.prototype.slice.call(arguments, 2);
            break;
        case "function":
            filter.options.global = true;
            filter.middlewares = Array.prototype.slice.call(arguments, 1);
            break;
        default:
            if (path instanceof FilterManager) {
                filter.middlewares = Array.prototype.slice.call(arguments, 1);
                break;
            }
            throw new TypeError("There should be at least a middleware");

    }

    if (!filter.middlewares.length) {
        throw new TypeError("There should be at least a middleware");
    }

    addFilter.call(this, filter);
}

module.exports = FilterManager;