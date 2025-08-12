import React from 'react';
import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const DefineRevisionsStep: React.FC = () => {
  return (
    <Form.List name="revisions">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
              <Form.Item
                {...restField}
                name={[name, 'name']}
                rules={[{ required: true, message: 'Missing revision name' }]}
              >
                <Input placeholder="Revision Name (e.g., v1)" />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, 'storageUri']}
                rules={[{ required: true, message: 'Missing Storage URI' }]}
                style={{ width: '300px' }}
              >
                <Input placeholder="Storage URI (e.g., pvc://...)" />
              </Form.Item>
              <MinusCircleOutlined onClick={() => remove(name)} />
            </Space>
          ))}
          <Form.Item>
            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
              Add Model Revision
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

export default DefineRevisionsStep;
