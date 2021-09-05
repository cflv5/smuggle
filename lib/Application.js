const FilterManager = require("./filter/FilterManager");
const { resolve } = require("path");
const fs = require("fs");

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

App.prototype.renderFile = function renderFile(viewName, data, options) {
    const renderOptions = options || {};
    const view = this.get("view");

    checkViewProperty(view);

    renderOptions.filename = resolve(this.get("lambda task root"), this.get("functions root"), this.get("function name"),
        view.folder, viewName + "." + view.name);

    const file = fs.readFileSync(renderOptions.filename, "utf-8");
    
    return view.engine.render(file, data, renderOptions);
};

function checkViewProperty(view) {
    const cannotRenderWithoutObjectError =
        new TypeError(`Cannot render without view object. Please set view property as an object with following properties: name, engine, folder`);
    const cannotRequireDynamicallyError =
        new TypeError(`Cannot require view engine "${view}" dynamically. Please set view property as an object with following properties: name, engine, folder`);
    const missingViewPropertyError =
        new TypeError("Missing a property of view object. Please make sure view object has following properties: name, engine, folder");
    const viewObjectWrongTypeError = (type) =>
        new TypeError(`View has type ${type} but needs to be an object`);

    if (!view) {
        throw cannotRenderWithoutObjectError;
    }

    if (typeof view === "string") {
        throw cannotRequireDynamicallyError;
    } else if (typeof view === "object") {
        if (!view.engine || !view.name || !view.folder) {
            throw missingViewPropertyError;
        } else if (typeof view.engine === "string") {
            throw cannotRequireDynamicallyError;
        }
    } else {
        throw viewObjectWrongTypeError(typeof view);
    }
}

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