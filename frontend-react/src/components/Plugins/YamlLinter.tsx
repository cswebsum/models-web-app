import React from 'react';
import { Alert } from 'antd';

const YamlLinter: React.FC<{ modelData: any }> = ({ modelData }) => {
  // This is a mock linter. A real one would parse the YAML and check for issues.
  const hasIssues = modelData?.metadata?.name?.includes('test');

  return (
    <div style={{ padding: '16px' }}>
      <h4>YAML Lint Results</h4>
      {hasIssues ? (
        <Alert
          message="Linting issues found"
          description="The model name contains 'test', which is not recommended for production."
          type="warning"
          showIcon
        />
      ) : (
        <Alert
          message="No issues found"
          description="The InferenceService YAML appears to be valid."
          type="success"
          showIcon
        />
      )}
    </div>
  );
};

export default YamlLinter;
