'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="rounded-lg border border-danger/20 bg-danger/5 p-6">
          <h2 className="mb-2 text-xl font-bold text-danger">
            Something went wrong
          </h2>
          <p className="text-foreground/70 mb-4">
            There was an error processing your request. Please try again or
            contact support if the problem persists.
          </p>
          <div className="bg-background/50 rounded-md p-4">
            <p className="break-words font-mono text-sm">
              {this.state.error?.message || 'Unknown error'}
            </p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="hover:bg-primary/90 mt-4 rounded-md bg-primary px-4 py-2 text-white"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
