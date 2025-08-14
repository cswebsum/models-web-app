import React, { useMemo } from 'react';
import { Descriptions, Card, Tag, Space } from 'antd';

// Simplified interface for V1Container
interface EnvVar {
  name: string;
  value: string;
}

interface ResourceRequirements {
  limits?: { [key: string]: string };
  requests?: { [key: string]: string };
}

interface Container {
  name?: string;
  image?: string;
  command?: string[];
  args?: string[];
  env?: EnvVar[];
  resources?: ResourceRequirements;
}

interface ContainerInfoProps {
  container?: Container;
}

const ContainerInfo: React.FC<ContainerInfoProps> = ({ container }) => {
  if (!container) {
    return null;
  }

  const cmd = useMemo(() => {
    if (!container.command) return null;
    let commandStr = container.command.join(' ');
    if (container.args) {
      commandStr += ' ' + container.args.join(' ');
    }
    return commandStr;
  }, [container.command, container.args]);

  const renderItem = (label: string, value: any) => {
    if (value === undefined || value === null) return null;
    return <Descriptions.Item label={label}>{value}</Descriptions.Item>;
  };

  return (
    <Card title={`Container: ${container.name}`} size="small" style={{ marginTop: '16px' }}>
      <Descriptions bordered column={1} size="small">
        {renderItem('Image', container.image)}
        {renderItem('Command', cmd)}
        {renderItem('CPU Limits', container.resources?.limits?.cpu)}
        {renderItem('CPU Requests', container.resources?.requests?.cpu)}
        {renderItem('Memory Limits', container.resources?.limits?.memory)}
        {renderItem('Memory Requests', container.resources?.requests?.memory)}
        {container.env && container.env.length > 0 && (
          <Descriptions.Item label="Environment">
            <Space size={[0, 8]} wrap>
              {container.env.map(envVar => (
                <Tag key={envVar.name}>{`${envVar.name}: ${envVar.value}`}</Tag>
              ))}
            </Space>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
};

export default ContainerInfo;
