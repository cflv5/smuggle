const Request = require("../lib/Request");

const event = require("./event.json");

const request = new Request(event);

test('should create request', () => {
    expect(request.cookies).toEqual({ sessionId: "AS2s45sshbutUsIfnbbmdi" });
    expect(request.secure).toBe(true);
    expect(request.protocol).toBe("https");
    expect(request.query).toEqual({name1: ["value1", "value2"], name2: "value"});
    expect(request.ips).toEqual(["123.123.123.123", "123.123.123.123"]);
    expect(request.ip).toBe("123.123.123.123");
});

test('should accepts html and xml types rejects json', () => {
    expect(request.accepts("html", "application/xml")).toBe("html");
    expect(request.accepts(["application/xml"])).toBe("application/xml");
    expect(request.accepts("json")).toBe(false);
});

test('should accepts tr and en-US languages rejecets fr', () => {
    expect(request.acceptLanguages("tr")).toBe("tr");
    expect(request.acceptLanguages("en-US")).toBe("en-US");
    expect(request.acceptLanguages("fr")).toBe(false);
});

test('should accepts gzip encoding', () => {
    expect(request.acceptsEncodings("gzip", "br")).toBe("br");
    expect(request.acceptsEncodings("gzip")).toBe("gzip");
});

test('should get header fields of incoming request', () => {
    expect(request.get("host")).toBe("hostname");
    expect(request.get("cookie")).toBe("sessionId=AS2s45sshbutUsIfnbbmdi");
});