import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HomePage from './index';
import useFetchData from '../../hooks/useFetchData';
import { toast } from 'react-toastify';
import { NamespaceProvider } from '../../store/NamespaceContext';

// Mock the custom hook
jest.mock('../../hooks/useFetchData');
const mockedUseFetchData = useFetchData as jest.Mock;

// Mock the utils
jest.mock('../../utils', () => ({
  processInferenceServices: jest.fn(data =>
    data.map((item: any) => ({ ...item, processed: true })),
  ),
}));

// Mock date-fns to have consistent output
jest.mock('date-fns', () => ({
  formatDistanceToNow: jest.fn(() => 'about 1 hour ago'),
}));

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    info: jest.fn(),
  },
}));

const mockNavigate = jest.fn();

const renderWithProvider = () => {
    return render(
        <NamespaceProvider>
            <HomePage navigate={mockNavigate} />
        </NamespaceProvider>
    );
}

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display a loading spinner while fetching data', () => {
    mockedUseFetchData.mockReturnValue({ data: null, loading: true, error: null });
    renderWithProvider();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should display an error message if data fetching fails', () => {
    const error = new Error('Failed to fetch data');
    mockedUseFetchData.mockReturnValue({ data: null, loading: false, error });
    renderWithProvider();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(error.message)).toBeInTheDocument();
  });

  it('should render the table with data on successful fetch', () => {
    const mockData = [
      {
        name: 'test-service',
        namespace: 'kubeflow-user',
        status: 'Ready',
        age: new Date().toISOString(),
        predictor: 'sklearn',
        runtime: 'v1.0',
        protocol: 'v1',
        storageUri: 'pvc://my-pvc/model',
        url: 'http://test.com',
        raw: {},
      },
    ];
    mockedUseFetchData.mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });
    renderWithProvider();

    expect(screen.getByText('Endpoints')).toBeInTheDocument();
    expect(screen.getByText('test-service')).toBeInTheDocument();
    expect(screen.getByText('sklearn')).toBeInTheDocument();
  });

  it('should show delete confirmation modal when delete button is clicked', () => {
    const mockData = [
      {
        name: 'service-to-delete',
        namespace: 'kubeflow-user',
        status: 'Ready',
        age: new Date().toISOString(),
        url: 'http://delete.com',
      },
    ];
    mockedUseFetchData.mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });
    renderWithProvider();

    const deleteButton = screen.getByRole('button', { name: /delete endpoint service-to-delete/i });
    fireEvent.click(deleteButton);

    expect(screen.getByText('Delete Endpoint')).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete the endpoint "service-to-delete"?/),
    ).toBeInTheDocument();
  });

  it('should call clipboard API when copy button is clicked', () => {
    const mockData = [
      {
        name: 'service-to-copy',
        namespace: 'kubeflow-user',
        status: 'Ready',
        age: new Date().toISOString(),
        url: 'http://copy.com',
      },
    ];
    mockedUseFetchData.mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });
    renderWithProvider();

    const copyButton = screen.getByRole('button', { name: /copy url for endpoint service-to-copy/i });
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://copy.com');
    expect(toast.info).toHaveBeenCalledWith('Endpoint URL copied to clipboard!');
  });
});
