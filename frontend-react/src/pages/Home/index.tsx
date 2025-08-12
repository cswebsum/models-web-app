import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const Home: React.FC = () => {
  return (
    <div>
      <Title level={2}>Home Page</Title>
      <p>This is the home page. A list of models will be displayed here.</p>
    </div>
  );
};

export default Home;
