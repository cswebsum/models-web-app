import React, { useMemo } from 'react';
import { Form, Spin } from 'antd';
import Editor from '@monaco-editor/react';
import { dump } from 'js-yaml';

const generateInferenceServiceYaml = (values: any) => {
  if (!values || !values.name || !values.namespace || !values.revisions) {
    return '# Please fill out all previous steps to see the generated YAML.';
  }

  // This is a simplified generator. A real one would be more robust.
  const baseObject = {
    apiVersion: 'serving.kserve.io/v1beta1',
    kind: 'InferenceService',
    metadata: {
      name: values.name,
      namespace: values.namespace,
    },
    spec: {
      predictor: {},
    },
  };

  // Assign revisions to default and canary
  // For simplicity, the first revision is default, the second is canary.
  // A more advanced implementation would let the user choose.
  if (values.revisions.length > 0) {
    const defaultRevision = values.revisions[0];
    baseObject.spec.predictor.default = {
      model: {
        modelFormat: {
          name: 'custom', // Or detect from storageUri
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
    // Get traffic from the canary revision (assuming it's the second one)
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
