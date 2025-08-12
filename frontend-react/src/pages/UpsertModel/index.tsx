import React, { useState, useEffect } from 'react';
import { Button, message, Steps, Form, Typography, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import BasicInfoStep from '../../components/UpsertModel/BasicInfoStep';
import DefineRevisionsStep from '../../components/UpsertModel/DefineRevisionsStep';
import ConfigureTrafficStep from '../../components/UpsertModel/ConfigureTrafficStep';
import ReviewYamlStep from '../../components/UpsertModel/ReviewYamlStep';

const { Step } = Steps;
const { Title, Text } = Typography;

interface UpsertModelPageProps {
  modelData?: any; // To pre-populate the form for editing
  navigate: (page: 'home') => void; // Added navigate prop
}

const UpsertModelPage: React.FC<UpsertModelPageProps> = ({ modelData, navigate }) => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();

  useEffect(() => {
    if (modelData) {
      // This is a simplified pre-population logic
      // A real implementation would need to transform the modelData
      // into the exact structure the form expects.
      form.setFieldsValue({
        name: modelData.metadata.name,
        namespace: modelData.metadata.namespace,
        // More complex fields like revisions and traffic would be set here
      });
    }
  }, [modelData, form]);

  const steps = [
    {
      title: 'Basic Information',
      content: <BasicInfoStep form={form} />,
    },
    {
      title: 'Define Revisions',
      content: <DefineRevisionsStep />,
    },
    {
      title: 'Configure Traffic',
      content: <ConfigureTrafficStep />,
    },
    {
      title: 'Review YAML',
      content: <ReviewYamlStep />,
    },
  ];

  const next = async () => {
    try {
      // Validate the current step's form fields
      if (current === 0) { // Only validate basic info for now
        await form.validateFields(['name', 'namespace']);
      }
      if (current === 2) { // Validate traffic split
        await form.validateFields([['revisions']]);
      }
      setCurrent(current + 1);
    } catch (error) {
      console.log('Validation Failed:', error);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleDone = async () => {
    try {
      const values = await form.getFieldsValue(true);
      console.log('Form Values:', values);
      message.success('Processing complete!');
      // Here you would generate the YAML and submit
    } catch (error) {
      console.log('Failed:', error);
    }
  };

  return (
    <div>
      <div style={{ padding: '16px 24px', backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0', marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('home')}>
                Back to Endpoints
            </Button>
            <div>
                <Title level={3} style={{ margin: 0 }}>
                Create or Update Endpoint
                </Title>
                <Text type="secondary">Use this wizard to configure your model deployment</Text>
            </div>
        </Space>
      </div>

      <div style={{ padding: '0 24px' }}>
        <Steps current={current}>
            {steps.map(item => (
            <Step key={item.title} title={item.title} />
            ))}
        </Steps>
        <div className="steps-content" style={{
            minHeight: '400px',
            padding: '24px',
            backgroundColor: '#fafafa',
            marginTop: '24px',
            border: '1px dashed #e9e9e9'
        }}>
            {steps[current].content}
        </div>
        <div className="steps-action" style={{ marginTop: '24px', textAlign: 'right' }}>
            {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
                Next
            </Button>
            )}
            {current === steps.length - 1 && (
            <Button type="primary" onClick={handleDone}>
                Done
            </Button>
            )}
            {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                Previous
            </Button>
            )}
        </div>
      </div>
    </div>
  );
};

export default UpsertModelPage;
