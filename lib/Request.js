const NF_PROTO = "x-nf-connection-proto";
const NF_IP = "x-nf-client-connection-ip";

function Request(event, context, app) {
    this.app = app;

    this.body = event.body;
    this.headers = event.headers;
    setProtocol.call(this);
    this.ip = this.headers[NF_IP];
    setQueryParameters.call(this, event);
    setCookies.call(this);
    this.method = event.httpMethod;
    this.path = event.path;
    this.rawUrl = event.rawUrl;
    this.host = this.headers.host;
    this.event = event;
    this.context = context;
}

function setQueryParameters(event) {
    this.query = event.queryStringParameters;

    const multiValueQueryStringParameters = event.multiValueQueryStringParameters;
    for (const key in multiValueQueryStringParameters) {
        if (Object.hasOwnProperty.call(multiValueQueryStringParameters, key)) {
            this.query[key] = multiValueQueryStringParameters[key];
        }
    }
}

function setCookies() {
    this.cookies = {};

    const cookieHeader = this.headers.cookie;

    const cookies = cookieHeader.split(";");

    cookies.forEach(cookie => {
        cookie = cookie.trim();

        const nameValue = cookie.split("=");

        this.cookies[nameValue[0]] = nameValue[1] || "";
    });
}

function setProtocol() {
    this.protocol = this.headers[NF_PROTO].toLowerCase();

    if (this.protocol === "https") {
        this.secure = true;
    }
}

module.exports = Request;