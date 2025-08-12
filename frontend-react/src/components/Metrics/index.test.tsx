import React from 'react';
import { render, screen } from '@testing-library/react';
import Metrics from './index';

// Recharts has some issues with Jest and requires mocking.
// This is a common workaround.
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      // Mocking with a fixed size container
      <div className="recharts-responsive-container" style={{ width: 800, height: 300 }}>{children}</div>
    ),
  };
});

describe('Metrics', () => {
  it('should render the component and its charts', () => {
    render(<Metrics />);

    // Check for the main title
    expect(screen.getByText('Model Performance Metrics')).toBeInTheDocument();

    // Check for chart titles within cards
    expect(screen.getByText('Model request per second (QPS)')).toBeInTheDocument();
    expect(screen.getByText('p99 Latency')).toBeInTheDocument();

    // Check for the time range selector
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getByText('1H')).toBeInTheDocument();
  });
});
