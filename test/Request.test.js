const Request = require("../lib/Request");

const event = require("./event.json");

test('should create request', () => {
    const request = new Request(event);

    expect(request.cookies).toEqual({ sessionId: "AS2s45sshbutUsIfnbbmdi" });
    expect(request.secure).toBe(true);
    expect(request.protocol).toBe("https");
    expect(request.query).toEqual({name1: ["value1", "value2"], name2: "value"});
});