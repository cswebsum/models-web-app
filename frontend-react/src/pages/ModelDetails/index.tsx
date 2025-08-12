import React from 'react';
import {
  Descriptions,
  Spin,
  Alert,
  Tag,
  Button,
  Tabs,
  Typography,
  Space,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import { dump } from 'js-yaml';
import useFetchData from '../../hooks/useFetchData';
import Metrics from '../../components/Metrics';
import { detailsPagePlugins } from '../../plugins';
import { downloadYaml } from '../../utils/export';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

interface ModelDetailsPageProps {
  modelName: string;
  namespace: string;
  navigate: (page: 'home' | 'upsert', context?: any) => void;
}

const ModelDetailsPage: React.FC<ModelDetailsPageProps> = ({ modelName, namespace, navigate }) => {
  const { data: modelData, loading, error } = useFetchData<any>(
    `/api/v1/namespaces/${namespace}/inferenceservices/${modelName}`,
  );

  const handleExport = () => {
    if (modelData) {
      downloadYaml(modelData, `${modelName}.yaml`);
    }
  };

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
      <div style={{ padding: '16px 24px', backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('home')}>
            Back to Endpoints
          </Button>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={3} style={{ margin: 0 }}>
                {modelData.metadata.name} <Tag color={status.color}>{status.text.toUpperCase()}</Tag>
              </Title>
              <Text type="secondary">Endpoint Details</Text>
            </div>
            <Space>
              <Button key="3" onClick={handleExport}>Export YAML</Button>
              <Button key="2" onClick={() => navigate('upsert', modelData)}>Edit</Button>
              <Button key="1" type="primary" danger>
                Delete
              </Button>
            </Space>
          </div>
        </Space>
      </div>
      <div style={{ padding: '24px' }}>
        <Tabs defaultActiveKey="1">
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
          {detailsPagePlugins.map(plugin => (
            <TabPane tab={plugin.tabName} key={plugin.id}>
              <plugin.component modelData={modelData} />
            </TabPane>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default ModelDetailsPage;
