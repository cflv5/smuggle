const FilterManager = require("../../lib/filter/FilterManager");

async function isLoggedIn(req, res, next) {
    if(!req.user) {
        return res.redirect("/login");
    } 
    next();
}

test('should set middleware handling get requests to root', () => {
    const manager = new FilterManager();

    expect(() => manager.get("/", async (req, res, next) => {
        next();
    })).not.toThrow();

    expect(manager.filterChain[manager.filterChain.length -1].method).toBe("get");
});

test('should set middleware for /path/:param', () => {
    const manager = new FilterManager();

    expect(() => manager.use("/path/:param", isLoggedIn, async function(req, res, next) {
        next();
    })).not.toThrow();
});