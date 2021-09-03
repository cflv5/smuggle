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

App.prototype.use = function use(path) {
    this.fiterManager.use(...arguments);
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