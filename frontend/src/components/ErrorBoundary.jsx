import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
        this.setState({ error: error, errorInfo: errorInfo });
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    backgroundColor: '#f8f9fa',
                    color: '#333',
                    textAlign: 'center',
                    padding: '20px',
                    fontFamily: 'sans-serif'
                }}>
                    <h2 style={{ color: '#d9534f' }}>Something went wrong.</h2>
                    <p style={{ maxWidth: '500px', marginBottom: '20px' }}>
                        We're sorry, but an unexpected error has occurred. Please try reloading the page.
                    </p>
                    <button
                        onClick={this.handleReload}
                        style={{
                            padding: '10px 20px',
                            fontSize: '16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Reload Application
                    </button>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <details style={{ marginTop: '20px', textAlign: 'left', backgroundColor: '#eee', padding: '10px', borderRadius: '5px' }}>
                            <summary>Error Details</summary>
                            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                                {this.state.error.toString()}
                                <br />
                                {this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
