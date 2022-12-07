import Head from "next/head";
import Link from "next/link";
import React from "react";
import TrafficBlock from "../components/TrafficBlock";
import WeatherBlock from "../components/WeatherBlock";
import styles from "../styles/Home.module.css";
// import snopark json from snoparks.json
import snoparks from "./snoparks.json";

export default function Home() {
    // use React context to store location data for other components
    const [location, setLocation] = React.useState<null | GeolocationPosition>(
        null
    );

    React.useEffect(() => {
        // get location data for this device:
        // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API

        navigator.geolocation.getCurrentPosition((location) =>
            setLocation(location)
        );
    }, []);

    return (
        <div className={styles.container}>
            <Head>
                <title>Washington State Sno Parks</title>
                <meta
                    title="description"
                    content="A one-stop spot of sno-parks in washington. The aim is to provide very quick links, traffic, weather, and filtering."
                />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>snoparks.com</h1>
                <p>
                    A one-stop spot of sno-parks in washington. The aim is to
                    provide very quick links, traffic, weather, and filtering.
                </p>
                <p>
                    With a special thanks to Washington State Parks and Rec,
                    WSDOT, groomers, and nordic clubs.
                </p>
                <div className={styles.verticalList}>
                    {snoparks.map((snoparkRegion) => {
                        return (
                            <div key={snoparkRegion.snoParkRegion}>
                                <div className={styles.regionHeader}>
                                    <Link href={snoparkRegion.snoParkRegionURL}>
                                        <h2>{snoparkRegion.snoParkRegion}</h2>
                                    </Link>
                                </div>
                                <div className={styles.grid}>
                                    {snoparkRegion.snoParks.map((snopark) => {
                                        return (
                                            <div
                                                key={snopark.snoParkName}
                                                className={styles.card}
                                            >
                                                <div
                                                    className={
                                                        styles.cardHeader
                                                    }
                                                >
                                                    <Link
                                                        href={
                                                            snopark.officialSnoParkURL
                                                                ? snopark.officialSnoParkURL
                                                                : snoparkRegion.snoParkRegionURL
                                                        }
                                                    >
                                                        <h3>
                                                            {
                                                                snopark.snoParkName
                                                            }
                                                        </h3>
                                                    </Link>
                                                    <span
                                                        className={
                                                            styles.drivetime
                                                        }
                                                    >
                                                        {
                                                            snopark.distanceFromSeattle
                                                        }{" "}
                                                        hr (typical)
                                                    </span>
                                                </div>
                                                <div
                                                    className={styles.cardBody}
                                                >
                                                    {/* get weather for snopark */}
                                                    <WeatherBlock
                                                        location={
                                                            snopark.snoParkAddress
                                                        }
                                                        deviceLocation={
                                                            location
                                                        }
                                                    />
                                                    <TrafficBlock
                                                        location={
                                                            snopark.snoParkAddress
                                                        }
                                                        deviceLocation={
                                                            location
                                                        }
                                                    />
                                                </div>
                                                <span>Legend:</span>
                                                <div
                                                    className={styles.cardIcons}
                                                >
                                                    {snopark.dogFriendly && (
                                                        <span title="Dog friendly">
                                                            🐕‍🦺
                                                        </span>
                                                    )}
                                                    {snopark.permitRequired && (
                                                        <span title="Sno park permit required">
                                                            🪪
                                                        </span>
                                                    )}
                                                    {snopark.restrooms && (
                                                        <span title="Restrooms">
                                                            🚽
                                                        </span>
                                                    )}
                                                </div>

                                                <div
                                                    className={
                                                        styles.cardFooter
                                                    }
                                                >
                                                    <a
                                                        href={
                                                            `https://maps.google.com/?q=` +
                                                            snopark.snoParkAddress
                                                        }
                                                    >
                                                        Map it
                                                    </a>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            <footer className={styles.footer}></footer>
        </div>
    );
}
