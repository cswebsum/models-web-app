import React, { useState } from 'react';
import { Button, PageHeader, message, Spin } from 'antd';
import Editor from '@monaco-editor/react';
import { load, YAMLException } from 'js-yaml';

const NewModelPage: React.FC = () => {
  const [yaml, setYaml] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleEditorChange = (value: string | undefined) => {
    setYaml(value || '');
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    if (!yaml.trim()) {
      message.error('YAML content cannot be empty.');
      setIsSubmitting(false);
      return;
    }

    let cr: any;
    try {
      cr = load(yaml);
    } catch (e) {
      const error = e as YAMLException;
      message.error(`Error parsing YAML: ${error.message}`);
      setIsSubmitting(false);
      return;
    }

    if (!cr || typeof cr !== 'object' || !cr.metadata) {
      message.error('Invalid InferenceService: must be an object with a metadata field.');
      setIsSubmitting(false);
      return;
    }

    // In a real app, we would get the namespace from context or a selector
    const namespace = 'kubeflow-user';
    cr.metadata.namespace = namespace;

    console.log('Submitting InferenceService:', cr);

    // Simulate API call
    setTimeout(() => {
      // On success:
      message.success('InferenceService created successfully!');
      // In a real app, you would navigate back to the home page after success.
      // For now, we just log and show a message.

      // On error:
      // message.error('Failed to create InferenceService.');

      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div>
      <PageHeader
        ghost={false}
        title="Create New Endpoint"
        subTitle="Define an InferenceService using YAML"
        // onBack is not used here as we handle navigation via the main App component's menu
      />
      <div style={{ border: '1px solid #f0f0f0', marginTop: '16px' }}>
        <Editor
          height="60vh"
          defaultLanguage="yaml"
          value={yaml}
          onChange={handleEditorChange}
          options={{ minimap: { enabled: false } }}
          // A fallback for when the editor is loading
          loading={<Spin />}
        />
      </div>
      <div style={{ marginTop: '16px', textAlign: 'right' }}>
        <Button onClick={() => { /* In a real app, navigate back */ }} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button type="primary" onClick={handleSubmit} loading={isSubmitting}>
          Create
        </Button>
      </div>
    </div>
  );
};

export default NewModelPage;
