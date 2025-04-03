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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const server_entity_1 = require("../entities/server.entity");
let ServerRepository = class ServerRepository {
    constructor(serverRepository) {
        this.serverRepository = serverRepository;
    }
    async findAll(options) {
        const page = (options === null || options === void 0 ? void 0 : options.page) || 1;
        const pageSize = (options === null || options === void 0 ? void 0 : options.pageSize) || 10;
        const orderBy = (options === null || options === void 0 ? void 0 : options.orderBy) || 'numplayers';
        const orderDirection = (options === null || options === void 0 ? void 0 : options.orderDirection) !== undefined ? options.orderDirection : true;
        const queryOptions = {
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: {
                [orderBy]: orderDirection ? 'DESC' : 'ASC',
            },
        };
        const where = {};
        if (options === null || options === void 0 ? void 0 : options.name) {
            where.servername = (0, typeorm_2.Like)(`%${options.name}%`);
        }
        if (options === null || options === void 0 ? void 0 : options.map) {
            where.map = (0, typeorm_2.Like)(`%${options.map}%`);
        }
        if (options === null || options === void 0 ? void 0 : options.ip) {
            const [host, port] = options.ip.split(':');
            if (host && port) {
                where.host = host;
                where.port = parseInt(port, 10);
            }
            else {
                where.host = (0, typeorm_2.Like)(`%${options.ip}%`);
            }
        }
        if (Object.keys(where).length > 0) {
            queryOptions.where = where;
        }
        const [servers, total] = await this.serverRepository.findAndCount(queryOptions);
        return {
            servers,
            totalPages: Math.ceil(total / pageSize),
        };
    }
    async findById(id) {
        return this.serverRepository.findOne({ where: { id } });
    }
    async findByHostAndPort(host, port) {
        return this.serverRepository.findOne({ where: { host, port } });
    }
    async create(data) {
        const server = this.serverRepository.create(data);
        return this.serverRepository.save(server);
    }
    async update(id, data) {
        await this.serverRepository.update(id, data);
    }
    async remove(id) {
        await this.serverRepository.delete(id);
    }
    async updateRank(id, rank) {
        await this.serverRepository.update(id, { rank_id: rank });
    }
    async count() {
        return this.serverRepository.count();
    }
    async countByRank(rank) {
        return this.serverRepository.count({
            where: {
                rank_id: (0, typeorm_2.MoreThanOrEqual)(rank),
            },
        });
    }
};
exports.ServerRepository = ServerRepository;
exports.ServerRepository = ServerRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(server_entity_1.Server)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ServerRepository);
//# sourceMappingURL=server.repository.js.map