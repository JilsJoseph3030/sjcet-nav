import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = window.location.pathname;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 select-none">
          <div className="bg-slate-800 border border-slate-700 max-w-md w-full rounded-3xl p-7 shadow-2xl flex flex-col items-center text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mb-5 ring-8 ring-red-500/10">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-black tracking-tight mb-2">Something went wrong</h1>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              An unexpected error occurred while rendering the indoor navigation system. Don't worry, your offline map data is safe.
            </p>

            {this.state.error && (
              <div className="w-full bg-slate-950/80 p-3.5 rounded-xl border border-slate-700/60 text-left mb-6 overflow-hidden">
                <p className="text-[11px] font-mono text-red-400 break-words line-clamp-3">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3.5 px-4 bg-sjcet-gold text-sjcet-maroon font-bold text-sm rounded-xl hover:bg-amber-400 active:scale-95 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-sjcet-gold/20"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload App</span>
              </button>

              <button
                onClick={this.handleReset}
                className="flex-1 py-3.5 px-4 bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm rounded-xl active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Reset to Start</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
