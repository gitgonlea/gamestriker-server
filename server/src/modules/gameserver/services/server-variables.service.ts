// src/modules/gameserver/services/server-variables.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SourceQuery from 'sourcequery';
import * as http from 'http';
import * as https from 'https';
import { ServerVariables } from '../interfaces/server-variables.interface';

@Injectable()
export class ServerVariablesService {
  private readonly logger = new Logger(ServerVariablesService.name);
  private readonly timeout: number;

  constructor(private configService: ConfigService) {
    this.timeout = this.configService.get<number>('server.queryTimeout') || 1000;
  }

  /**
   * Fetch extended variables from a CS 1.6 server
   */
  async fetchServerVariables(host: string, port: number): Promise<string | null> {
    const sq = new SourceQuery(this.timeout);

    try {
      sq.open(host, port);
      
      // Get server rules
      const rules = await new Promise<any>((resolve, reject) => {
        sq.getRules((err, rules) => {
          if (err) return reject(err);
          resolve(rules || {});
        });
      });
      
      // Get server info
      const info = await new Promise<any>((resolve, reject) => {
        sq.getInfo((err, info) => {
          if (err) return reject(err);
          resolve(info || {});
        });
      });
      
      // Combine rules and info, but filter out some properties
      const serverData = { ...info, ...rules };
      
      // Remove properties we don't want to keep
      delete serverData.players;
      delete serverData.address;
      delete serverData.hostname;
      delete serverData.ismod;
      delete serverData.map;
      delete serverData.teams;
      
      // Remove properties that start with specific prefixes
      Object.keys(serverData).forEach(key => {
        if (
          key.startsWith('game_') || 
          key.startsWith('gq_') || 
          key.startsWith('map_') || 
          key.startsWith('num_')
        ) {
          delete serverData[key];
        }
      });

      return JSON.stringify(serverData);
    } catch (error) {
      this.logger.error(`Error fetching server variables from ${host}:${port}: ${error.message || error}`);
      return null;
    } finally {
      sq.close();
    }
  }
  
  /**
   * Alternatively, we could call an external API if needed
   * This is a fallback method if you have an existing service
   */
  async fetchServerVariablesFromAPI(host: string, port: number): Promise<string | null> {
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
              // Filter variables as in the PHP script
              delete result[serverIP].players;
              delete result[serverIP].address;
              delete result[serverIP].hostname;
              delete result[serverIP].ismod;
              delete result[serverIP].map;
              delete result[serverIP].teams;
              
              // Remove properties that start with specific prefixes
              Object.keys(result[serverIP]).forEach(key => {
                if (
                  key.startsWith('game_') || 
                  key.startsWith('gq_') || 
                  key.startsWith('map_') || 
                  key.startsWith('num_')
                ) {
                  delete result[serverIP][key];
                }
              });
              
              resolve(JSON.stringify(result[serverIP]));
            } else {
              this.logger.error('Server data not found in API response');
              resolve(null);
            }
          } catch (error) {
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
}