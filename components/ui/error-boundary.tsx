import { Component, ErrorInfo, ReactNode } from "react";
import { Card } from "@/components/ui/card";

class ErrorBoundary extends Component<{
  children: ReactNode;
  fallback?: ReactNode;
}> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Card className="p-6 m-4">
          <h2 className="text-xl font-bold">Something went wrong</h2>
          <button 
            className="mt-4 px-4 py-2 bg-primary text-white rounded"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;