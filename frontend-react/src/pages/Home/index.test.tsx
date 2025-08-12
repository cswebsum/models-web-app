import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './index';

test('renders home page title', () => {
  render(<Home />);
  const titleElement = screen.getByText(/Home Page/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders home page welcome message', () => {
  render(<Home />);
  const linkElement = screen.getByText(/A list of models will be displayed here./i);
  expect(linkElement).toBeInTheDocument();
});
