const App = require("../lib/Application");

test('should create app instance with options', () => {
    function decode(str) {
        return str;
    }
    const app = new App({
        view: "ejs",
        "decode fn": decode,
        dBConnectionURI: "connect://db:2121?dev"
    });

    expect(app.settings.view).toEqual("ejs");
    expect(app.settings["decode fn"]).toEqual(decode);
    expect(app.settings.dBConnectionURI).toEqual("connect://db:2121?dev");
});

test('should set and get setting', () => {
    const app = new App();

    app.set("view", "ejs");
    app.set("case sensitive", false);

    expect(app.get("view")).toBe("ejs");
    expect(app.get("case sensitive")).toBe(false);
});

test('should set up middleware for /', () => {
    const app = new App();

    expect(() => {
        app.use("/", async function (req, res, next) {
            next();
        });
    }).not.toThrow();
});

test('should throw as middleware is not async', () => {
    const app = new App();

    expect(() => {
        app.use("/path", function (req, res, next) {
            next();
        });
    }).toThrow(new TypeError("Middleware function must be an async function."));
});

test('should get a global middleware as path is omitted', () => {
    const app = new App();
    const appFilterChain = app.fiterManager.filterChain;

    expect(() => {
        app.use(async function (req, res, next) {
            next();
        });
    }).not.toThrow();

    expect(appFilterChain[appFilterChain.length - 1].options.global).toBe(true);
});

test('should throw as no middleware is specified', () => {
    const app = new App();

    expect(() => app.use("/")).toThrow(new TypeError("There should be at least a middleware"));
});