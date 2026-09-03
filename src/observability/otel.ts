import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { SpanStatusCode, trace, Tracer, metrics, Meter } from '@opentelemetry/api';
import { SendChatCompletionRequestRequest, SendChatCompletionRequestResponse } from '@openrouter/sdk/models/operations/sendchatcompletionrequest.js';
import { RequestOptions } from '@openrouter/sdk/lib/sdks.js';
import { ChatResult } from '@openrouter/sdk/models';
import { ConsoleMetricExporter, MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

let openTelemetryClient: NodeSDK;
export let root_tracer: Tracer;
export let root_meter: Meter;

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

    const metricReader = new PeriodicExportingMetricReader({
        exporter: new ConsoleMetricExporter(),
        // Default is 60000ms (60 seconds). Set to 10 seconds for demonstrative purposes only.
        exportIntervalMillis: 10000,
        });

    const globalServiceMeterProvider = new MeterProvider({
        resource: resource,
        readers: [metricReader],
    });

    // Set this MeterProvider to be global to the app being instrumented.
    metrics.setGlobalMeterProvider(globalServiceMeterProvider);

    try {
        openTelemetryClient.start();
        console.log('OpenTelemetry initialized successfully.');
        // shutting own on exit
        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);

        root_tracer = trace.getTracer(appName, appVersion);
        root_meter = metrics.getMeter(appName, appVersion);
    } catch (error) {
        console.error('Failed to initialize OpenTelemetry', error);
        throw error;
    }
}

export function withTraceRequest<F extends (request: SendChatCompletionRequestRequest & {
    chatRequest: {
        stream?: false | undefined;
    };
    }, options?: RequestOptions) => ReturnType<F>>(fn: F) {
    return ( (request: SendChatCompletionRequestRequest & {
        chatRequest: {
            stream?: false | undefined;
        };
    }, options?: RequestOptions) =>  {

        const currentSpan = trace.getActiveSpan();

        if (currentSpan) {
            request.chatRequest.model && currentSpan.setAttribute("gen_ai.request.model", request.chatRequest.model);
            request.chatRequest.temperature && currentSpan.setAttribute("gen_ai.request.temperature", request.chatRequest.temperature);
            request.chatRequest.messages && currentSpan.setAttribute("gen_ai.request.messages", JSON.stringify(request.chatRequest.messages));
            request.chatRequest.maxTokens && currentSpan.setAttribute("gen_ai.request.max_tokens", request.chatRequest.maxTokens);
            request.chatRequest.topP && currentSpan.setAttribute("gen_ai.request.top_p", request.chatRequest.topP);
        }
        
        const response = fn(request, options);

        if (currentSpan) {
            const reportReponse = (resp: ChatResult) => {
                currentSpan.setAttribute("gen_ai.response.id", resp.id);
                currentSpan.setAttribute("gen_ai.response.model", resp.model);
                currentSpan.setAttribute("gen_ai.response.finish_reason", resp.choices[0].finishReason ?? "unknown");
                currentSpan.setAttribute("gen_ai.response.usage", JSON.stringify(resp.usage ?? {}));
            };
            if (response instanceof Promise) {
                response.then((res) => {
                    reportReponse(res as ChatResult);
                });
            } else {
                reportReponse(response as ChatResult);
            }
        }

        return response;
    });
}

export function withTrace<F extends (...args: any[]) => any>(spanName: string, fn: F) {
    return ((...args: Parameters<F>) => {
        return root_tracer.startActiveSpan(spanName, (span) => {
            let result: any;
            try {
                result = fn(...args);
            } catch (error: any) {
                span.recordException(error);
                span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
                span.end();
                throw error;
            }

            if (result instanceof Promise) {
                // async: don't end the span until the promise settles
                return result
                    .then((res) => {
                        span.setStatus({ code: SpanStatusCode.OK });
                        return res;
                    })
                    .catch((error) => {
                        span.recordException(error);
                        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
                        throw error;
                    })
                    .finally(() => {
                        span.end();
                    });
            } else {
                // sync: end the span immediately
                span.setStatus({ code: SpanStatusCode.OK });
                span.end();
                return result;
            }
        });
    });
};


