import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';

// Component that throws an error
const ThrowError = () => {
    throw new Error('Test error');
};

// Component that works fine
const WorkingComponent = () => <div>Working component</div>;

describe('ErrorBoundary', () => {
    it('renders children when there is no error', () => {
        render(
            <ErrorBoundary>
                <WorkingComponent />
            </ErrorBoundary>
        );

        expect(screen.getByText('Working component')).toBeInTheDocument();
    });

    it('renders error UI when child component throws', () => {
        // Suppress console.error for this test
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(
            screen.getByText(
                /We encountered an error loading this content/i
            )
        ).toBeInTheDocument();

        consoleError.mockRestore();
    });

    it('renders custom fallback when provided', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        render(
            <ErrorBoundary fallback={<div>Custom error message</div>}>
                <ThrowError />
            </ErrorBoundary>
        );

        expect(screen.getByText('Custom error message')).toBeInTheDocument();

        consoleError.mockRestore();
    });
});
