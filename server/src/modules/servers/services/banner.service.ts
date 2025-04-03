import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';

interface ServerData {
  servername: string;
  host: string;
  port: number | string;
  online: number;
  numplayers: number;
  maxplayers: number;
  rank_id: number;
  map: string;
}

interface PlayerStats {
  day: number;
  hour: string;
  Jugadores: number;
}

@Injectable()
export class BannerService {
  private readonly logger = new Logger(BannerService.name);
  private readonly bannerOutputPath: string;

  constructor(private configService: ConfigService) {
    this.bannerOutputPath = this.configService.get<string>('bannerSettings.outputPath');
  }

  /**
   * Generate a banner image for a server
   */
  async generateBanner(data: ServerData, playerStats: PlayerStats[]): Promise<void> {
    try {
      // Create canvas
      const canvas = createCanvas(560, 95);
      const ctx = canvas.getContext('2d');

      // Load background image
      let image;
      try {
        image = await loadImage(path.join(process.cwd(), 'banner.png'));
        ctx.drawImage(image, 0, 0);
      } catch (error) {
        this.logger.error(`Error loading background image: ${error.message}`);
      }

      // Generate chart image if we have player stats
      let chartBuffer;
      try {
        chartBuffer = await this.generateChartImage(playerStats);
      } catch (error) {
        this.logger.error(`Error generating chart image: ${error.message}`);
      }

      // Draw chart if available
      if (chartBuffer) {
        const chartImage = await loadImage(chartBuffer);
        ctx.drawImage(chartImage, 420, 12);
      }

      // Set up text data
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

      // Draw text
      this.drawBannerText(ctx, textPairs, chartBuffer !== undefined);

      // Save the image
      const buffer = canvas.toBuffer('image/png');
      await this.saveBannerImage(buffer, data);

    } catch (error) {
      this.logger.error(`Error generating banner: ${error.message}`);
    }
  }

  /**
   * Truncate text to fit within a maximum width
   */
  private truncateText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
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

  /**
   * Draw text on the banner
   */
  private drawBannerText(ctx: CanvasRenderingContext2D, textPairs: { title: string; description: string }[], hasChartData: boolean): void {
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
    
    const lineHeight = Math.max(titleFontSize, descriptionFontSize) + 2; // Line height for text
    let currentY = lineHeight; // Initial y position
    const fontWeight = 'bold';

    // Add shadow to text
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Draw "Servidor" title
    ctx.fillStyle = titleColor;
    ctx.font = `${fontWeight} ${titleFontSize}px Arial`;
    ctx.fillText(textPairs[0].title, marginLeft, currentY);

    // Draw "Name of the server" description
    ctx.fillStyle = descColor;
    ctx.font = `${fontWeight} ${descriptionFontSize}px Arial`;
    
    const truncatedDescription = this.truncateText(ctx, textPairs[0].description, 260);
    ctx.fillText(truncatedDescription, marginLeft, currentY + lineHeight);

    // Draw "IP Address" title
    ctx.fillStyle = titleColor;
    ctx.font = `${fontWeight} ${titleFontSize}px Arial`;
    ctx.fillText(textPairs[1].title, marginLeft, currentY + lineHeight * 2.1);

    // Draw "IP Address" description
    ctx.fillStyle = descColor;
    ctx.font = `${fontWeight} ${descriptionFontSize}px Arial`;
    ctx.fillText(textPairs[1].description, marginLeft, currentY + lineHeight * 3.1);

    // Draw "Puerto" title
    ctx.fillStyle = titleColor;
    ctx.font = `${fontWeight} ${titleFontSize}px Arial`;
    ctx.fillText(textPairs[2].title, marginLeft + 2 * secondRowSpacing, currentY + lineHeight * 2.1);

    // Draw "Puerto" description
    ctx.fillStyle = descColor;
    ctx.font = `${fontWeight} ${descriptionFontSize}px Arial`;
    ctx.fillText(textPairs[2].description, marginLeft + 2 * secondRowSpacing, currentY + lineHeight * 3.2);

    // Draw "Estado" title
    ctx.fillStyle = titleColor;
    ctx.font = `${fontWeight} ${titleFontSize}px Arial`;
    ctx.fillText(textPairs[3].title, marginLeft + 4 * thirdRowSpacing, currentY + lineHeight * 2.1);

    // Draw "Estado" description
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

  /**
   * Generate a chart image of player stats
   */
  private async generateChartImage(playerStats: PlayerStats[]): Promise<Buffer | null> {
    // If not enough data or no players, return null
    if (playerStats.length < 2) {
      return null;
    }

    const sumPlayers = playerStats.reduce((total, data) => total + data.Jugadores, 0);
    if (sumPlayers === 0) {
      return null;
    }

    // Create a canvas instance
    const canvas = new ChartJSNodeCanvas({ 
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
          pointRadius: 0, // Remove the points
          pointHoverRadius: 0, // Remove hover points
          borderCapStyle: 'butt', // Make line ends sharper
          tension: 0.4, // Increase tension for sharper curves
        },
      ],
    };

    // Generate the chart as an image buffer
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

  /**
   * Save the banner image to the file system
   */
  private async saveBannerImage(buffer: Buffer, data: ServerData): Promise<void> {
    const serverFolderName = `${data.host}:${data.port}`;
    const serverImageName = 'argstrike_v1.png';

    // Create the folder path
    const folderPath = path.join(process.cwd(), this.bannerOutputPath, serverFolderName);

    // Ensure the directory exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Write the file
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
}