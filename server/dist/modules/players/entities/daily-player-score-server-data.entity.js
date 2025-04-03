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
exports.DailyPlayerScoreServerData = void 0;
const typeorm_1 = require("typeorm");
const server_entity_1 = require("../../servers/entities/server.entity");
let DailyPlayerScoreServerData = class DailyPlayerScoreServerData {
};
exports.DailyPlayerScoreServerData = DailyPlayerScoreServerData;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DailyPlayerScoreServerData.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], DailyPlayerScoreServerData.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Number)
], DailyPlayerScoreServerData.prototype, "hour_24", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Number)
], DailyPlayerScoreServerData.prototype, "hour_23", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Number)
], DailyPlayerScoreServerData.prototype, "hour_22", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Number)
], DailyPlayerScoreServerData.prototype, "hour_21", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Number)
], DailyPlayerScoreServerData.prototype, "hour_20", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Number)
], DailyPlayerScoreServerData.prototype, "hour_19", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Number)
], DailyPlayerScoreServerData.prototype, "hour_18", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Number)
], DailyPlayerScoreServerData.prototype, "hour_17", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Number)
], DailyPlayerScoreServerData.prototype, "hour_16", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Number)
], DailyPlayerScoreServerData.prototype, "hour_15", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Number)
], DailyPlayerScoreServerData.prototype, "hour_14", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Number)
], DailyPlayerScoreServerData.prototype, "hour_13", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Number)
], DailyPlayerScoreServerData.prototype, "hour_12", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Number)
], DailyPlayerScoreServerData.prototype, "hour_11", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Number)
], DailyPlayerScoreServerData.prototype, "hour_10", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Number)
], DailyPlayerScoreServerData.prototype, "hour_9", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Number)
], DailyPlayerScoreServerData.prototype, "hour_8", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Number)
], DailyPlayerScoreServerData.prototype, "hour_7", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Number)
], DailyPlayerScoreServerData.prototype, "hour_6", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Number)
], DailyPlayerScoreServerData.prototype, "hour_5", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Number)
], DailyPlayerScoreServerData.prototype, "hour_4", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Number)
], DailyPlayerScoreServerData.prototype, "hour_3", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Number)
], DailyPlayerScoreServerData.prototype, "hour_2", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    __metadata("design:type", Number)
], DailyPlayerScoreServerData.prototype, "hour_1", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DailyPlayerScoreServerData.prototype, "server_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], DailyPlayerScoreServerData.prototype, "player_name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => server_entity_1.Server, server => server, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'server_id' }),
    __metadata("design:type", server_entity_1.Server)
], DailyPlayerScoreServerData.prototype, "server", void 0);
exports.DailyPlayerScoreServerData = DailyPlayerScoreServerData = __decorate([
    (0, typeorm_1.Entity)({ name: 'daily_player_score_server_data' })
], DailyPlayerScoreServerData);
//# sourceMappingURL=daily-player-score-server-data.entity.js.map