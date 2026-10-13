import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      const isHi = this.props.lang === 'hi';
      return (
        <div className="max-w-2xl mx-auto my-12 p-6 sm:p-8 bg-white rounded-3xl border border-red-200 shadow-md text-center">
          <div className="w-14 h-14 bg-red-100 text-brandRed rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
            {isHi ? 'कुछ अप्रत्याशित समस्या हुई' : 'Something went wrong'}
          </h2>
          <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
            {isHi
              ? 'स्क्रीन लोड करने में तकनीकी समस्या आई। कृपया पुनः प्रयास करें।'
              : 'An unexpected issue occurred while rendering this screen. Please try again or return to home.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-xl bg-brandRed text-white font-bold text-sm flex items-center gap-2 shadow-sm hover:bg-deepRed"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isHi ? 'पुनः प्रयास करें' : 'Try Again'}</span>
            </button>

            {this.props.onGoHome && (
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  this.props.onGoHome();
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm flex items-center gap-2 hover:bg-slate-100"
              >
                <Home className="w-4 h-4" />
                <span>{isHi ? 'मुख्य पृष्ठ' : 'Go to Home'}</span>
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
