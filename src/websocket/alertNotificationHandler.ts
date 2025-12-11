import { WebSocketServer, WebSocket } from 'ws';
import { logger } from '../utils/logger';

class AlertWebSocketHandler {
  private wss: WebSocketServer | null = null;
  private clients: Set<WebSocket> = new Set();

  initialize(server: any) {
    this.wss = new WebSocketServer({
      server,
      path: '/ws/alerts',
    });

    this.wss.on('connection', (ws: WebSocket) => {
      logger.info('New WebSocket client connected');
      this.clients.add(ws);

      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message.toString());
          logger.debug('WebSocket message received:', data);

          // Handle ping/pong for keep-alive
          if (data.type === 'ping') {
            ws.send(JSON.stringify({ type: 'pong' }));
          }
        } catch (error) {
          logger.error('Error processing WebSocket message:', error);
        }
      });

      ws.on('close', () => {
        logger.info('WebSocket client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        logger.error('WebSocket error:', error);
        this.clients.delete(ws);
      });

      // Send welcome message
      ws.send(
        JSON.stringify({
          type: 'connected',
          message: 'Connected to MeliFlow alert notifications',
          timestamp: new Date().toISOString(),
        })
      );
    });

    logger.info(`WebSocket server initialized on path /ws/alerts`);
  }

  broadcast(data: any) {
    const message = JSON.stringify({
      ...data,
      timestamp: new Date().toISOString(),
    });

    let sentCount = 0;
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
        sentCount++;
      }
    });

    logger.info(`Alert broadcast to ${sentCount} clients`);
  }

  sendToClient(client: WebSocket, data: any) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
        })
      );
    }
  }

  getActiveConnections(): number {
    return this.clients.size;
  }
}

export const alertWebSocket = new AlertWebSocketHandler();
