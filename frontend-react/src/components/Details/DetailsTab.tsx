import React from 'react';
import { Typography, Collapse } from 'antd';
import ContainerInfo from './ContainerInfo';
import ComponentExtensionInfo from './ComponentExtensionInfo';
import PodStatus from './PodStatus';

const { Title } = Typography;
const { Panel } = Collapse;

interface DetailsTabProps {
  modelData: any;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ modelData }) => {
  const spec = modelData?.spec;

  if (!spec) {
    return <p>No spec data available.</p>;
  }

  const renderComponentDetails = (name: string, componentData: any) => {
    if (!componentData) return null;

    const mainSpec = componentData.sklearn || componentData.xgboost || componentData.tensorflow ||
                     componentData.pytorch || componentData.triton || componentData.onnx ||
                     componentData.pmml || componentData.lightgbm || componentData.mlflow || componentData;

    return (
      <Panel header={name} key={name.toLowerCase()}>
        <ContainerInfo container={mainSpec || componentData} />
        <ComponentExtensionInfo spec={componentData} />
        <PodStatus pod={componentData} />
      </Panel>
    );
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: '24px' }}>Component Specs</Title>
      <Collapse accordion>
        {renderComponentDetails('Predictor', spec.predictor)}
        {renderComponentDetails('Transformer', spec.transformer)}
        {renderComponentDetails('Explainer', spec.explainer)}
      </Collapse>
    </div>
  );
};

export default DetailsTab;
