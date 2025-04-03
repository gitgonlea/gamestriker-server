"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayers = getPlayers;
exports.getPlayerDetails = getPlayerDetails;
exports.getPlayerServerStats = getPlayerServerStats;
const axios_1 = require("axios");
const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL || 'http://localhost:5000';
async function getPlayers({ name = '', online = false, page = 1, pageSize = 15, orderBy = 'name', orderDirection = 'asc' } = {}) {
    try {
        let url = `${API_URL}/api/v1/servers/getPlayer?page=${page}&pageSize=${pageSize}`;
        if (name) {
            url += `&name=${name}`;
        }
        if (online) {
            url += `&online=true`;
        }
        if (orderBy) {
            url += `&orderBy=${orderBy}&orderDirection=${orderDirection}`;
        }
        const response = await axios_1.default.get(url);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching players:', error);
        return { players: [], totalPages: 0 };
    }
}
async function getPlayerDetails(playerName) {
    try {
        const url = `${API_URL}/api/v1/servers/getPlayer?name=${playerName}`;
        const response = await axios_1.default.get(url);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching player details:', error);
        return { player: null };
    }
}
async function getPlayerServerStats(playerName, host, port, days = 0) {
    try {
        const url = `${API_URL}/api/v1/servers/getPlayerDataServer?playerName=${playerName}&host=${host}&port=${port}&days=${days}`;
        const response = await axios_1.default.get(url);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching player server stats:', error);
        return { player_data: [], player_score: [], player_time: [] };
    }
}
//# sourceMappingURL=players.js.map