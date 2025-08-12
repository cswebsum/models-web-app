import React from 'react';
import { Form, Input, Select } from 'antd';

const { Option } = Select;

interface BasicInfoStepProps {
  form: any; // Ant Design Form instance
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ form }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      name="basic_info"
      initialValues={{ namespace: 'kubeflow-user' }}
    >
      <Form.Item
        name="name"
        label="Endpoint Name"
        rules={[{ required: true, message: 'Please input the endpoint name!' }]}
      >
        <Input placeholder="e.g., my-model" />
      </Form.Item>
      <Form.Item
        name="namespace"
        label="Namespace"
        rules={[{ required: true, message: 'Please select a namespace!' }]}
      >
        <Select>
          <Option value="kubeflow-user">kubeflow-user</Option>
          <Option value="production">production</Option>
          <Option value="staging">staging</Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

export default BasicInfoStep;
