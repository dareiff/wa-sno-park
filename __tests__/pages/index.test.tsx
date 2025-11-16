import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../../pages/index';

// Mock Next.js Head and Link components
vi.mock('next/head', () => ({
    default: ({ children }: { children: React.ReactNode }) => (
        <>{children}</>
    ),
}));

vi.mock('next/link', () => ({
    default: ({
        children,
        href,
    }: {
        children: React.ReactNode;
        href: string;
    }) => <a href={href}>{children}</a>,
}));

// Mock the components that make API calls
vi.mock('@/components/WeatherBlock', () => ({
    default: () => <div>Weather Block Mock</div>,
}));

vi.mock('@/components/TrafficBlock', () => ({
    default: () => <div>Traffic Block Mock</div>,
}));

// Mock geolocation
const mockGeolocation = {
    getCurrentPosition: vi.fn(),
};

beforeEach(() => {
    global.navigator.geolocation = mockGeolocation as any;
    mockGeolocation.getCurrentPosition.mockImplementation((success) =>
        success({
            coords: {
                latitude: 47.6062,
                longitude: -122.3321,
            },
        })
    );
});

describe('Home Page', () => {
    it('renders the main title', () => {
        render(<Home />);
        expect(screen.getByText('sno-park.site')).toBeInTheDocument();
    });

    it('renders the description', () => {
        render(<Home />);
        expect(
            screen.getByText(
                /Hoping to be a one-stop shop for sno-parks in washington/i
            )
        ).toBeInTheDocument();
    });

    it('renders region filter buttons', () => {
        render(<Home />);
        expect(
            screen.getByRole('button', {
                name: 'Mount Baker / Methow Valley',
            })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Leavenworth / Chelan' })
        ).toBeInTheDocument();
    });

    it('filters sno-parks by region when button is clicked', () => {
        render(<Home />);

        // Click the Leavenworth region button
        const leavenworthButton = screen.getByRole('button', {
            name: 'Leavenworth / Chelan',
        });

        // Initially should not be pressed
        expect(leavenworthButton).toHaveAttribute('aria-pressed', 'false');

        fireEvent.click(leavenworthButton);

        // Check that the button has aria-pressed attribute set to true after click
        expect(leavenworthButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('filters sno-parks by dog-friendly when stat card is clicked', () => {
        render(<Home />);

        // Find the dog-friendly stat card by its text content
        const statCards = screen.getAllByRole('button');
        const dogStatCard = statCards.find(card =>
            card.textContent?.includes('Dog-Friendly')
        );

        expect(dogStatCard).toBeDefined();
        expect(dogStatCard).toHaveAttribute('aria-pressed', 'false');

        fireEvent.click(dogStatCard!);

        expect(dogStatCard).toHaveAttribute('aria-pressed', 'true');
    });

    it('clears region filter when clear button is clicked', () => {
        render(<Home />);

        // First, set a filter
        const regionButton = screen.getByRole('button', {
            name: 'Leavenworth / Chelan',
        });
        fireEvent.click(regionButton);

        // Then clear it
        const clearButton = screen.getByRole('button', {
            name: 'Clear region filter',
        });
        fireEvent.click(clearButton);

        // Button should no longer be pressed
        expect(regionButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('renders sno-park cards', () => {
        render(<Home />);

        // Check for some known sno-parks from the data
        // Using getAllByText since park names might appear in multiple places
        const highlandsElements = screen.getAllByText('Highlands');
        expect(highlandsElements.length).toBeGreaterThan(0);

        const lakeWenatcheeElements = screen.getAllByText('Lake Wenatchee');
        expect(lakeWenatcheeElements.length).toBeGreaterThan(0);
    });

    it('renders the stats dashboard with clickable filters', () => {
        render(<Home />);

        // Check that the stats dashboard is rendered
        expect(screen.getByText('Total Parks')).toBeInTheDocument();
        expect(screen.getByText('KM of Trails')).toBeInTheDocument();
        expect(screen.getByText('Dog-Friendly')).toBeInTheDocument();
        expect(screen.getByText('Groomed')).toBeInTheDocument();
    });

    it('filters sno-parks by groomed when stat card is clicked', () => {
        render(<Home />);

        // Find the groomed stat card by its text content
        const statCards = screen.getAllByRole('button');
        const groomedStatCard = statCards.find(card =>
            card.textContent?.includes('Groomed')
        );

        expect(groomedStatCard).toBeDefined();
        expect(groomedStatCard).toHaveAttribute('aria-pressed', 'false');

        fireEvent.click(groomedStatCard!);

        expect(groomedStatCard).toHaveAttribute('aria-pressed', 'true');
    });
});
