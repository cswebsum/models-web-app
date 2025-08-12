import React from 'react';
import { render, screen } from '@testing-library/react';
import StorageUri from './index';
import { PredictorExtension } from '../../types';

describe('StorageUri', () => {
  it('should render a link for a PVC storage URI', () => {
    const predictor: PredictorExtension = {
      storageUri: 'pvc://my-pvc-name/models/model-1',
    };
    const namespace = 'my-namespace';

    render(<StorageUri namespace={namespace} predictor={predictor} />);

    const linkElement = screen.getByRole('link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute(
      'href',
      '/volumes/volume/details/my-namespace/my-pvc-name',
    );
    expect(linkElement).toHaveTextContent(predictor.storageUri!);
  });

  it('should render plain text for a non-PVC storage URI', () => {
    const predictor: PredictorExtension = {
      storageUri: 's3://my-bucket/models/model-1',
    };
    const namespace = 'my-namespace';

    render(<StorageUri namespace={namespace} predictor={predictor} />);

    const textElement = screen.getByText(predictor.storageUri!);
    expect(textElement).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should render nothing if storageUri is not provided', () => {
    const predictor: PredictorExtension = {};
    const namespace = 'my-namespace';

    const { container } = render(
      <StorageUri namespace={namespace} predictor={predictor} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
