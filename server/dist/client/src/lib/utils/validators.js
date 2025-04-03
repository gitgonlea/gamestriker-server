"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidIpAddress = isValidIpAddress;
exports.isValidPort = isValidPort;
exports.isValidServerAddress = isValidServerAddress;
exports.isValidEmail = isValidEmail;
exports.isValidPlayerName = isValidPlayerName;
exports.isValidUrl = isValidUrl;
function isValidIpAddress(ipAddress) {
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Regex.test(ipAddress);
}
function isValidPort(port) {
    const portNumber = parseInt(port, 10);
    return !isNaN(portNumber) && portNumber >= 1 && portNumber <= 65535;
}
function isValidServerAddress(address) {
    if (!address || !address.includes(':')) {
        return false;
    }
    const [host, port] = address.split(':');
    return host.length > 0 && isValidPort(port);
}
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function isValidPlayerName(name) {
    const nameRegex = /^[a-zA-Z0-9\s_\-\[\]\(\)]{3,32}$/;
    return nameRegex.test(name);
}
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    }
    catch (e) {
        return false;
    }
}
//# sourceMappingURL=validators.js.map