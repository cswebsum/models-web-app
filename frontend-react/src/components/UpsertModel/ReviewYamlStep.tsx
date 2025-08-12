import React, { useMemo } from 'react';
import { Form, Spin } from 'antd';
import Editor from '@monaco-editor/react';
import { dump } from 'js-yaml';

// Define interfaces for the object we are building to ensure type safety
interface ModelSpec {
  modelFormat: {
    name: string;
  };
  storageUri: string;
}

interface PredictorSpec {
  default?: { model: ModelSpec };
  canary?: { model: ModelSpec };
  canaryTrafficPercent?: number;
}

interface InferenceServiceSpec {
  predictor: PredictorSpec;
}

interface InferenceServiceK8s {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace: string;
  };
  spec: InferenceServiceSpec;
}

const generateInferenceServiceYaml = (values: any) => {
  if (!values || !values.name || !values.namespace || !values.revisions) {
    return '# Please fill out all previous steps to see the generated YAML.';
  }

  const baseObject: InferenceServiceK8s = {
    apiVersion: 'serving.kserve.io/v1beta1',
    kind: 'InferenceService',
    metadata: {
      name: values.name,
      namespace: values.namespace,
    },
    spec: {
      predictor: {}, // Initialize predictor object
    },
  };

  // Assign revisions to default and canary
  if (values.revisions.length > 0) {
    const defaultRevision = values.revisions[0];
    baseObject.spec.predictor.default = {
      model: {
        modelFormat: {
          name: 'custom',
        },
        storageUri: defaultRevision.storageUri,
      },
    };
  }

  if (values.revisions.length > 1) {
    const canaryRevision = values.revisions[1];
    baseObject.spec.predictor.canary = {
      model: {
        modelFormat: {
          name: 'custom',
        },
        storageUri: canaryRevision.storageUri,
      },
    };
    baseObject.spec.predictor.canaryTrafficPercent = canaryRevision.traffic || 0;
  }

  return dump(baseObject);
};


const ReviewYamlStep: React.FC = () => {
  const form = Form.useFormInstance();
  const formValues = Form.useWatch([], form);

  const yamlString = useMemo(() => generateInferenceServiceYaml(formValues), [formValues]);

  return (
    <div style={{ border: '1px solid #f0f0f0' }}>
      <Editor
        height="50vh"
        defaultLanguage="yaml"
        value={yamlString}
        options={{ readOnly: true, minimap: { enabled: false } }}
        loading={<Spin />}
      />
    </div>
  );
};

export default ReviewYamlStep;
