import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const NewModel: React.FC = () => {
  return (
    <div>
      <Title level={2}>Create New Model</Title>
      <p>This page will contain the form to submit a new model.</p>
    </div>
  );
};

export default NewModel;
