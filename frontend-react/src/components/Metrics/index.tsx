import React, { useState } from 'react';
import { Card, Col, Radio, Row, Typography } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const { Title } = Typography;

// Mock data for the charts
const generateMockData = () => {
  const data = [];
  for (let i = 10; i >= 0; i--) {
    const d = new Date();
    d.setMinutes(d.getMinutes() - i * 5);
    data.push({
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      qps: Math.random() * 0.25,
      latency: 5 + Math.random() * 10,
    });
  }
  return data;
};

const mockData = generateMockData();

const Metrics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('1h');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title level={4} style={{ margin: 0 }}>Model Performance Metrics</Title>
        <Radio.Group value={timeRange} onChange={e => setTimeRange(e.target.value)}>
          <Radio.Button value="1h">1H</Radio.Button>
          <Radio.Button value="6h">6H</Radio.Button>
          <Radio.Button value="24h">24H</Radio.Button>
        </Radio.Group>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Model request per second (QPS)">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="qps" stroke="#8884d8" name="QPS" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="p99 Latency">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis unit="ms" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="latency" stroke="#82ca9d" name="Latency (ms)" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Metrics;
