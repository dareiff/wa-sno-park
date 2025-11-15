import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardBody } from '../cardBody';
import { SnoParkI, SnoParkRegionI } from '../../pages/index';

const mockSnoPark: SnoParkI = {
    snoParkName: 'Test Sno-Park',
    snoParkAddress: '123 Test St, Test, WA 98000',
    parkingGPS: '47.123, -121.456',
    officialSnoParkURL: 'https://example.com',
    distanceFromSeattle: 2,
    groomingSchedule: true,
    shortGroomingSummary: 'Daily grooming',
    groomingReportURL: 'https://example.com/grooming',
    dogFriendly: true,
    dogFriendlyInfo: 'Dogs allowed on leash',
    amountOfKM: 25,
    permitRequired: true,
    restrooms: true,
    webcamURL: null,
};

const mockSnoParkRegion: SnoParkRegionI = {
    snoParkRegion: 'Test Region',
    snoParkRegionURL: 'https://example.com/region',
    snoParks: [mockSnoPark],
};

describe('CardBody', () => {
    it('renders sno-park name and basic info', () => {
        render(
            <CardBody
                snopark={mockSnoPark}
                location={null}
                snoparkRegion={mockSnoParkRegion}
            />
        );

        expect(screen.getByText('Test Sno-Park')).toBeInTheDocument();
        expect(screen.getByText('25 KM of trails')).toBeInTheDocument();
        expect(
            screen.getByText('2 hr drive (typical)')
        ).toBeInTheDocument();
    });

    it('renders all amenity icons when available', () => {
        render(
            <CardBody
                snopark={mockSnoPark}
                location={null}
                snoparkRegion={mockSnoParkRegion}
            />
        );

        // Check for dog friendly icon
        expect(screen.getByTitle('Dog friendly')).toBeInTheDocument();
        // Check for permit icon
        expect(
            screen.getByTitle('Sno park permit required')
        ).toBeInTheDocument();
        // Check for restrooms icon
        expect(screen.getByTitle('Restrooms')).toBeInTheDocument();
    });

    it('does not render amenity icons when not available', () => {
        const snoParkNoAmenities = {
            ...mockSnoPark,
            dogFriendly: false,
            permitRequired: false,
            restrooms: false,
        };

        render(
            <CardBody
                snopark={snoParkNoAmenities}
                location={null}
                snoparkRegion={mockSnoParkRegion}
            />
        );

        expect(screen.queryByTitle('Dog friendly')).not.toBeInTheDocument();
        expect(
            screen.queryByTitle('Sno park permit required')
        ).not.toBeInTheDocument();
        expect(screen.queryByTitle('Restrooms')).not.toBeInTheDocument();
    });

    it('renders directions link', () => {
        render(
            <CardBody
                snopark={mockSnoPark}
                location={null}
                snoparkRegion={mockSnoParkRegion}
            />
        );

        const directionsLink = screen.getByText('Directions!');
        expect(directionsLink).toBeInTheDocument();
        expect(directionsLink.closest('a')).toHaveAttribute(
            'href',
            expect.stringContaining('maps.google.com')
        );
    });
});
