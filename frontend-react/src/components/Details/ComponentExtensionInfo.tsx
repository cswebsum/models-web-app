import React from 'react';
import { Descriptions, Card } from 'antd';

// Simplified interface based on ComponentExtensionSpec
interface ComponentExtensionSpec {
  minReplicas?: number;
  maxReplicas?: number;
  containerConcurrency?: number;
  timeout?: number;
  canaryTrafficPercent?: number;
  logger?: {
    url?: string;
    mode?: string;
  };
  batcher?: {
    maxBatchSize?: number;
    maxLatency?: number;
    timeout?: number;
  };
}

interface ComponentExtensionInfoProps {
  spec?: ComponentExtensionSpec;
}

const ComponentExtensionInfo: React.FC<ComponentExtensionInfoProps> = ({ spec }) => {
  if (!spec) {
    return null;
  }

  const renderItem = (label: string, value: any, suffix = '') => {
    if (value === undefined || value === null) return null;
    return <Descriptions.Item label={label}>{value}{suffix}</Descriptions.Item>;
  };

  return (
    <Card title="Component Extension Spec" size="small" style={{ marginTop: '16px' }}>
      <Descriptions bordered column={1} size="small">
        {renderItem('Minimum Replicas', spec.minReplicas)}
        {renderItem('Maximum Replicas', spec.maxReplicas)}
        {renderItem('Container Concurrency', spec.containerConcurrency)}
        {renderItem('Timeout', spec.timeout)}
        {renderItem('Canary Traffic Percent', spec.canaryTrafficPercent, ' %')}
        {renderItem('Logging URL', spec.logger?.url)}
        {renderItem('Logging Mode', spec.logger?.mode)}
        {renderItem('Max Batch Size', spec.batcher?.maxBatchSize)}
        {renderItem('Max Latency', spec.batcher?.maxLatency)}
        {renderItem('Batcher Timeout', spec.batcher?.timeout)}
      </Descriptions>
    </Card>
  );
};

export default ComponentExtensionInfo;
