import Link from 'next/link';
import React from 'react';
import TrafficBlock from './TrafficBlock';
import WeatherBlock from './WeatherBlock';
import styles from '../styles/Home.module.css';
import { SnoParkI, SnoParkRegionI } from '../pages/index';

interface CardBodyI {
    snopark: SnoParkI;
    // eslint-disable-next-line no-undef
    location: GeolocationPosition['coords'] | null;
    snoparkRegion: SnoParkRegionI;
    isFavorite?: boolean;
    // eslint-disable-next-line no-unused-vars
    onToggleFavorite?: (parkName: string) => void;
}

export function CardBody(props: CardBodyI): React.JSX.Element {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <Link
                    href={
                        props.snopark.officialSnoParkURL
                            ? props.snopark.officialSnoParkURL
                            : props.snoparkRegion.snoParkRegionURL
                    }
                >
                    <h3>{props.snopark.snoParkName}</h3>
                </Link>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className={styles.drivetime}>
                        {props.snopark.distanceFromSeattle} hr drive (typical)
                    </span>
                    {props.onToggleFavorite && (
                        <button
                            className={styles.favoriteButton}
                            onClick={() => props.onToggleFavorite!(props.snopark.snoParkName)}
                            aria-label={props.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            title={props.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            {props.isFavorite ? '★' : '☆'}
                        </button>
                    )}
                </div>
            </div>
            <div className={styles.cardBody}>
                {/* amount of KM of trails */}
                <div>{props.snopark.amountOfKM} KM of trails</div>
                {/* get weather for snopark */}
                <WeatherBlock
                    location={props.snopark.snoParkAddress}
                    gps={
                        props.snopark.parkingGPS
                            ? props.snopark.parkingGPS
                            : undefined
                    }
                />
                <TrafficBlock
                    gps={
                        props.snopark.parkingGPS
                            ? props.snopark.parkingGPS
                            : undefined
                    }
                    location={props.snopark.snoParkAddress}
                    deviceLocation={props.location}
                />
            </div>
            <div className={styles.weather}>
                <h3>Legend</h3>
                <div className={styles.cardIcons}>
                    {props.snopark.dogFriendly && (
                        <span title='Dog friendly'>🐕‍🦺</span>
                    )}
                    {props.snopark.permitRequired && (
                        <span title='Sno park permit required'>🪪</span>
                    )}
                    {props.snopark.restrooms && (
                        <span title='Restrooms'>🚽</span>
                    )}
                </div>
            </div>

            <div className={styles.cardFooter}>
                <h3>
                    <Link
                        href={
                            `https://maps.google.com/?q=` +
                            props.snopark.snoParkAddress
                        }
                    >
                        Directions!
                    </Link>
                </h3>
            </div>
        </div>
    );
}
