import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { trace, Tracer } from '@opentelemetry/api';

let openTelemetryClient: NodeSDK;
export let root_tracer : Tracer;

// Critical for standalone apps: flush buffers before the process ends
const shutdown = () => {
  if (openTelemetryClient) {
    openTelemetryClient.shutdown()
        .then(() => console.log('opentelemetry shut down. Traces flushed.'))
        .catch((error) => console.error('Error shutting down opentelemetry', error))
        .finally(() => process.exit(0));
  }
};

export function initOpenTelemetry(appName: string, appVersion: string) {

    const resource= resourceFromAttributes ({
            [ATTR_SERVICE_NAME]: appName,
            [ATTR_SERVICE_VERSION]: appVersion,
    });

    const traceExporter = new OTLPTraceExporter({
        url: 'http://localhost:4317', // Port 4317 is the OTLP gRPC port from your docker setup
    });

    openTelemetryClient = new NodeSDK({
        resource: resource,
        traceExporter: traceExporter,
    });

    try {
        openTelemetryClient.start();
        console.log('OpenTelemetry initialized successfully.');
        // shutting own on exit
        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);

        root_tracer = trace.getTracer('read_from_knowledge_base');
    } catch (error) {
        console.error('Failed to initialize OpenTelemetry', error);
        throw error;
    }
}

export function withTrace<F extends (...args: any[])=> any> (spanName: string, fn: F) : F  {
    return ((...args: Parameters<F>) => {
          return root_tracer.startActiveSpan(spanName, (span)  => {
            try {
                return fn(...args);
            } catch (error: any) {
                span.recordException(error);
                span.setStatus({ code: 2, message: error.message });
                throw error;
            } finally {
                span.end();
            }
        });
    });
}
