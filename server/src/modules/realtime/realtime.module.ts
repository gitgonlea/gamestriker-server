import { Module } from '@nestjs/common';
import { WebsocketGateway } from './gateways/websocket.gateway';

@Module({
  providers: [WebsocketGateway],
  exports: [WebsocketGateway],
})
export class RealtimeModule {}