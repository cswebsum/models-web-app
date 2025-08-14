import React from 'react';
import { Typography, Card } from 'antd';
import ContainerInfo from './ContainerInfo';
import ComponentExtensionInfo from './ComponentExtensionInfo';
import PodStatus from './PodStatus';

const { Title } = Typography;

interface OverviewTabProps {
  modelData: any;
}

const ServiceComponent: React.FC<{ name: string, componentData: any }> = ({ name, componentData }) => {
  if (!componentData) {
    return null;
  }

  // The spec can have different structures. We try to find the container spec within.
  // This is a simplification of the complex logic in the original app.
  const mainSpec = componentData.sklearn || componentData.xgboost || componentData.tensorflow ||
                   componentData.pytorch || componentData.triton || componentData.onnx ||
                   componentData.pmml || componentData.lightgbm || componentData.mlflow || componentData;

  return (
    <Card title={name} type="inner" style={{ marginTop: '16px' }}>
      <ContainerInfo container={mainSpec || componentData} />
      <ComponentExtensionInfo spec={componentData} />
      <PodStatus pod={componentData} />
    </Card>
  );
};

const OverviewTab: React.FC<OverviewTabProps> = ({ modelData }) => {
  const spec = modelData?.spec;

  if (!spec) {
    return <p>No spec data available.</p>;
  }

  return (
    <div>
      <Title level={4} style={{ marginBottom: '24px' }}>Service Components</Title>
      <ServiceComponent name="Predictor" componentData={spec.predictor} />
      <ServiceComponent name="Transformer" componentData={spec.transformer} />
      <ServiceComponent name="Explainer" componentData={spec.explainer} />
    </div>
  );
};

export default OverviewTab;
