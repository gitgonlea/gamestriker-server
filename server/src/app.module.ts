import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ServersModule } from './modules/servers/servers.module';
import { PlayersModule } from './modules/players/players.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { GameServerModule } from './modules/gameserver/gameserver.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { JobsModule } from './jobs/jobs.module';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    
    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('environment') === 'development',
        logging: configService.get<string>('environment') === 'development',
      }),
    }),
    
    // Task Scheduling
    ScheduleModule.forRoot(),
    
    // Application Modules
    ServersModule,
    PlayersModule,
    StatisticsModule,
    GameServerModule,
    RealtimeModule,
    JobsModule,
  ],
})
export class AppModule {}