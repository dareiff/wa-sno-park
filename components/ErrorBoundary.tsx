import React from 'react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render(): React.ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (
                <div
                    style={{
                        padding: '20px',
                        margin: '20px',
                        border: '1px solid #ff6b6b',
                        borderRadius: '8px',
                        backgroundColor: '#ffe0e0',
                    }}
                >
                    <h2>Something went wrong</h2>
                    <p>
                        We encountered an error loading this content. Please try
                        refreshing the page.
                    </p>
                    {this.state.error && (
                        <details style={{ marginTop: '10px' }}>
                            <summary>Error details</summary>
                            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                                {this.state.error.toString()}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
