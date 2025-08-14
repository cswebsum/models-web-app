import React from 'react';
import { Spin, Alert, Typography, Button } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import useFetchData from '../../hooks/useFetchData';

const { Title } = Typography;

interface LogsTabProps {
  namespace: string;
  modelName: string;
}

// Mocked log data
const mockLogs = `
[INFO] 2025-08-13T01:36:00Z: Starting model server...
[INFO] 2025-08-13T01:36:01Z: Loading model 'my-model' from storage...
[INFO] 2025-08-13T01:36:05Z: Model 'my-model' loaded successfully.
[INFO] 2025-08-13T01:36:05Z: Server listening on port 8080.
[ACCESS] 2025-08-13T01:37:10Z: POST /v1/models/my-model:predict 200
[ACCESS] 2025-08-13T01:37:15Z: POST /v1/models/my-model:predict 200
`;

const LogsTab: React.FC<LogsTabProps> = ({ namespace, modelName }) => {
  // In a real app, the URL would be dynamic and use the props
  // const { data, loading, error, refetch } = useFetchData<string>(`/api/v1/namespaces/${namespace}/inferenceservices/${modelName}/logs`);
  const data = mockLogs;
  const loading = false;
  const error = null;
  const refetch = () => console.log('Refetching logs...');

  if (loading) {
    return <Spin />;
  }

  if (error) {
    return <Alert message="Error fetching logs" description={(error as Error).message} type="error" />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={4} style={{ margin: 0 }}>Logs</Title>
        <Button icon={<SyncOutlined />} onClick={() => refetch()}>
          Refresh
        </Button>
      </div>
      <div style={{ border: '1px solid #f0f0f0' }}>
        <Editor
          height="60vh"
          defaultLanguage="log"
          value={data}
          options={{ readOnly: true, minimap: { enabled: false } }}
          loading={<Spin />}
        />
      </div>
    </div>
  );
};

export default LogsTab;
