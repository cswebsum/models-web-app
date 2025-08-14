import React from 'react';
import { Descriptions, Card } from 'antd';

// A simplified interface based on the V1PodSpec fields used in the original component
interface PodSpec {
  serviceAccountName?: string;
  serviceAccount?: string;
  activeDeadlineSeconds?: number;
  automountServiceAccountToken?: boolean;
  dnsPolicy?: string;
  enableServiceLinks?: boolean;
  hostIPC?: boolean;
  hostNetwork?: boolean;
  hostPID?: boolean;
  hostname?: string;
  subdomain?: string;
}

interface PodStatusProps {
  pod?: PodSpec;
}

const PodStatus: React.FC<PodStatusProps> = ({ pod }) => {
  if (!pod) {
    return null;
  }

  // Helper to render items only if they exist
  const renderItem = (label: string, value: any) => {
    if (value === undefined || value === null) return null;
    return (
      <Descriptions.Item label={label}>
        {typeof value === 'boolean' ? String(value) : value}
      </Descriptions.Item>
    );
  };

  return (
    <Card title="Pod Spec" size="small">
      <Descriptions bordered column={1} size="small">
        {renderItem('Service Account Name', pod.serviceAccountName)}
        {renderItem('Service Account', pod.serviceAccount)}
        {renderItem('Active Deadline Seconds', pod.activeDeadlineSeconds)}
        {renderItem('Automount ServiceAccount Token', pod.automountServiceAccountToken)}
        {renderItem('DNS Policy', pod.dnsPolicy)}
        {renderItem('Enable Service Links', pod.enableServiceLinks)}
        {renderItem('Host IPC Namespace', pod.hostIPC)}
        {renderItem('Host Network Namespace', pod.hostNetwork)}
        {renderItem('Host PID Namespace', pod.hostPID)}
        {renderItem('Hostname', pod.hostname)}
        {renderItem('Subdomain', pod.subdomain)}
      </Descriptions>
    </Card>
  );
};

export default PodStatus;
