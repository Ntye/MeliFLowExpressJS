import cors from 'cors';
import environment from './environment';

/**
 * CORS configuration options
 */
const corsOptions: cors.CorsOptions = {
  origin: environment.cors.origin,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default corsOptions;
