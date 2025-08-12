import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const ModelDetails: React.FC = () => {
  return (
    <div>
      <Title level={2}>Model Details</Title>
      <p>This page will show the details for a specific model.</p>
    </div>
  );
};

export default ModelDetails;
