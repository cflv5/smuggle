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