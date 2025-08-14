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
import { detailsPagePlugins } from '../../plugins';
import { downloadYaml } from '../../utils/export';

// Import the new tab components
import OverviewTab from '../../components/Details/OverviewTab';
import DetailsTab from '../../components/Details/DetailsTab';
import EventsTab from '../../components/Details/EventsTab';
import LogsTab from '../../components/Details/LogsTab';

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
      <PageHeader
        ghost={false}
        onBack={() => navigate('home')}
        title={modelData.metadata.name}
        subTitle="Endpoint Details"
        tags={[<Tag color={status.color}>{status.text.toUpperCase()}</Tag>]}
        extra={[
          <Button key="3" onClick={handleExport}>Export YAML</Button>,
          <Button key="2" onClick={() => navigate('upsert', modelData)}>Edit</Button>,
          <Button key="1" type="primary" danger>
            Delete
          </Button>,
        ]}
        style={{ padding: '16px 24px', backgroundColor: '#fff' }}
      />
      <div style={{ padding: '0 24px' }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Overview" key="1">
            <OverviewTab modelData={modelData} />
          </TabPane>
          <TabPane tab="Details" key="2">
            <DetailsTab modelData={modelData} />
          </TabPane>
          <TabPane tab="YAML" key="3">
            <div style={{ border: '1px solid #f0f0f0' }}>
              <Editor
                height="60vh"
                defaultLanguage="yaml"
                value={yamlString}
                options={{ readOnly: true, minimap: { enabled: false } }}
                loading={<Spin />}
              />
            </div>
          </TabPane>
          <TabPane tab="Metrics" key="4">
            <Metrics />
          </TabPane>
          <TabPane tab="Events" key="5">
            <EventsTab namespace={namespace} modelName={modelName} />
          </TabPane>
          <TabPane tab="Logs" key="6">
            <LogsTab namespace={namespace} modelName={modelName} />
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
