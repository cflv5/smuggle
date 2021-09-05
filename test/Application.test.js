const App = require("../lib/Application");
const FilterManager = require("../lib/filter/FilterManager");

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

test('should set external FilterManager to the app as a router', () => {
    // router
    const app = new App();

    async function api() {
        return {
            users: [
                {
                    name: "Name",
                    id: 1
                },
                {
                    id: 2
                }
            ]
        };
    }

    const manager = new FilterManager();

    expect(() => {
        manager.use(async function (req, res, next) {
            if (req.user) {
                return next();
            }
            res.redirect("/login");
        });
        manager.get("/all", async function (req, res, next) {
            const users = api();

            res.send(users);
        });

        app.use("/users", manager);
    }).not.toThrow();
});

test('should render ejs file and throw for non-existent file', () => {
    const app = new App({
        "lambda task root": "test",
        "functions root": ".",
        "function name": ".",
        view: {
            folder: "view",
            engine: require("ejs"),
            name: "ejs"
        }
    });

    expect(() => app.renderFile("index", { message: "Message" })).not.toThrow();
    expect(() => app.renderFile("non-existent-file", { message: "Message" })).toThrow();
});