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
    const [sortBy, setSortBy] = React.useState<string>('region');
    const [favorites, setFavorites] = React.useState<string[]>([]);
    const [showFavoritesOnly, setShowFavoritesOnly] = React.useState<boolean>(false);

    // Load favorites from localStorage on mount
    React.useEffect(() => {
        const savedFavorites = localStorage.getItem('snopark-favorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    // Save favorites to localStorage whenever they change
    React.useEffect(() => {
        localStorage.setItem('snopark-favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (parkName: string) => {
        if (favorites.includes(parkName)) {
            setFavorites(favorites.filter((name) => name !== parkName));
        } else {
            setFavorites([...favorites, parkName]);
        }
    };

    // Check if we're in season (Dec 1 - Mar 31)
    const isInSeason = () => {
        const now = new Date();
        const month = now.getMonth(); // 0-11
        return month >= 11 || month <= 2; // Dec, Jan, Feb, Mar
    };

    // Calculate stats
    const calculateStats = () => {
        let totalParks = 0;
        let totalKm = 0;
        let dogFriendlyCount = 0;
        let groomedCount = 0;

        snoparks.forEach((region) => {
            region.snoParks.forEach((park) => {
                totalParks++;
                totalKm += park.amountOfKM || 0;
                if (park.dogFriendly) dogFriendlyCount++;
                if (park.groomingSchedule) groomedCount++;
            });
        });

        return { totalParks, totalKm, dogFriendlyCount, groomedCount };
    };

    const stats = calculateStats();

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

                {/* Season Status Badge - Only show when IN season */}
                {isInSeason() && (
                    <div className={styles.seasonBadge}>
                        ❄️ <strong>IN SEASON</strong> - Dec 1 to Mar 31
                    </div>
                )}

                <p>
                    Hoping to be a one-stop shop for sno-parks in washington.
                    The aim is to provide very quick links, traffic, weather,
                    and filtering.
                </p>

                {/* Quick Stats Dashboard */}
                <div className={styles.statsContainer}>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>{stats.totalParks}</div>
                        <div className={styles.statLabel}>Total Parks</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>{stats.totalKm}</div>
                        <div className={styles.statLabel}>KM of Trails</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>{stats.dogFriendlyCount}</div>
                        <div className={styles.statLabel}>Dog-Friendly</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>{stats.groomedCount}</div>
                        <div className={styles.statLabel}>Groomed</div>
                    </div>
                    {favorites.length > 0 && (
                        <div
                            className={`${styles.statCard} ${styles.statCardFavorites}`}
                            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    setShowFavoritesOnly(!showFavoritesOnly);
                                }
                            }}
                            aria-pressed={showFavoritesOnly}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className={styles.statNumber}>
                                {showFavoritesOnly ? '★' : '☆'} {favorites.length}
                            </div>
                            <div className={styles.statLabel}>
                                {showFavoritesOnly ? 'Showing Favorites' : 'Your Favorites'}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sort Control */}
                <div className={styles.controlsContainer}>
                    <div className={styles.sortContainer}>
                        <label htmlFor='sort-select'>Sort by:</label>
                        <select
                            id='sort-select'
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className={styles.sortSelect}
                        >
                            <option value='region'>Region</option>
                            <option value='distance'>Distance</option>
                            <option value='trails'>Trail KM</option>
                            <option value='name'>Name (A-Z)</option>
                            <option value='favorites'>Favorites First</option>
                        </select>
                    </div>
                </div>

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
                        .map((snoparkRegion: SnoParkRegionI) => {
                            // Filter and sort parks within each region
                            let filteredParks = snoparkRegion.snoParks
                                .filter((snopark: SnoParkI) => {
                                    // Dog filter
                                    if (buttonFilter === 'dog' && !snopark.dogFriendly) {
                                        return false;
                                    }
                                    // Favorites-only filter
                                    if (showFavoritesOnly && !favorites.includes(snopark.snoParkName)) {
                                        return false;
                                    }
                                    return true;
                                });

                            // Sort parks
                            if (sortBy === 'distance') {
                                filteredParks.sort((a, b) => a.distanceFromSeattle - b.distanceFromSeattle);
                            } else if (sortBy === 'trails') {
                                filteredParks.sort((a, b) => (b.amountOfKM || 0) - (a.amountOfKM || 0));
                            } else if (sortBy === 'name') {
                                filteredParks.sort((a, b) => a.snoParkName.localeCompare(b.snoParkName));
                            } else if (sortBy === 'favorites') {
                                filteredParks.sort((a, b) => {
                                    const aFav = favorites.includes(a.snoParkName);
                                    const bFav = favorites.includes(b.snoParkName);
                                    if (aFav && !bFav) return -1;
                                    if (!aFav && bFav) return 1;
                                    return 0;
                                });
                            }

                            return { ...snoparkRegion, snoParks: filteredParks };
                        })
                        .filter((snoparkRegion) => snoparkRegion.snoParks.length > 0) // Only show regions with parks
                        .sort((a, b) => {
                            if (sortBy === 'region') {
                                return a.snoParkRegion.localeCompare(b.snoParkRegion);
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
                                        {snoparkRegion.snoParks.map((snopark: SnoParkI) => {
                                            return (
                                                <ErrorBoundary
                                                    key={snopark.snoParkName}
                                                >
                                                    <CardBody
                                                        location={location}
                                                        snopark={snopark}
                                                        snoparkRegion={snoparkRegion}
                                                        isFavorite={favorites.includes(snopark.snoParkName)}
                                                        onToggleFavorite={toggleFavorite}
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
