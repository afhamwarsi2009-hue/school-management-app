import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('React render failed', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="error-screen">
          <section>
            <span>Application Error</span>
            <h1>The frontend could not render.</h1>
            <p>{this.state.error.message}</p>
            <a className="primary-button" href="/#/">
              Return Home
            </a>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
