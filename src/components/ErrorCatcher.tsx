'use client';

import { useEffect } from 'react';

export default function ErrorCatcher() {
  useEffect(() => {
    const originalConsoleError = console.error;

    console.error = (...args: any[]) => {
      const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
      fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'CONSOLE_ERROR', message }),
      }).catch(console.warn);
      
      originalConsoleError.apply(console, args);
    };

    const handleWindowError = (event: ErrorEvent) => {
      fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'UNHANDLED_ERROR', 
          message: event.message,
          stack: event.error?.stack 
        }),
      }).catch(console.warn);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'UNHANDLED_REJECTION', 
          message: event.reason?.message || String(event.reason),
          stack: event.reason?.stack 
        }),
      }).catch(console.warn);
    };

    window.addEventListener('error', handleWindowError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      console.error = originalConsoleError;
      window.removeEventListener('error', handleWindowError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}
