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
var BannerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs = require("fs");
const path = require("path");
const chartjs_node_canvas_1 = require("chartjs-node-canvas");
const canvas_1 = require("canvas");
let BannerService = BannerService_1 = class BannerService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(BannerService_1.name);
        this.bannerOutputPath = this.configService.get('bannerSettings.outputPath');
    }
    async generateBanner(data, playerStats) {
        try {
            const canvas = (0, canvas_1.createCanvas)(560, 95);
            const ctx = canvas.getContext('2d');
            let image;
            try {
                image = await (0, canvas_1.loadImage)(path.join(process.cwd(), 'banner.png'));
                ctx.drawImage(image, 0, 0);
            }
            catch (error) {
                this.logger.error(`Error loading background image: ${error.message}`);
            }
            let chartBuffer;
            try {
                chartBuffer = await this.generateChartImage(playerStats);
            }
            catch (error) {
                this.logger.error(`Error generating chart image: ${error.message}`);
            }
            if (chartBuffer) {
                const chartImage = await (0, canvas_1.loadImage)(chartBuffer);
                ctx.drawImage(chartImage, 420, 12);
            }
            const actualPlayers = `${data.numplayers}/${data.maxplayers}`;
            const currentRank = data.rank_id !== undefined ? `${data.rank_id}°` : '?';
            const textPairs = [
                { title: 'Servidor:', description: data.servername },
                { title: 'Dirección IP:', description: String(data.host) },
                { title: 'Puerto:', description: String(data.port) },
                { title: 'Estado:', description: data.online ? 'Online' : 'Offline' },
                { title: 'Jugadores:', description: actualPlayers },
                { title: 'Rank:', description: currentRank },
                { title: 'Mapa actual:', description: data.map },
                { title: 'Argentina Strike', description: 'https://argentina-strike.com' }
            ];
            this.drawBannerText(ctx, textPairs, chartBuffer !== undefined);
            const buffer = canvas.toBuffer('image/png');
            await this.saveBannerImage(buffer, data);
        }
        catch (error) {
            this.logger.error(`Error generating banner: ${error.message}`);
        }
    }
    truncateText(ctx, text, maxWidth) {
        let truncatedText = text;
        if (ctx.measureText(text).width > maxWidth) {
            for (let i = text.length - 1; i >= 0; i--) {
                if (ctx.measureText(text.slice(0, i)).width <= maxWidth) {
                    truncatedText = text.slice(0, i) + '...';
                    break;
                }
            }
        }
        return truncatedText;
    }
    drawBannerText(ctx, textPairs, hasChartData) {
        const titleFontSize = 11;
        const descriptionFontSize = 12;
        const marginLeft = 115;
        const secondRowSpacing = 52;
        const thirdRowSpacing = 40;
        const domainTitleSpacing = 77;
        const domainDescSpacing = 71;
        const domainTitleFontSize = 11;
        const domainDescFontSize = 11;
        const titleColor = 'rgb(17, 186, 243)';
        const descColor = 'white';
        const onlineColor = 'rgb(41, 217, 144)';
        const offlineColor = 'rgba(249, 73, 73)';
        const numOfPlayersTitle = '# de jugadores (24 horas)';
        const numOfPlayersFont = 11;
        const numOfPlayersSpacing = 69;
        const noDataTitle = 'No hay información disponible';
        const noDataFont = 10.5;
        const noDataSpacing = 67;
        const lineHeight = Math.max(titleFontSize, descriptionFontSize) + 2;
        let currentY = lineHeight;
        const fontWeight = 'bold';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = titleColor;
        ctx.font = `${fontWeight} ${titleFontSize}px Arial`;
        ctx.fillText(textPairs[0].title, marginLeft, currentY);
        ctx.fillStyle = descColor;
        ctx.font = `${fontWeight} ${descriptionFontSize}px Arial`;
        const truncatedDescription = this.truncateText(ctx, textPairs[0].description, 260);
        ctx.fillText(truncatedDescription, marginLeft, currentY + lineHeight);
        ctx.fillStyle = titleColor;
        ctx.font = `${fontWeight} ${titleFontSize}px Arial`;
        ctx.fillText(textPairs[1].title, marginLeft, currentY + lineHeight * 2.1);
        ctx.fillStyle = descColor;
        ctx.font = `${fontWeight} ${descriptionFontSize}px Arial`;
        ctx.fillText(textPairs[1].description, marginLeft, currentY + lineHeight * 3.1);
        ctx.fillStyle = titleColor;
        ctx.font = `${fontWeight} ${titleFontSize}px Arial`;
        ctx.fillText(textPairs[2].title, marginLeft + 2 * secondRowSpacing, currentY + lineHeight * 2.1);
        ctx.fillStyle = descColor;
        ctx.font = `${fontWeight} ${descriptionFontSize}px Arial`;
        ctx.fillText(textPairs[2].description, marginLeft + 2 * secondRowSpacing, currentY + lineHeight * 3.2);
        ctx.fillStyle = titleColor;
        ctx.font = `${fontWeight} ${titleFontSize}px Arial`;
        ctx.fillText(textPairs[3].title, marginLeft + 4 * thirdRowSpacing, currentY + lineHeight * 2.1);
        ctx.fillStyle = textPairs[3].description === 'Online' ? onlineColor : offlineColor;
        ctx.font = `${fontWeight} ${descriptionFontSize}px Arial`;
        ctx.fillText(textPairs[3].description, marginLeft + 4 * thirdRowSpacing, currentY + lineHeight * 3.1);
        ctx.fillStyle = titleColor;
        ctx.font = `${fontWeight} ${titleFontSize}px Arial`;
        ctx.fillText(textPairs[4].title, marginLeft, currentY + lineHeight * 4.2);
        ctx.fillStyle = descColor;
        ctx.font = `${fontWeight} ${descriptionFontSize}px Arial`;
        ctx.fillText(textPairs[4].description, marginLeft, currentY + lineHeight * 5.2);
        ctx.fillStyle = titleColor;
        ctx.font = `${fontWeight} ${titleFontSize}px Arial`;
        ctx.fillText(textPairs[5].title, marginLeft + 2 * secondRowSpacing, currentY + lineHeight * 4.2);
        ctx.fillStyle = descColor;
        ctx.font = `${fontWeight} ${descriptionFontSize}px Arial`;
        ctx.fillText(textPairs[5].description, marginLeft + 2 * secondRowSpacing, currentY + lineHeight * 5.2);
        ctx.fillStyle = titleColor;
        ctx.font = `${fontWeight} ${titleFontSize}px Arial`;
        ctx.fillText(textPairs[6].title, marginLeft + 4 * thirdRowSpacing, currentY + lineHeight * 4.2);
        ctx.fillStyle = descColor;
        ctx.font = `${fontWeight} ${descriptionFontSize}px Arial`;
        ctx.fillText(textPairs[6].description, marginLeft + 4 * thirdRowSpacing, currentY + lineHeight * 5.2);
        ctx.fillStyle = titleColor;
        ctx.font = `${fontWeight} ${domainTitleFontSize}px Arial`;
        ctx.fillText(textPairs[7].title, marginLeft + 4.1 * domainTitleSpacing, currentY + lineHeight * 4.6);
        ctx.fillStyle = descColor;
        ctx.font = `${fontWeight} ${domainDescFontSize}px Arial`;
        ctx.fillText(textPairs[7].description, marginLeft + 4.1 * domainDescSpacing, currentY + lineHeight * 5.5);
        ctx.fillStyle = titleColor;
        ctx.font = `${fontWeight} ${numOfPlayersFont}px Arial`;
        ctx.fillText(numOfPlayersTitle, marginLeft + 4.2 * numOfPlayersSpacing, currentY + lineHeight - 16);
        if (!hasChartData) {
            ctx.fillStyle = 'rgb(255, 184, 28)';
            ctx.font = `${fontWeight} ${noDataFont}px Arial`;
            ctx.fillText(noDataTitle, marginLeft + 4.2 * noDataSpacing, currentY + lineHeight + 20);
        }
    }
    async generateChartImage(playerStats) {
        if (playerStats.length < 2) {
            return null;
        }
        const sumPlayers = playerStats.reduce((total, data) => total + data.Jugadores, 0);
        if (sumPlayers === 0) {
            return null;
        }
        const canvas = new chartjs_node_canvas_1.ChartJSNodeCanvas({
            width: 99,
            height: 59,
            backgroundColour: 'transparent'
        });
        const maxYValue = Math.max(...playerStats.map(data => data.Jugadores));
        const labels = playerStats.map(data => data.hour);
        const dataValues = playerStats.map(data => data.Jugadores);
        const data = {
            labels: labels,
            datasets: [
                {
                    data: dataValues,
                    fill: false,
                    borderColor: 'rgb(255, 184, 28)',
                    borderWidth: 1,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    borderCapStyle: 'butt',
                    tension: 0.4,
                },
            ],
        };
        const imageBuffer = await canvas.renderToBuffer({
            type: 'line',
            data: data,
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        max: Math.max(...playerStats.map(data => parseInt(data.hour))),
                        ticks: {
                            font: {
                                size: 8,
                            },
                            color: 'white'
                        }
                    },
                    y: {
                        max: maxYValue,
                        ticks: {
                            font: {
                                size: 8,
                            },
                            color: 'white',
                        }
                    }
                }
            }
        });
        return imageBuffer;
    }
    async saveBannerImage(buffer, data) {
        const serverFolderName = `${data.host}:${data.port}`;
        const serverImageName = 'argstrike_v1.png';
        const folderPath = path.join(process.cwd(), this.bannerOutputPath, serverFolderName);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(folderPath, serverImageName), buffer, (err) => {
                if (err) {
                    this.logger.error(`Error writing banner file: ${err.message}`);
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
};
exports.BannerService = BannerService;
exports.BannerService = BannerService = BannerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], BannerService);
//# sourceMappingURL=banner.service.js.map