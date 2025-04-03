"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ServerVariablesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerVariablesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const SourceQuery = require("sourcequery");
const http = require("http");
let ServerVariablesService = ServerVariablesService_1 = class ServerVariablesService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(ServerVariablesService_1.name);
        this.timeout = this.configService.get('server.queryTimeout') || 1000;
    }
    async fetchServerVariables(host, port) {
        const sq = new SourceQuery(this.timeout);
        try {
            sq.open(host, port);
            const rules = await new Promise((resolve, reject) => {
                sq.getRules((err, rules) => {
                    if (err)
                        return reject(err);
                    resolve(rules || {});
                });
            });
            const info = await new Promise((resolve, reject) => {
                sq.getInfo((err, info) => {
                    if (err)
                        return reject(err);
                    resolve(info || {});
                });
            });
            const serverData = Object.assign(Object.assign({}, info), rules);
            delete serverData.players;
            delete serverData.address;
            delete serverData.hostname;
            delete serverData.ismod;
            delete serverData.map;
            delete serverData.teams;
            Object.keys(serverData).forEach(key => {
                if (key.startsWith('game_') ||
                    key.startsWith('gq_') ||
                    key.startsWith('map_') ||
                    key.startsWith('num_')) {
                    delete serverData[key];
                }
            });
            return JSON.stringify(serverData);
        }
        catch (error) {
            this.logger.error(`Error fetching server variables from ${host}:${port}: ${error.message || error}`);
            return null;
        }
        finally {
            sq.close();
        }
    }
    async fetchServerVariablesFromAPI(host, port) {
        return new Promise((resolve, reject) => {
            const apiUrl = `http://your-api-endpoint/getServerVariables?host=${host}&port=${port}`;
            http.get(apiUrl, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    try {
                        const result = JSON.parse(data);
                        const serverIP = `${host}:${port}`;
                        if (result[serverIP]) {
                            delete result[serverIP].players;
                            delete result[serverIP].address;
                            delete result[serverIP].hostname;
                            delete result[serverIP].ismod;
                            delete result[serverIP].map;
                            delete result[serverIP].teams;
                            Object.keys(result[serverIP]).forEach(key => {
                                if (key.startsWith('game_') ||
                                    key.startsWith('gq_') ||
                                    key.startsWith('map_') ||
                                    key.startsWith('num_')) {
                                    delete result[serverIP][key];
                                }
                            });
                            resolve(JSON.stringify(result[serverIP]));
                        }
                        else {
                            this.logger.error('Server data not found in API response');
                            resolve(null);
                        }
                    }
                    catch (error) {
                        this.logger.error(`Error parsing server variables API response: ${error.message}`);
                        resolve(null);
                    }
                });
            }).on('error', (error) => {
                this.logger.error(`Error fetching server variables from API: ${error.message}`);
                resolve(null);
            });
        });
    }
};
exports.ServerVariablesService = ServerVariablesService;
exports.ServerVariablesService = ServerVariablesService = ServerVariablesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ServerVariablesService);
//# sourceMappingURL=server-variables.service.js.map