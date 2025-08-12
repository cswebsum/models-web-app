import React, { useState, useEffect } from 'react';
import { Button, message, Steps, Form } from 'antd';
import { PageHeader } from '@ant-design/pro-components';
import BasicInfoStep from '../../components/UpsertModel/BasicInfoStep';
import DefineRevisionsStep from '../../components/UpsertModel/DefineRevisionsStep';
import ConfigureTrafficStep from '../../components/UpsertModel/ConfigureTrafficStep';
import ReviewYamlStep from '../../components/UpsertModel/ReviewYamlStep';

const { Step } = Steps;

interface UpsertModelPageProps {
  modelData?: any; // To pre-populate the form for editing
  navigate: (page: 'home') => void;
}

const UpsertModelPage: React.FC<UpsertModelPageProps> = ({ modelData, navigate }) => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();

  useEffect(() => {
    if (modelData) {
      form.setFieldsValue({
        name: modelData.metadata.name,
        namespace: modelData.metadata.namespace,
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
      if (current === 0) {
        await form.validateFields(['name', 'namespace']);
      }
      if (current === 2) {
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
    } catch (error) {
      console.log('Failed:', error);
    }
  };

  return (
    <div>
      <PageHeader
        ghost={false}
        onBack={() => navigate('home')}
        title="Create or Update Endpoint"
        subTitle="Use this wizard to configure your model deployment"
        style={{ padding: '16px 24px', backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0' }}
      />
      <div style={{ padding: '24px' }}>
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
