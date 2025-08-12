import React from 'react';
import {
  PageHeader,
  Descriptions,
  Spin,
  Alert,
  Tag,
  Button,
  Tabs,
} from 'antd';
import Editor from '@monaco-editor/react';
import { dump } from 'js-yaml';
import useFetchData from '../../hooks/useFetchData';
import Metrics from '../../components/Metrics';

const { TabPane } = Tabs;

interface ModelDetailsPageProps {
  modelName: string;
  namespace: string;
  navigate: (page: 'home' | 'upsert', context?: any) => void;
}

const ModelDetailsPage: React.FC<ModelDetailsPageProps> = ({ modelName, namespace, navigate }) => {
  const { data: modelData, loading, error } = useFetchData<any>(
    `/api/v1/namespaces/${namespace}/inferenceservices/${modelName}`,
  );

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
        onBack={() => navigate('home')}
        title={modelData.metadata.name}
        subTitle="Endpoint Details"
        tags={<Tag color={status.color}>{status.text.toUpperCase()}</Tag>}
        extra={[
          <Button key="2" onClick={() => navigate('upsert', modelData)}>Edit</Button>,
          <Button key="1" type="primary" danger>
            Delete
          </Button>,
        ]}
        style={{ paddingBottom: 0 }}
      />
      <Tabs defaultActiveKey="1" style={{ paddingTop: '16px' }}>
        <TabPane tab="Overview" key="1">
          <Descriptions bordered column={1} style={{ marginBottom: '24px' }}>
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
        </TabPane>
        <TabPane tab="Metrics" key="2">
          <Metrics />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ModelDetailsPage;
