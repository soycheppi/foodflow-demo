import { onCLS, onINP, onLCP, type Metric } from 'web-vitals';

function reportMetric(metric: Metric) {
  if (import.meta.env.DEV) {
    console.info(`[RUM Vital] ${metric.name}: ${Math.round(metric.value)}ms (rating: ${metric.rating})`);
    return;
  }

  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      window.dispatchEvent(
        new CustomEvent('foodflow:rum-metric', {
          detail: {
            name: metric.name,
            value: metric.value,
            rating: metric.rating,
            id: metric.id,
          },
        })
      );
    });
  }
}

export function initTelemetry(): void {
  onLCP(reportMetric);
  onINP(reportMetric);
  onCLS(reportMetric);
}
