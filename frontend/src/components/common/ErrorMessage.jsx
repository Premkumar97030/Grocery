import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Button from './Button';

export const ErrorMessage = ({
  title = 'Something went wrong',
  message = 'Failed to load content. Please check your connection and try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl border border-rose-100 bg-rose-50/70 p-6 text-center max-w-md mx-auto my-6 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-rose-900 mb-1">{title}</h3>
      <p className="text-sm text-rose-600 mb-4">{message}</p>
      {onRetry && (
        <Button
          size="sm"
          variant="danger"
          icon={RotateCcw}
          onClick={onRetry}
          className="mx-auto"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;
