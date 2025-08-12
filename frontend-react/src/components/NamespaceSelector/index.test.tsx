import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NamespaceSelector from './index';
import { NamespaceProvider, useNamespace } from '../../store/NamespaceContext';

// A helper component to display the current context value for testing
const TestDisplay = () => {
  const { selectedNamespace } = useNamespace();
  return <div data-testid="namespace-display">{selectedNamespace}</div>;
};

describe('NamespaceSelector', () => {
  it('should render with the default value and update the context on change', async () => {
    render(
      <NamespaceProvider>
        <NamespaceSelector />
        <TestDisplay />
      </NamespaceProvider>
    );

    // Check the initial state
    expect(screen.getByTestId('namespace-display')).toHaveTextContent('kubeflow-user');

    // Open the dropdown
    fireEvent.mouseDown(screen.getByRole('combobox'));

    // Find and click the 'production' option.
    // Ant Design renders the dropdown options in a portal, so they might not be in the main container.
    // We wait for the option to be available.
    const productionOption = await screen.findByText('production');
    fireEvent.click(productionOption);

    // Check if the context value has been updated
    expect(screen.getByTestId('namespace-display')).toHaveTextContent('production');

    // The displayed value in the Select component itself should also be updated
    expect(screen.getByRole('combobox')).toHaveTextContent('production');
  });
});
