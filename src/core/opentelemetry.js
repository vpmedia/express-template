import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { Resource } from '@opentelemetry/resources';
import { ConsoleMetricExporter, MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  NodeTracerProvider,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-node';
import {
  SEMRESATTRS_CONTAINER_ID,
  SEMRESATTRS_DEPLOYMENT_ENVIRONMENT,
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import * as dotenv from 'dotenv';

dotenv.config();

const OTEL_ENABLED = process.env.OTEL_ENABLED === 'true';
const OTEL_DEBUG = OTEL_ENABLED && process.env.OTEL_DEBUG === 'true';
const OTEL_TRACE_COLLECTOR_ENABLED = OTEL_ENABLED && process.env.OTEL_TRACE_COLLECTOR_ENABLED === 'true';
const OTEL_TRACE_DEBUG_ENABLED = OTEL_ENABLED && process.env.OTEL_TRACE_DEBUG_ENABLED === 'true';
const OTEL_METRIC_COLLECTOR_ENABLED = OTEL_ENABLED && process.env.OTEL_METRIC_COLLECTOR_ENABLED === 'true';
const OTEL_METRIC_DEBUG_ENABLED = OTEL_ENABLED && process.env.OTEL_METRIC_DEBUG_ENABLED === 'true';

const environment = process.env.NODE_ENV || 'development';
const hostname = process.env.HOSTNAME || 'localhost';

if (OTEL_DEBUG) {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);
}

const resource = new Resource({
  [SEMRESATTRS_SERVICE_NAME]: 'express-template',
  [SEMRESATTRS_SERVICE_VERSION]: '1.0.0',
  [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: environment,
  [SEMRESATTRS_CONTAINER_ID]: hostname,
});

export const traceProvider = new NodeTracerProvider({ resource });

if (OTEL_TRACE_DEBUG_ENABLED) {
  const exporter = new ConsoleSpanExporter();
  traceProvider.addSpanProcessor(new SimpleSpanProcessor(exporter));
}
if (OTEL_TRACE_COLLECTOR_ENABLED) {
  const exporterConfig = {};
  const exporter = new OTLPTraceExporter(exporterConfig);
  traceProvider.addSpanProcessor(new BatchSpanProcessor(exporter));
}

traceProvider.register();

if (OTEL_ENABLED) {
  registerInstrumentations({
    instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()],
  });
}

export const metricProvider = new MeterProvider();

if (OTEL_METRIC_DEBUG_ENABLED) {
  const exporter = new ConsoleMetricExporter();
  const reader = new PeriodicExportingMetricReader({
    exporter,
  });
  metricProvider.addMetricReader(reader);
}
if (OTEL_METRIC_COLLECTOR_ENABLED) {
  const exporterConfig = {};
  const exporter = new OTLPMetricExporter(exporterConfig);
  const reader = new PeriodicExportingMetricReader({
    exporter,
  });
  metricProvider.addMetricReader(reader);
}
