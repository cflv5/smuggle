function Response() {
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

function setHeader(key, value) {
    if (Array.isArray(value)) {
        this.multiValueHeaders[key] = value.map(String);
    } else {
        this.headers[key] = String(value);
    }
}

module.exports = Response;