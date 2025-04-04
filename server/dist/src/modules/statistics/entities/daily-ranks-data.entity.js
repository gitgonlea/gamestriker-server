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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyRanksData = void 0;
const typeorm_1 = require("typeorm");
const server_entity_1 = require("../../servers/entities/server.entity");
let DailyRanksData = class DailyRanksData {
};
exports.DailyRanksData = DailyRanksData;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DailyRanksData.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], DailyRanksData.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: -1 }),
    __metadata("design:type", Number)
], DailyRanksData.prototype, "rank_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DailyRanksData.prototype, "server_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => server_entity_1.Server, server => server, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'server_id' }),
    __metadata("design:type", server_entity_1.Server)
], DailyRanksData.prototype, "server", void 0);
exports.DailyRanksData = DailyRanksData = __decorate([
    (0, typeorm_1.Entity)({ name: 'daily_ranks_data' })
], DailyRanksData);
//# sourceMappingURL=daily-ranks-data.entity.js.map