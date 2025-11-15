import React from 'react';
import styles from '../styles/Home.module.css';

interface DistancePropsI {
    // eslint-disable-next-line no-undef
    deviceLocation: GeolocationPosition['coords'] | null;
    location: string;
    gps?: string;
}

export default function TrafficBlock(props: DistancePropsI) {
    const [travelTime, setTravelTime] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);

    const getLatLongFromAddress = async (address: string) => {
        const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        let lat = 0;
        let lng = 0;

        await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleMapsApiKey}`
        )
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.results === undefined) {
                    throw new Error('No results found');
                } else if (data.results.length === 0) {
                    throw new Error('No results found');
                }
                lat = data.results[0].geometry.location.lat;
                lng = data.results[0].geometry.location.lng;
            })
            .catch((error) => {
                console.log(error);
            });

        return { lat, lng };
    };

    const getTravelTime = async (
        // eslint-disable-next-line no-undef
        deviceLocation: GeolocationPosition['coords'],
        location: string
    ) => {
        try {
            setIsLoading(true);
            setError(null);

            const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
            let lat, lng;
            if (
                props.gps !== '' &&
                props.gps !== undefined &&
                props.gps !== null
            ) {
                lat = parseFloat(props.gps.split(', ')[0]);
                lng = parseFloat(props.gps.split(', ')[1]);
            } else {
                const latLng = await getLatLongFromAddress(location);
                lat = latLng.lat;
                lng = latLng.lng;
            }

            if (lat === 0 || lng === 0) {
                throw new Error('Invalid coordinates');
            }

            const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append(
                'X-Goog-Api-Key',
                googleMapsApiKey ? googleMapsApiKey : ''
            );
            headers.append(
                'X-Goog-FieldMask',
                'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.travelAdvisory'
            );

            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    origin: {
                        location: {
                            latLng: {
                                latitude: deviceLocation.latitude,
                                longitude: deviceLocation.longitude,
                            },
                        },
                    },
                    destination: {
                        location: {
                            latLng: {
                                latitude: lat,
                                longitude: lng,
                            },
                        },
                    },
                    travelMode: 'DRIVE',
                    routingPreference: 'TRAFFIC_AWARE',
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch travel time');
            }

            const data = await response.json();
            const seconds = data.routes
                ? data.routes[0].duration.split('s')[0]
                : 0;
            setTravelTime(seconds);
            setIsLoading(false);
        } catch (err) {
            console.error('Travel time fetch error:', err);
            setError(
                err instanceof Error ? err.message : 'Failed to load travel time'
            );
            setIsLoading(false);
        }
    };

    if (error) {
        return (
            <div className={styles.weather}>
                <h3>Travel Time</h3>
                <p style={{ color: '#ff6b6b', fontSize: '14px' }}>
                    Unable to load travel time
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className={styles.weather}>
                <h3>Travel Time</h3>
                <p>Loading...</p>
            </div>
        );
    }

    if (travelTime === 0 && props.deviceLocation !== null) {
        return (
            <div className={styles.weather}>
                <button
                    className={styles.button}
                    onClick={() =>
                        getTravelTime(
                            // eslint-disable-next-line no-undef
                            props.deviceLocation as GeolocationPosition['coords'],
                            props.location
                        )
                    }
                >
                    Check travel time?
                </button>
            </div>
        );
    } else if (travelTime !== 0) {
        return (
            <div className={styles.weather}>
                <h3>Travel Time</h3>
                <p style={{ textAlign: 'center' }}>
                    {(travelTime / 60).toFixed(0)} minutes
                </p>
            </div>
        );
    } else {
        return <></>;
    }
}
