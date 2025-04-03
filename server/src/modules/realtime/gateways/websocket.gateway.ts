import { 
  WebSocketGateway, 
  WebSocketServer, 
  SubscribeMessage, 
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(WebsocketGateway.name);

  /**
   * Called when the gateway is initialized
   */
  afterInit(server: Server): void {
    this.logger.log('WebSocket Server Initialized');
  }

  /**
   * Called when a client connects
   */
  handleConnection(client: Socket): void {
    this.logger.debug(`Client connected: ${client.id}`);
  }

  /**
   * Called when a client disconnects
   */
  handleDisconnect(client: Socket): void {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  /**
   * Subscribe to server updates for a specific server
   * @param client The client socket
   * @param serverId The server identifier (host:port)
   */
  @SubscribeMessage('watchServer')
  handleWatchServer(
    @ConnectedSocket() client: Socket,
    @MessageBody() serverId: string,
  ): void {
    client.join(serverId);
    this.logger.debug(`Client ${client.id} watching server ${serverId}`);
  }

  /**
   * Notify clients that a server has been updated
   * @param serverId The server identifier (host:port)
   */
  notifyServerUpdated(serverId: string): void {
    this.server.to(serverId).emit('serverUpdated');
  }
}