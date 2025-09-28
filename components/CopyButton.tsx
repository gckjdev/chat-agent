'use client';

import React, { useState } from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { copyToClipboard, CopyResult } from '../lib/clipboard';

interface CopyButtonProps {
  content: string;
  onCopySuccess?: () => void;
  className?: string;
}

/**
 * CopyButton component for copying text content to clipboard
 * Provides visual feedback and error handling for copy operations
 */
export default function CopyButton({ content, onCopySuccess, className = '' }: CopyButtonProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleCopy = async () => {
    if (copyState === 'copying') return; // Prevent multiple simultaneous operations

    setCopyState('copying');
    setErrorMessage('');

    try {
      const result: CopyResult = await copyToClipboard(content);
      
      if (result.success) {
        setCopyState('success');
        onCopySuccess?.();
        
        // Reset to idle after 2 seconds
        setTimeout(() => {
          setCopyState('idle');
        }, 2000);
      } else {
        setCopyState('error');
        setErrorMessage(result.error || 'Copy operation failed');
        
        // Reset to idle after 3 seconds
        setTimeout(() => {
          setCopyState('idle');
          setErrorMessage('');
        }, 3000);
      }
    } catch (error) {
      setCopyState('error');
      setErrorMessage('An unexpected error occurred');
      console.error('❌ Copy operation failed:', error);
      
      // Reset to idle after 3 seconds
      setTimeout(() => {
        setCopyState('idle');
        setErrorMessage('');
      }, 3000);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCopy();
    }
  };

  const getIcon = () => {
    switch (copyState) {
      case 'copying':
        return <Copy className="w-4 h-4 animate-pulse" />;
      case 'success':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Copy className="w-4 h-4" />;
    }
  };

  const getAriaLabel = () => {
    switch (copyState) {
      case 'copying':
        return 'Copying message...';
      case 'success':
        return 'Message copied to clipboard';
      case 'error':
        return `Copy failed: ${errorMessage}`;
      default:
        return 'Copy message to clipboard';
    }
  };

  const getButtonClasses = () => {
    const baseClasses = `
      inline-flex items-center justify-center
      p-1.5 rounded-md
      border border-gray-300
      bg-white hover:bg-gray-50
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      transition-colors duration-200
      disabled:opacity-50 disabled:cursor-not-allowed
      w-8 h-8
      ${className}
    `.trim().replace(/\s+/g, ' ');

    const stateClasses = {
      idle: 'text-gray-600 hover:text-gray-800',
      copying: 'text-blue-600',
      success: 'text-green-600 bg-green-50 border-green-300',
      error: 'text-red-600 bg-red-50 border-red-300'
    };

    return `${baseClasses} ${stateClasses[copyState]}`;
  };

  return (
    <>
      <button
        type="button"
        data-testid="copy-button"
        className={getButtonClasses()}
        onClick={handleCopy}
        onKeyDown={handleKeyDown}
        disabled={copyState === 'copying'}
        aria-label={getAriaLabel()}
        role="button"
        tabIndex={0}
        title={getAriaLabel()}
      >
        {getIcon()}
      </button>
      
      {/* Visual feedback elements for testing */}
      {copyState === 'success' && (
        <span 
          data-testid="copy-feedback" 
          className="sr-only" 
          aria-live="polite"
          aria-atomic="true"
        >
          Copied to clipboard
        </span>
      )}
      
      {copyState === 'error' && errorMessage && (
        <span 
          data-testid="copy-error" 
          className="sr-only" 
          aria-live="assertive"
          aria-atomic="true"
        >
          Copy failed: {errorMessage}
        </span>
      )}
    </>
  );
}
