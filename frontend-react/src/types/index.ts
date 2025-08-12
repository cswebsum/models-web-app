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

export interface DetailsPagePlugin {
  // A unique identifier for the plugin
  id: string;

  // The name to be displayed on the tab
  tabName: string;

  // The React component to render inside the tab pane
  // It will receive the model data as a prop.
  component: React.ComponentType<{ modelData: any }>;
}
