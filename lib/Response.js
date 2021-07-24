const mime = require("mime");
const cookie = require("cookie");
const httpStatus = require("http-status");

function Response(app) {
    this.app = app;
    this.headers = {};
    this.multiValueHeaders = {};
    this.body = "";
    this.statusCode = null;
    this.base64Encoded = false;
    this.statusDescription = "";
}

Response.prototype.setStatus = function setStatus(code) {
    try {
        this.statusCode = Number.parseInt(code);
    } catch (error) {
        throw new TypeError("Status code must be a numeric value.");
    }

    return this;
};

Response.prototype.getStatus = function getStatus() {
    return this.statusCode;
};

Response.prototype.setBase64Encoded = function setEncoding(isBase64Encoded) {
    if (isBase64Encoded && typeof (isBase64Encoded) === "boolean") {
        this.base64Encoded = isBase64Encoded;
    } else {
        throw new TypeError("'isBase64Encoded' must be a boolean value");
    }

    return this;
};

Response.prototype.isBase64Encoded = function isBase64Encoded() {
    return this.base64Encoded;
};

Response.prototype.setStatusDescription = function setStatusDescription(description) {
    this.statusDescription = String(description);
    return this;
};

Response.prototype.getStatusDescription = function getStatusDescription() {
    return this.statusDescription;
};

Response.prototype.set = function set(field, value) {
    if (arguments.length < 1 || !field) {
        throw new SyntaxError("field must be present.");
    }

    if (arguments.length === 1 && typeof (field) === "object") {
        for (const key in field) {
            setHeader.call(this, key, field[key]);
        }
    } else if (field && value) {
        setHeader.call(this, field, value);
    } else {
        throw new TypeError("value must be present");
    }

    return this;
};

Response.prototype.header = function header(field, value) {
    if (field && !value) {
        return this.get(field);
    } else {
        this.set(...arguments);
    }

    return this;
};

Response.prototype.get = function get(field) {
    return this.multiValueHeaders[field] ? this.multiValueHeaders[field] : this.headers[field];
};

Response.prototype.removeHeader = function removeHeader(field) {
    delete this.headers[field];
    return this;
};

Response.prototype.removeMultiValueHeader = function removeMultiValueHeader(field) {
    delete this.multiValueHeaders[field];
    return this;
};

Response.prototype.setContentType = function setContentType(type) {
    const contentType = type.indexOf('/') === -1 ? mime.getType(type) : type;
    this.set('Content-Type', contentType);
};

Response.prototype.send = function send(body) {
    let responseBody = body;
    switch (typeof responseBody) {
        case 'string':
            this.body = responseBody;
            if (!this.get('Content-Type')) {
                this.setContentType('html');
            }
            break;
        case 'boolean':
        case 'number':
        case 'object':
            if (responseBody === null) {
                this.body = "";
            } else if (Buffer.isBuffer(responseBody)) {
                this.body = responseBody.toString();

                if (!this.get('Content-Type')) {
                    this.setContentType('bin');
                }
            } else {
                return this.json(responseBody);
            }
            break;
    }

    return this;
};

Response.prototype.json = function (body) {
    const jsonBody = JSON.stringify(body);

    this.body = jsonBody;

    this.setContentType("json");

    return this;
};

Response.prototype.render = function render(view, options) {
    const body = this.app.renderFile(view, options);

    this.body = body;

    this.setContentType("html");

    return this;
};

Response.prototype.sendStatus = function sendStatus(status) {
    try {
        this.body = httpStatus[status];
        this.setStatus(status);
    } catch (error) {
        this.body = "";
        throw error;
    }
    return this;
};

Response.prototype.cookie = 
Response.prototype.setCookie = function setCookie(name, value, options) {
    const opts = options || {};
    opts.path = opts.path ? opts.path : "/";

    if(typeof(value) === "object") {
        value = JSON.stringify(value);
    } else {
        value = String(value);
    }

    this.set("Set-Cookie", [cookie.serialize(name, value, opts)]);
    
    return this;
};

function setHeader(key, value) {
    if (Array.isArray(value)) {
        const values = value.map(String);
        if(this.multiValueHeaders[key]) {
            this.multiValueHeaders[key].push(...values);
        } else {
            this.multiValueHeaders[key] = values;
        }
    } else {
        this.headers[key] = String(value);
    }
}

module.exports = Response;