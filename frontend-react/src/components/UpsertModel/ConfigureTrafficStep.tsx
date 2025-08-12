import React from 'react';
import { Form, Slider, InputNumber, Row, Col, Typography } from 'antd';

const { Text } = Typography;

const ConfigureTrafficStep: React.FC = () => {
  const form = Form.useFormInstance();
  const revisions = Form.useWatch('revisions', form) || [];

  const handleSliderChange = (changedIndex: number, newValue: number) => {
    const newRevisions = [...revisions];
    let total = 0;

    // Calculate the total of all sliders except the one being changed
    newRevisions.forEach((rev, index) => {
      if (index !== changedIndex) {
        total += rev.traffic || 0;
      }
    });

    // Clamp the new value to not exceed 100 - total of others
    const clampedValue = Math.min(newValue, 100 - total);
    newRevisions[changedIndex] = { ...newRevisions[changedIndex], traffic: clampedValue };

    // This is a simplified logic. A more robust solution would distribute
    // the remainder, but for now, we just update the one slider.
    // A validation rule will enforce the 100% total.
    form.setFieldsValue({ revisions: newRevisions });
  };

  return (
    <div>
      <Text type="secondary">
        Define the percentage of traffic that should be routed to each model revision. The total must add up to 100%.
      </Text>
      <Form.List name="revisions">
        {(fields) => (
          <div style={{ marginTop: '24px' }}>
            {fields.map((field, index) => {
              const revisionName = revisions[index]?.name || `Revision ${index + 1}`;
              return (
                <Form.Item key={field.key} label={revisionName}>
                  <Row>
                    <Col span={12}>
                      <Slider
                        min={0}
                        max={100}
                        onChange={(value) => handleSliderChange(index, value)}
                        value={revisions[index]?.traffic || 0}
                      />
                    </Col>
                    <Col span={4}>
                      <InputNumber
                        min={0}
                        max={100}
                        style={{ margin: '0 16px' }}
                        value={revisions[index]?.traffic || 0}
                        onChange={(value) => handleSliderChange(index, value as number)}
                      />
                    </Col>
                  </Row>
                </Form.Item>
              );
            })}
          </div>
        )}
      </Form.List>
       <Form.Item
        shouldUpdate={(prevValues, curValues) => prevValues.revisions !== curValues.revisions}
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              const revs = getFieldValue('revisions') || [];
              const totalTraffic = revs.reduce((acc: number, cur: any) => acc + (cur?.traffic || 0), 0);
              if (totalTraffic !== 100) {
                return Promise.reject(new Error(`Total traffic must be 100%. Current total is ${totalTraffic}%.`));
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        {/* This is a hidden field for validation summary */}
        <div />
      </Form.Item>
    </div>
  );
};

export default ConfigureTrafficStep;
