import { InferenceService } from '../types';

// This is a simplified version of the data processing logic from the Angular app.
// It maps the raw Kubernetes object to our simplified frontend interface.
// In a real scenario, this would be more robust and handle all the status types.
export const processInferenceServices = (data: any[]): InferenceService[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(svc => {
    // A simple way to get the predictor type and spec, not fully robust.
    const predictorType = svc.spec?.predictor ? Object.keys(svc.spec.predictor)[0] : 'custom';
    const predictorSpec = svc.spec?.predictor ? svc.spec.predictor[predictorType] : undefined;

    return {
      name: svc.metadata.name,
      namespace: svc.metadata.namespace,
      // Simplified status logic
      status: svc.status?.conditions?.find((c: any) => c.type === 'Ready')?.status === 'True' ? 'Ready' : 'Not Ready',
      age: svc.metadata.creationTimestamp,
      predictor: predictorType,
      runtime: predictorSpec?.runtimeVersion || '-',
      protocol: predictorSpec?.protocolVersion || 'v1',
      storageUri: predictorSpec?.storageUri,
      url: svc.status?.url,
      raw: svc,
    };
  });
};
