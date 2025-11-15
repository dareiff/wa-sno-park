import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import styles from '../styles/Home.module.css';
import { CardBody } from '../components/cardBody';
import { ErrorBoundary } from '../components/ErrorBoundary';

import snoparks from './snoparks.json';

export interface SnoParkI {
    snoParkName: string;
    snoParkAddress: string;
    parkingGPS?: string | null;
    officialSnoParkURL?: string | null;
    distanceFromSeattle: number;
    groomingSchedule: boolean;
    shortGroomingSummary: string;
    groomingReportURL?: string | null;
    dogFriendly: boolean | null;
    dogFriendlyInfo?: string | null;
    amountOfKM?: number | null;
    permitRequired?: boolean | null;
    restrooms?: boolean | null;
    webcamURL?: string | null;
}

export interface SnoParkRegionI {
    snoParkRegion: string;
    snoParkRegionURL: string;
    snoParks: SnoParkI[];
}

export default function Home() {
    // use React context to store location data for other components
    const [location, setLocation] = React.useState<
        // eslint-disable-next-line no-undef
        null | GeolocationPosition['coords']
    >(null);

    const [buttonFilter, setButtonFilter] = React.useState<string>('');

    const [parkFilter, setParkFilter] = React.useState<string>('');

    React.useEffect(() => {
        navigator.geolocation.getCurrentPosition((location) => {
            if (location !== null) {
                setLocation(location.coords);
            }
        });
    }, []);

    return (
        <div className={styles.container}>
            <Head>
                <title>Washington State Sno-Parks Quick Reference</title>
                <meta
                    name='description'
                    content='A one-stop spot of sno-parks in washington. The aim is to provide very quick links, traffic, weather, and filtering.'
                />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>sno-park.site</h1>
                <p>
                    Hoping to be a one-stop shop for sno-parks in washington.
                    The aim is to provide very quick links, traffic, weather,
                    and filtering.
                </p>
                <div>
                    <h3>
                        Region Filter{' '}
                        <span
style={{
                                fontSize: '12px',
                                marginLeft: '1rem',
                                cursor: 'pointer',
                            }}
                            onClick={() => setParkFilter('')}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    setParkFilter('');
                                }
                            }}
                            role='button'
                            tabIndex={0}
                            aria-label='Clear region filter'
                        >
                            Clear filter
                        </span>
                    </h3>
                    <div className={styles.areaFilterContainer}>
                        {snoparks.map((snoparkRegion: SnoParkRegionI) => {
                            return (
                                <button
                                    key={snoparkRegion.snoParkRegion}
id={snoparkRegion.snoParkRegion}
                                    name={snoparkRegion.snoParkRegion}
                                    value={snoparkRegion.snoParkRegion}
                                    className={
                                        styles.filterButton +
                                        ' ' +
                                        (parkFilter.includes(
                                            snoparkRegion.snoParkRegion
                                        )
                                            ? styles.filterButtonActive
                                            : '')
                                    }
                                    onClick={() => {
                                        setParkFilter(
                                            snoparkRegion.snoParkRegion
                                        );
                                    }}
                                    aria-pressed={parkFilter.includes(
                                        snoparkRegion.snoParkRegion
                                    )}
                                >
                                    {snoparkRegion.snoParkRegion}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <h3>Legend</h3>
                <div className={styles.legend}>
                    <div
                        className={
                            buttonFilter === 'dog'
                                ? styles.legendItemActive
                                : styles.legendItem
                        }
                    >
                        <div className={styles.legendIcon}>
<button
                                className={styles.fakeButton}
                                onClick={() =>
                                    buttonFilter !== 'dog'
                                        ? setButtonFilter('dog')
                                        : setButtonFilter('')
                                }
                                aria-pressed={buttonFilter === 'dog'}
                                aria-label='Filter dog friendly parks'
                            >
                                <span title='Dog friendly' aria-hidden='true'>
                                    🐕‍🦺
                                </span>
                            </button>
                        </div>
                        <div className={styles.legendText}>Dogs OK</div>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendIcon}>
                            <span title='Sno park permit required'>🪪</span>
                        </div>
                        <div className={styles.legendText}>Sno-park permit</div>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendIcon}>
                            <span title='Toilets available'>🚽</span>
                        </div>
                        <div className={styles.legendText}>Toilet</div>
                    </div>
                </div>
                <div className={styles.verticalList}>
                    {snoparks
                        .filter((snoparkRegion) => {
                            if (parkFilter === '') {
                                return true;
                            } else {
                                return parkFilter.includes(
                                    snoparkRegion.snoParkRegion
                                );
                            }
                        })
                        .sort((a, b) => {
                            if (a.snoParkRegion < b.snoParkRegion) {
                                return -1;
                            }
                            if (a.snoParkRegion > b.snoParkRegion) {
                                return 1;
                            }
                            return 0;
                        })
                        .map((snoparkRegion: SnoParkRegionI) => {
                            return (
                                <div key={snoparkRegion.snoParkRegion}>
                                    <div className={styles.regionHeader}>
                                        <Link
                                            href={
                                                snoparkRegion.snoParkRegionURL
                                            }
                                        >
                                            <h2>
                                                {snoparkRegion.snoParkRegion}
                                            </h2>
                                        </Link>
                                    </div>
                                    <div className={styles.grid}>
                                        {snoparkRegion.snoParks
                                            .filter((snopark: SnoParkI) => {
                                                if (buttonFilter === 'dog') {
                                                    return snopark.dogFriendly;
                                                } else {
                                                    return true;
                                                }
                                            })
                                            .map((snopark: SnoParkI) => {
                                                return (
                                                    <ErrorBoundary
                                                        key={
                                                            snopark.snoParkName
                                                        }
                                                    >
                                                        <CardBody
                                                            location={location}
                                                            snopark={snopark}
                                                            snoparkRegion={
                                                                snoparkRegion
                                                            }
                                                        />
                                                    </ErrorBoundary>
                                                );
                                            })}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </main>

            <footer className={styles.footer}>
                <p>
                    <a href='https://www.fun-club.xyz'>by Fun Club</a>
                </p>
                <p>
                    Help out{' '}
                    <a href='https://github.com/dareiff/wa-sno-park'>
                        on Github
                    </a>
                </p>
            </footer>
        </div>
    );
}
