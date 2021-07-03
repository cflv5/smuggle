function Response() {
    this.headers = {};
    this.multiValueHeaders = {};
    this.body = "";
    this.statusCode = null;
    this.base64Encoded = false;
    this.statusDescription = "";
}

module.exports = Response;