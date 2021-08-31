const FilterManager = require("./filter/FilterManager");

const App = function Application(options) {
    this.settings = {};
    setOptions.call(this, options);

    this.fiterManager = new FilterManager();
};

App.prototype.set = function set(name, setting) {
    const settingName = String(name);
    this.settings[settingName] = setting;

    return this;
};

App.prototype.get = function get(field) {
    return this.settings[field];
};

/**
 * @param {String} path 
 */
App.prototype.use = function use(path) {
    const filter = {
        options: {
            caseSensetiveRouting: this.get("case sensetive")
        }
    };
    filter.path = "/";

    switch (typeof path) {
        case "string":
            filter.path = path;
            filter.middlewares = Array.prototype.slice.call(arguments, 1);
            break;
        case "function":
            filter.options.global = true;
            filter.middlewares = [...arguments];
            break;
        default:
            throw new TypeError("There should be at least a middleware");
    }

    if(!filter.middlewares.length) {
        throw new TypeError("There should be at least a middleware");
    }

    this.fiterManager.addFilter(filter);

    return this;
};

function setOptions(options) {
    if (options) {
        for (const option in options) {
            if (Object.hasOwnProperty.call(options, option)) {
                this.set(option, options[option]);
            }
        }
    }
}

module.exports = App;