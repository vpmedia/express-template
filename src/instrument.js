import * as dotenv from 'dotenv';
import * as Sentry from '@sentry/node';
import { SocketIoInstrumentation } from '@opentelemetry/instrumentation-socket.io';

dotenv.config();

const environment = process.env.NODE_ENV;
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment,
  tracesSampleRate: 1,
  debug: true,
});
Sentry.addOpenTelemetryInstrumentation(new SocketIoInstrumentation());
