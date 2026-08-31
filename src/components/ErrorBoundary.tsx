import React, { ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('UI runtime error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error(e);
    }
    window.location.hash = '/dashboard';
    window.location.reload();
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#06352F] text-white flex flex-col items-center justify-center p-6 font-['Inter',sans-serif]">
          <div className="max-w-md w-full bg-[#073F37] border border-[#0E5A4F] rounded-2xl p-6 text-center shadow-2xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#D9534F]/20 border border-[#D9534F]/40 flex items-center justify-center text-[#FCA5A5] mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>
            
            <h2 className="text-xl font-bold tracking-tight mb-2">System Notice</h2>
            <p className="text-xs text-[#A3B8B0] mb-5 leading-relaxed">
              An unexpected runtime error occurred. Please use the options below to reload or reset the view.
            </p>

            {this.state.error && (
              <div className="bg-[#06352F] p-3 rounded-lg border border-[#0E5A4F] text-left text-xs font-mono text-[#E5EAE8] mb-5 max-h-32 overflow-y-auto break-words">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 bg-[#0E5A4F] hover:bg-[#135E54] text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 bg-white/10 hover:bg-white/15 text-white font-medium py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all border border-white/10"
              >
                <Home className="w-4 h-4" />
                <span>Reset Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
