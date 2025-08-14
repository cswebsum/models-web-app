import React from 'react';
import { Table, Spin, Alert, Tag, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { formatDistanceToNow } from 'date-fns';
import useFetchData from '../../hooks/useFetchData';

const { Title } = Typography;

interface K8sEvent {
  // Simplified Kubernetes Event structure
  lastTimestamp: string;
  type: 'Normal' | 'Warning';
  reason: string;
  regarding: {
    name: string;
    kind: string;
  };
  note: string;
}

interface EventsTabProps {
  namespace: string;
  modelName: string;
}

// Mocked event data
const mockEvents: K8sEvent[] = [
    {
        lastTimestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        type: 'Normal',
        reason: 'ScalingReplicaSet',
        regarding: { name: 'my-model-predictor-00001', kind: 'ReplicaSet' },
        note: 'Scaled up replica set my-model-predictor-00001 to 1',
    },
    {
        lastTimestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        type: 'Normal',
        reason: 'SuccessfulCreate',
        regarding: { name: 'my-model-predictor-00001-pod-xyz', kind: 'Pod' },
        note: 'Created pod: my-model-predictor-00001-pod-xyz',
    },
];

const EventsTab: React.FC<EventsTabProps> = ({ namespace, modelName }) => {
  // In a real app, the URL would be dynamic and use the props
  // const { data, loading, error } = useFetchData<K8sEvent[]>(`/api/v1/namespaces/${namespace}/events?labelSelector=...`);
  const data = mockEvents;
  const loading = false;
  const error = null;

  const columns: ColumnsType<K8sEvent> = [
    {
      title: 'Last Seen',
      dataIndex: 'lastTimestamp',
      key: 'lastTimestamp',
      render: ts => formatDistanceToNow(new Date(ts), { addSuffix: true }),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: type => <Tag color={type === 'Normal' ? 'blue' : 'orange'}>{type}</Tag>,
    },
    { title: 'Reason', dataIndex: 'reason', key: 'reason' },
    {
      title: 'Object',
      dataIndex: 'regarding',
      key: 'object',
      render: regarding => `${regarding.kind}/${regarding.name}`,
    },
    { title: 'Message', dataIndex: 'note', key: 'note' },
  ];

  if (loading) {
    return <Spin />;
  }

  if (error) {
    return <Alert message="Error fetching events" description={(error as Error).message} type="error" />;
  }

  return (
    <div>
      <Title level={4} style={{ marginBottom: '24px' }}>Events</Title>
      <Table columns={columns} dataSource={data} rowKey={(r) => `${r.lastTimestamp}-${r.regarding.name}`} />
    </div>
  );
};

export default EventsTab;
