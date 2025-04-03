"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServers = getServers;
exports.getServerDetails = getServerDetails;
exports.getServerPlayers = getServerPlayers;
exports.getServerTop = getServerTop;
exports.getPlayerStats = getPlayerStats;
exports.getRankStats = getRankStats;
exports.addServer = addServer;
exports.getServerVariables = getServerVariables;
const axios_1 = require("axios");
const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL || 'http://localhost:5000';
async function getServers({ queryId, value, varValue, page = 1, orderBy = 'rank_id', orderDirection = 'asc' } = {}) {
    try {
        let url = `${API_URL}/api/v1/servers/getServers?page=${page}&pageSize=100`;
        if (queryId && value) {
            if (queryId === 'variable') {
                if (varValue) {
                    url += `&varKey=${value}&varValue=${varValue}`;
                }
                else {
                    url += `&varKey=${value}`;
                }
            }
            else {
                url += `&${queryId}=${value}`;
            }
        }
        if (orderBy) {
            url += `&orderBy=${orderBy}&orderDirection=${orderDirection}`;
        }
        const response = await axios_1.default.get(url);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching servers:', error);
        return { servers: [], totalPages: 0 };
    }
}
async function getServerDetails(host, port) {
    try {
        const url = `${API_URL}/api/v1/servers/getServerInfo?host=${host}&port=${port}`;
        const response = await axios_1.default.get(url);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching server details:', error);
        return [];
    }
}
async function getServerPlayers(serverId) {
    try {
        const url = `${API_URL}/api/v1/servers/getServerPlayers?id=${serverId}&type=1`;
        const response = await axios_1.default.get(url);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching server players:', error);
        return [];
    }
}
async function getServerTop(serverId) {
    try {
        const url = `${API_URL}/api/v1/servers/getServerPlayers?id=${serverId}&type=0`;
        const response = await axios_1.default.get(url);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching top players:', error);
        return [];
    }
}
async function getPlayerStats(serverId, type = 0) {
    try {
        const url = `${API_URL}/api/v1/servers/getPlayerStats?type=${type}&server_id=${serverId}`;
        const response = await axios_1.default.get(url);
        return response.data.filter((data) => data.Jugadores !== -1);
    }
    catch (error) {
        console.error('Error fetching player stats:', error);
        return [];
    }
}
async function getRankStats(serverId) {
    try {
        const url = `${API_URL}/api/v1/servers/getRankStats?server_id=${serverId}`;
        const response = await axios_1.default.get(url);
        return response.data.map((item, index, array) => (Object.assign(Object.assign({}, item), { date: index === array.length - 1 ? 'H' : array.length - index })));
    }
    catch (error) {
        console.error('Error fetching rank stats:', error);
        return [];
    }
}
async function addServer(formData) {
    try {
        const response = await axios_1.default.post(`${API_URL}/api/v1/servers/addServer`, formData);
        return response.data;
    }
    catch (error) {
        console.error('Error adding server:', error);
        throw error;
    }
}
async function getServerVariables(host, port) {
    try {
        const url = `${API_URL}/api/v1/servers/getServerVariables?host=${host}&port=${port}`;
        const response = await axios_1.default.get(url);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching server variables:', error);
        return [];
    }
}
//# sourceMappingURL=servers.js.map