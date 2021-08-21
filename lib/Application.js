const App = function Application(options) {
    this.settings = {};

    setOptions.call(this, options);
};

App.prototype.set = function set(name, setting) {
    const settingName = String(name);
    this.settings[settingName] = setting;

    return this;
};

App.prototype.get = function get(field) {
    return this.settings[field];
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