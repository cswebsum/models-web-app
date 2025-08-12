import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UpsertModelPage from './index';

// Mock the child step components to isolate the wizard logic
jest.mock('../../components/UpsertModel/BasicInfoStep', () => () => <div>Basic Info Step</div>);
jest.mock('../../components/UpsertModel/DefineRevisionsStep', () => () => <div>Define Revisions Step</div>);
jest.mock('../../components/UpsertModel/ConfigureTrafficStep', () => () => <div>Configure Traffic Step</div>);
jest.mock('../../components/UpsertModel/ReviewYamlStep', () => () => <div>Review YAML Step</div>);

// Mock Ant Design message
jest.mock('antd', () => {
  const antd = jest.requireActual('antd');
  return {
    ...antd,
    message: {
      success: jest.fn(),
    },
  };
});

describe('UpsertModelPage Wizard', () => {
  it('should render the first step initially', () => {
    render(<UpsertModelPage />);
    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Basic Info Step')).toBeInTheDocument();
  });

  it('should navigate to the next step when "Next" is clicked', async () => {
    render(<UpsertModelPage />);

    // Click Next button
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // We need to wait for the state update
    expect(await screen.findByText('Define Revisions Step')).toBeInTheDocument();
    expect(screen.queryByText('Basic Info Step')).not.toBeInTheDocument();
  });

  it('should navigate to the previous step when "Previous" is clicked', async () => {
    render(<UpsertModelPage />);

    // Go to the second step
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    await screen.findByText('Define Revisions Step');

    // Go back to the first step
    const prevButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(prevButton);

    expect(await screen.findByText('Basic Info Step')).toBeInTheDocument();
    expect(screen.queryByText('Define Revisions Step')).not.toBeInTheDocument();
  });

  it('should show the "Done" button only on the last step', async () => {
    render(<UpsertModelPage />);

    const nextButton = screen.getByRole('button', { name: /next/i });

    // Navigate to the last step
    fireEvent.click(nextButton); // Step 2
    await screen.findByText('Define Revisions Step');
    fireEvent.click(nextButton); // Step 3
    await screen.findByText('Configure Traffic Step');
    fireEvent.click(nextButton); // Step 4
    await screen.findByText('Review YAML Step');

    expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument();
  });
});
