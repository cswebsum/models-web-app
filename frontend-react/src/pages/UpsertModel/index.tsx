import React, { useState, useEffect } from 'react';
import { Button, message, Steps, PageHeader, Form } from 'antd';
import BasicInfoStep from '../../components/UpsertModel/BasicInfoStep';
import DefineRevisionsStep from '../../components/UpsertModel/DefineRevisionsStep';
import ConfigureTrafficStep from '../../components/UpsertModel/ConfigureTrafficStep';
import ReviewYamlStep from '../../components/UpsertModel/ReviewYamlStep';

const { Step } = Steps;

interface UpsertModelPageProps {
  modelData?: any; // To pre-populate the form for editing
}

const UpsertModelPage: React.FC<UpsertModelPageProps> = ({ modelData }) => {
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
      await form.validateFields();
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
      <PageHeader
        ghost={false}
        onBack={() => { /* Navigate back */ }}
        title="Create or Update Endpoint"
        subTitle="Use this wizard to configure your model deployment"
      />
      <Steps current={current} style={{ padding: '32px 16px' }}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content" style={{
        minHeight: '400px',
        padding: '16px',
        backgroundColor: '#fafafa',
        marginTop: '16px',
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
  );
};

export default UpsertModelPage;
