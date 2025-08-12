// A simplified version of the PredictorExtensionSpec from the Angular app
// containing only the fields used by our components.
export interface PredictorExtension {
  storageUri?: string;
}

// Simplified interface for an Inference Service, containing what we need for the UI.
export interface InferenceService {
  name: string;
  namespace: string;
  status: string; // Simplified for now, e.g., 'Ready', 'Not Ready', 'Terminating'
  age: string;
  predictor: string;
  runtime: string;
  protocol: string;
  storageUri?: string;
  url?: string;
  raw: any; // To store the original K8s object for actions
}
