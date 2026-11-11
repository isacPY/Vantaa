import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-ink text-cream flex flex-col items-center justify-center px-6 text-center">
          <p className="eyebrow text-accent mb-4">VANTA</p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight mb-3">Something went wrong.</h1>
          <p className="text-cream-dim max-w-md mb-6">The page could not load. Try returning to the collection.</p>
          <a href="#/" className="inline-block bg-cream text-ink font-semibold px-6 py-3 min-h-[44px]">
            Back to the collection
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}
