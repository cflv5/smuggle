const Response = require("../lib/Response");

test("creating a response object", () => {
    const response = new Response();

    expect(response).toEqual({
        headers: {}, 
        multiValueHeaders: {},
        body: "",
        statusCode: null,
        base64Encoded: false,
        statusDescription: ""
    });
});

test("setting status of a response", () => {
    const response = new Response();

    response.setStatus(402);

    expect(response.getStatus()).toBe(402);
});

test("setting base64 encoding of a response", () => {
    const response = new Response();

    response.setBase64Encoded(true);

    expect(response.isBase64Encoded()).toBe(true);
});

test("setting status description of a response", () => {
    const response = new Response();

    response.setStatusDescription("this is the status description of the response");

    expect(response.getStatusDescription()).toBe("this is the status description of the response");
});

test("setting header value to a response using set function", () => {
    const response = new Response();

    expect(() => response.set("X-JEST-HEADER", "JEST &123456")).not.toThrow();
    expect(() => response.set("X-JEST-HEADER_2", ["JEST &123456", "JEST value"])).not.toThrow();
    expect(() => response.set({
        "X-JEST-HEADER_3": "JEST HEADER_VALUE",
        "X-JEST-HEADER_4": "JEST HEADER_VALUE"
    })).not.toThrow();
});

test("using set function with insufficient parameters", () => {
    const response = new Response();

    expect(() => response.set()).toThrow(SyntaxError);
    expect(() => response.set("not an object")).toThrow(new TypeError("value must be present"));
    expect(() => response.set("X-JEST-HEADER", null)).toThrow(new TypeError("value must be present"));
});

test("getting a header value", () => {
    const response = new Response();

    expect(() => response.set("X-JEST-HEADER", "JEST &123456")).not.toThrow();
    expect(response.get("X-JEST-HEADER")).toBe("JEST &123456");
    
    expect(response.get()).toBe(undefined);

    expect(() => response.set("X-JEST-HEADER", ["JEST &123456"])).not.toThrow();
    expect(Array.isArray(response.get("X-JEST-HEADER"))).toBe(true);
});

test("using header function to set and get a header", () => {
    const response = new Response();

    expect(() => response.header("X-JEST-HEADER", "JEST &123456")).not.toThrow();
    expect(response.header("X-JEST-HEADER")).toBe("JEST &123456");
});

test("removing header from a response", () => {
    const response = new Response();

    expect(() => response.header("X-JEST-HEADER", "JEST &123456")).not.toThrow();
    expect(() => response.removeHeader("X-JEST-HEADER")).not.toThrow();
    expect(response.get("X-JEST-HEADER")).toBe(undefined);
    
    expect(() => response.header("X-JEST-MULTI-HEADER", ["JEST &123456"])).not.toThrow();
    expect(() => response.removeMultiValueHeader("X-JEST-MULTI-HEADER")).not.toThrow();
    expect(response.get("X-JEST-MULTI-HEADER")).toBe(undefined);
});

test("set content type using setContentType", () => {
    const response = new Response();

    expect(() => response.setContentType("pdf")).not.toThrow();
    expect(response.get("Content-Type")).toBe("application/pdf");
});