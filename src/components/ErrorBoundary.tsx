import { Component, ReactNode } from 'react';
import { Box, Text, Button, Paper } from '@mantine/core';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <Paper shadow="sm" p="xl" radius="md" withBorder>
                    <Box>
                        <Text fw={600} size="lg" mb="md" c="red">
                            Something went wrong
                        </Text>
                        <Text c="dimmed" mb="md" size="sm">
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </Text>
                        <Button onClick={this.handleReset} variant="light">
                            Try again
                        </Button>
                    </Box>
                </Paper>
            );
        }

        return this.props.children;
    }
}


export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
    return <ErrorBoundaryClass fallback={fallback}>{children}</ErrorBoundaryClass>;
}
