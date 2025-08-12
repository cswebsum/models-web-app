import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Notifications from './index';

// Mock date-fns to have consistent output
jest.mock('date-fns', () => ({
  formatDistanceToNow: jest.fn((date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60000) return 'less than a minute ago';
    if (diff < 120000) return '1 minute ago';
    return `${Math.floor(diff / 60000)} minutes ago`;
  }),
}));

describe('Notifications Component', () => {
  it('should render the bell icon and the correct unread count', () => {
    render(<Notifications />);

    // The badge shows the count of unread notifications (2 in our mock data)
    expect(screen.getByText('2')).toBeInTheDocument();

    // The bell icon itself is present
    expect(screen.getByRole('img', { name: /bell/i })).toBeInTheDocument();
  });

  it('should display the notification dropdown when the bell is clicked', () => {
    render(<Notifications />);

    const bellIcon = screen.getByRole('img', { name: /bell/i });
    fireEvent.click(bellIcon);

    // Check for content from the dropdown menu
    expect(screen.getByText('Deployment successful')).toBeInTheDocument();
    expect(screen.getByText('Deployment failed')).toBeInTheDocument();
    expect(screen.getByText('View all notifications')).toBeInTheDocument();
  });
});
