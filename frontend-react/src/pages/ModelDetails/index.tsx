import React from 'react';
import {
  PageHeader,
  Descriptions,
  Spin,
  Alert,
  Tag,
  Button,
} from 'antd';
import Editor from '@monaco-editor/react';
import { dump } from 'js-yaml';
import useFetchData from '../../hooks/useFetchData';

const ModelDetailsPage: React.FC = () => {
  // In a real app, these would come from the router/state management
  const namespace = 'kubeflow-user';
  const modelName = 'test-service'; // This would be dynamic in a real app

  const { data, loading, error } = useFetchData<any>(
    // This is a placeholder URL. In a real app, you would fetch a single service.
    // We are reusing the list endpoint and finding the service for now.
    `/api/v1/namespaces/${namespace}/inferenceservices`,
  );

  // Find the specific service from the list (temporary workaround)
  const modelData = data?.find((svc: any) => svc.metadata.name === modelName);

  const getStatus = (service: any) => {
    if (!service || !service.status || !service.status.conditions) {
      return { text: 'Unknown', color: 'grey' };
    }
    const readyCondition = service.status.conditions.find(
      (c: any) => c.type === 'Ready',
    );
    return readyCondition?.status === 'True'
      ? { text: 'Ready', color: 'green' }
      : { text: 'Not Ready', color: 'volcano' };
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'block', marginTop: '20px' }} />;
  }

  if (error) {
    return <Alert message="Error" description={error.message} type="error" showIcon />;
  }

  if (!modelData) {
    return <Alert message="Not Found" description={`Inference service "${modelName}" not found.`} type="warning" showIcon />;
  }

  const status = getStatus(modelData);
  const yamlString = dump(modelData);

  return (
    <div>
      <PageHeader
        ghost={false}
        onBack={() => { /* In a real app, navigate back */ }}
        title={modelData.metadata.name}
        subTitle="Endpoint Details"
        tags={<Tag color={status.color}>{status.text.toUpperCase()}</Tag>}
        extra={[
          <Button key="2">Edit</Button>,
          <Button key="1" type="primary" danger>
            Delete
          </Button>,
        ]}
      />
      <Descriptions bordered column={1} style={{ margin: '16px 0' }}>
        <Descriptions.Item label="Namespace">{modelData.metadata.namespace}</Descriptions.Item>
        <Descriptions.Item label="URL">{modelData.status?.url || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Created At">
          {new Date(modelData.metadata.creationTimestamp).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>

      <h3 style={{ marginTop: '24px', marginBottom: '8px' }}>YAML</h3>
      <div style={{ border: '1px solid #f0f0f0' }}>
        <Editor
          height="50vh"
          defaultLanguage="yaml"
          value={yamlString}
          options={{ readOnly: true, minimap: { enabled: false } }}
          loading={<Spin />}
        />
      </div>
    </div>
  );
};

export default ModelDetailsPage;
