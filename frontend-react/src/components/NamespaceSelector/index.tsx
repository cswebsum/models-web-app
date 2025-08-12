import React from 'react';
import { Select, Spin } from 'antd';
import { useNamespace } from '../../store/NamespaceContext';
import useFetchData from '../../hooks/useFetchData';

const { Option } = Select;

// Mocked namespace data structure
interface Namespace {
  name: string;
}

const mockNamespaces: Namespace[] = [
    { name: 'kubeflow-user' },
    { name: 'production' },
    { name: 'staging' },
    { name: 'research' },
];

const NamespaceSelector: React.FC = () => {
  const { selectedNamespace, setSelectedNamespace } = useNamespace();

  // Using mocked data for now. To use a real API, you would replace this line.
  // const { data: namespaces, loading } = useFetchData<Namespace[]>(`/api/v1/namespaces`);
  const namespaces = mockNamespaces;
  const loading = false;

  const handleChange = (value: string) => {
    setSelectedNamespace(value);
  };

  if (loading) {
    return <Spin size="small" />;
  }

  return (
    <Select
      value={selectedNamespace}
      style={{ width: 200 }}
      onChange={handleChange}
      loading={loading}
    >
      {(namespaces || []).map(ns => (
        <Option key={ns.name} value={ns.name}>
          {ns.name}
        </Option>
      ))}
    </Select>
  );
};

export default NamespaceSelector;
