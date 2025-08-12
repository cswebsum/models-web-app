import React, { useMemo, useState } from 'react';
import {
  Table,
  Spin,
  Alert,
  Tag,
  Button,
  Space,
  Modal,
  message,
  Typography,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { formatDistanceToNow } from 'date-fns';
import useFetchData from '../../hooks/useFetchData';
import { processInferenceServices } from '../../utils';
import { InferenceService } from '../../types';
import StorageUri from '../../components/StorageUri';

const { Title } = Typography;

const HomePage: React.FC = () => {
  // In a real app, the namespace would come from a selector, like in the Angular app
  const currentNamespace = 'kubeflow-user';
  const {
    data: rawData,
    loading,
    error,
  } = useFetchData<any[]>(`/api/v1/namespaces/${currentNamespace}/inferenceservices`);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<InferenceService | null>(
    null,
  );

  const processedData = useMemo(
    () => (rawData ? processInferenceServices(rawData) : []),
    [rawData],
  );

  const showDeleteModal = (service: InferenceService) => {
    setSelectedService(service);
    setIsModalVisible(true);
  };

  const handleDelete = () => {
    if (!selectedService) return;
    console.log('Deleting service:', selectedService.name);
    // Here you would typically call an API to delete the service
    // e.g., fetch(`/api/v1/namespaces/${selectedService.namespace}/inferenceservices/${selectedService.name}`, { method: 'DELETE' });
    message.success(`Endpoint ${selectedService.name} deleted successfully.`);
    setIsModalVisible(false);
    setSelectedService(null);
    // Here you would also refetch the data
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedService(null);
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    message.success('Endpoint URL copied to clipboard!');
  };

  const columns: ColumnsType<InferenceService> = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'Ready' ? 'green' : 'volcano'}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      render: age => formatDistanceToNow(new Date(age), { addSuffix: true }),
    },
    {
      title: 'Predictor',
      dataIndex: 'predictor',
      key: 'predictor',
    },
    {
      title: 'Runtime',
      dataIndex: 'runtime',
      key: 'runtime',
    },
    {
      title: 'Storage URI',
      dataIndex: 'storageUri',
      key: 'storageUri',
      render: (storageUri, record) => (
        <StorageUri
          namespace={record.namespace}
          predictor={{ storageUri }}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleCopy(record.url || '')} disabled={!record.url}>
            Copy URL
          </Button>
          <Button type="link" danger onClick={() => showDeleteModal(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message="Error" description={error.message} type="error" showIcon />;
  }

  return (
    <div>
      <Title level={2}>Endpoints</Title>
      <Table columns={columns} dataSource={processedData} rowKey="name" />
      <Modal
        title="Delete Endpoint"
        visible={isModalVisible}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete the endpoint "{selectedService?.name}"?</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default HomePage;
