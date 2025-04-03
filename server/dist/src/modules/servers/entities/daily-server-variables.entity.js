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
exports.DailyServerVariables = void 0;
const typeorm_1 = require("typeorm");
const server_entity_1 = require("./server.entity");
let DailyServerVariables = class DailyServerVariables {
};
exports.DailyServerVariables = DailyServerVariables;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DailyServerVariables.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DailyServerVariables.prototype, "server_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'longtext', nullable: true, collation: 'utf8mb4_bin' }),
    __metadata("design:type", String)
], DailyServerVariables.prototype, "variables_data", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => server_entity_1.Server, server => server.dailyServerVariables, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'server_id' }),
    __metadata("design:type", server_entity_1.Server)
], DailyServerVariables.prototype, "server", void 0);
exports.DailyServerVariables = DailyServerVariables = __decorate([
    (0, typeorm_1.Entity)({ name: 'daily_server_variables' })
], DailyServerVariables);
//# sourceMappingURL=daily-server-variables.entity.js.map