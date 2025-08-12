import React, { useMemo, useState } from 'react';
import {
  Table,
  Spin,
  Alert,
  Tag,
  Button,
  Space,
  Modal,
  Typography,
} from 'antd';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { ColumnsType } from 'antd/es/table';
import { formatDistanceToNow } from 'date-fns';
import useFetchData from '../../hooks/useFetchData';
import { processInferenceServices } from '../../utils';
import { InferenceService } from '../../types';
import StorageUri from '../../components/StorageUri';
import { useNamespace } from '../../store/NamespaceContext';

const { Title } = Typography;

interface HomePageProps {
  navigate: (page: 'details' | 'upsert', context?: any) => void;
}

const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { t } = useTranslation();
  const { selectedNamespace } = useNamespace();
  const {
    data: rawData,
    loading,
    error,
    refetch,
  } = useFetchData<any[]>(`/api/v1/namespaces/${selectedNamespace}/inferenceservices`);

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
    toast.success(`Endpoint ${selectedService.name} deleted successfully.`);
    setIsModalVisible(false);
    setSelectedService(null);
    refetch();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedService(null);
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.info('Endpoint URL copied to clipboard!');
  };

  const columns: ColumnsType<InferenceService> = [
    {
      title: t('table.status'),
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'Ready' ? 'green' : 'volcano'}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: t('table.name'),
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Button type="link" onClick={() => navigate('details', { name: record.name, namespace: record.namespace })}>
          {name}
        </Button>
      ),
    },
    {
      title: t('table.age'),
      dataIndex: 'age',
      key: 'age',
      render: age => formatDistanceToNow(new Date(age), { addSuffix: true }),
    },
    {
      title: t('table.predictor'),
      dataIndex: 'predictor',
      key: 'predictor',
    },
    {
      title: t('table.runtime'),
      dataIndex: 'runtime',
      key: 'runtime',
    },
    {
      title: t('table.storageUri'),
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
      title: t('table.actions'),
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => handleCopy(record.url || '')}
            disabled={!record.url}
            aria-label={`Copy URL for endpoint ${record.name}`}
          >
            {t('actions.copyUrl')}
          </Button>
          <Button
            type="link"
            danger
            onClick={() => showDeleteModal(record)}
            aria-label={`Delete endpoint ${record.name}`}
          >
            {t('actions.delete')}
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>{t('home.title')}</Title>
        <Button type="primary" onClick={() => navigate('upsert')}>
          {t('home.createEndpoint')}
        </Button>
      </div>
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
