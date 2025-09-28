'use client';

import React, { useEffect, useState } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

interface CopyFeedbackProps {
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
  onDismiss?: () => void;
  className?: string;
}

/**
 * CopyFeedback component for displaying toast-style feedback messages
 * Used to provide visual confirmation of copy operations
 */
export default function CopyFeedback({ 
  type, 
  message, 
  duration = 3000, 
  onDismiss,
  className = '' 
}: CopyFeedbackProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onDismiss?.();
      }, 300); // Allow fade-out animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss?.();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBackgroundClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getTestId = () => {
    switch (type) {
      case 'success':
        return 'copy-feedback';
      case 'error':
        return 'copy-error';
      case 'info':
        return 'copy-info';
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      data-testid={getTestId()}
      className={`
        fixed top-4 right-4 z-50
        flex items-center gap-2
        px-4 py-3 
        border rounded-lg shadow-lg
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${getBackgroundClasses()}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      {getIcon()}
      
      <span className="text-sm font-medium">
        {message}
      </span>
      
      <button
        type="button"
        onClick={handleDismiss}
        className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * Toast notification system hook for managing multiple feedback messages
 */
export function useCopyFeedback() {
  const [feedbacks, setFeedbacks] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
  }>>([]);

  const showFeedback = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setFeedbacks(prev => [...prev, { id, type, message }]);
  };

  const dismissFeedback = (id: string) => {
    setFeedbacks(prev => prev.filter(feedback => feedback.id !== id));
  };

  const showSuccess = (message: string) => showFeedback('success', message);
  const showError = (message: string) => showFeedback('error', message);
  const showInfo = (message: string) => showFeedback('info', message);

  const FeedbackContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {feedbacks.map((feedback) => (
        <CopyFeedback
          key={feedback.id}
          type={feedback.type}
          message={feedback.message}
          onDismiss={() => dismissFeedback(feedback.id)}
        />
      ))}
    </div>
  );

  return {
    showSuccess,
    showError,
    showInfo,
    FeedbackContainer
  };
}
