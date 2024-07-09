#!/usr/bin/env node
import * as Sentry from '@sentry/node';
import { PrismaClient } from '@prisma/client';
import compression from 'compression';
import RedisStore from 'connect-redis';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';
import { createClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';
import logRequest from './core/logRequest.js';
import logger from './core/logger.js';

dotenv.config();

// db
const prismaClient = new PrismaClient();

// app
const app = express();
// app.locals.traceProvider = traceProvider;
// app.locals.metricProvider = metricProvider;
app.locals.db = prismaClient;
app.disable('X-Powered-By'); // disable server signature
app.use(express.json()); // request parser
app.use(compression()); // response compression
app.use(cors()); // security headers
app.use(helmet()); // security headers
app.use(morgan('dev')); // logging
const sessionConfig = {
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {},
};
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  sessionConfig.cookie.secure = true;
  const redisClient = createClient({ legacyMode: false });
  redisClient.connect().catch(logger.error);
  sessionConfig.store = new RedisStore({ client: redisClient });
}
app.use(session(sessionConfig));

app.use((req, res, next) => {
  const requestId = req.header('X-Request-Id') || uuidv4();
  res.set('X-Request-Id', requestId);
  res.set('X-Powered-By', 'nginx'); // hide server signature, app.disable does not work
  next();
});

app.post('/api/init', (req, res) => {
  // curl -X POST http://127.0.0.1:5000/api/init
  // process request
  // TODO req.body
  // process user
  const user = { userId: 'user_1' };
  // process response
  const timestamp = new Date().getTime();
  const responseData = {
    success: true,
    timestamp,
  };
  // process session
  req.session.timestamp = responseData.timestamp;
  req.session.user = user;
  // finalize
  logRequest(req, res, responseData);
  res.json(responseData);
});

// sentry middleware error handler
Sentry.setupExpressErrorHandler(app);

// start server
app.listen(process.env.EXPRESS_PORT, () => {
  logger.info(`Started server on port ${process.env.EXPRESS_PORT}`);
});
