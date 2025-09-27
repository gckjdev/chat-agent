import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CopyButton from '../../components/CopyButton';

/**
 * Unit tests for CopyButton component
 * Tests component rendering, props handling, and user interactions
 */

// Mock clipboard API
const mockWriteText = jest.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

// Mock console methods to avoid noise in tests
console.error = jest.fn();
console.log = jest.fn();

describe('CopyButton Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWriteText.mockResolvedValue(undefined);
  });

  test('renders copy button with correct attributes', () => {
    render(<CopyButton content="test content" />);
    
    const button = screen.getByTestId('copy-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-label', expect.stringContaining('copy'));
  });

  test('renders copy icon inside button', () => {
    render(<CopyButton content="test content" />);
    
    const button = screen.getByTestId('copy-button');
    const icon = button.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  test('calls clipboard API when clicked', async () => {
    const testContent = 'Test content to copy';
    render(<CopyButton content={testContent} />);
    
    const button = screen.getByTestId('copy-button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(testContent);
    });
  });

  test('calls onCopySuccess callback when copy succeeds', async () => {
    const mockOnCopySuccess = jest.fn();
    render(<CopyButton content="test" onCopySuccess={mockOnCopySuccess} />);
    
    const button = screen.getByTestId('copy-button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockOnCopySuccess).toHaveBeenCalled();
    });
  });

  test('shows success feedback after successful copy', async () => {
    render(<CopyButton content="test content" />);
    
    const button = screen.getByTestId('copy-button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByTestId('copy-feedback')).toBeInTheDocument();
    });
  });

  test('shows error feedback when copy fails', async () => {
    mockWriteText.mockRejectedValue(new Error('Permission denied'));
    
    render(<CopyButton content="test content" />);
    
    const button = screen.getByTestId('copy-button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByTestId('copy-error')).toBeInTheDocument();
    });
  });

  test('handles empty content gracefully', async () => {
    render(<CopyButton content="" />);
    
    const button = screen.getByTestId('copy-button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('');
    });
  });

  test('handles long content correctly', async () => {
    const longContent = 'a'.repeat(10000);
    render(<CopyButton content={longContent} />);
    
    const button = screen.getByTestId('copy-button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(longContent);
    });
  });

  test('button is keyboard accessible', () => {
    render(<CopyButton content="test content" />);
    
    const button = screen.getByTestId('copy-button');
    expect(button).toHaveAttribute('tabIndex', '0');
    
    // Test Enter key
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    expect(mockWriteText).toHaveBeenCalled();
  });

  test('button has proper ARIA attributes', () => {
    render(<CopyButton content="test content" />);
    
    const button = screen.getByTestId('copy-button');
    expect(button).toHaveAttribute('aria-label');
    expect(button).toHaveAttribute('role', 'button');
  });

  test('disables button temporarily during copy operation', async () => {
    mockWriteText.mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );
    
    render(<CopyButton content="test content" />);
    
    const button = screen.getByTestId('copy-button');
    fireEvent.click(button);
    
    // Button should be disabled during operation
    expect(button).toBeDisabled();
    
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  test('cleans up feedback after timeout', async () => {
    render(<CopyButton content="test content" />);
    
    const button = screen.getByTestId('copy-button');
    fireEvent.click(button);
    
    // Feedback should appear
    await waitFor(() => {
      expect(screen.getByTestId('copy-feedback')).toBeInTheDocument();
    });
    
    // Feedback should disappear after timeout (mocked)
    await waitFor(() => {
      expect(screen.queryByTestId('copy-feedback')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
