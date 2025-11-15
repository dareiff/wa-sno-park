/* eslint-disable @next/next/no-img-element */
// A component that displays the current weather and weather forecast for next 2 and 6 hours for a given SnoPark. This component is used in the SnoParkCard component.
import React from 'react';
import styles from '../styles/Home.module.css';

interface WeatherBlockI {
    location: string;
    gps?: string;
}

const matchWeatherIcon = (icon: string) => {
    let matching_weather_icon = '';
    if (icon == '01d') {
        matching_weather_icon = 'clear';
    } else if (icon == '01n') {
        matching_weather_icon = 'nt_sunny';
    } else if (icon == '02d') {
        matching_weather_icon = 'partlycloudy';
    } else if (icon == '02n') {
        matching_weather_icon = 'nt_partlycloudy';
    } else if (icon == '03d') {
        matching_weather_icon = 'cloudy';
    } else if (icon == '03n') {
        matching_weather_icon = 'nt_cloudy';
    } else if (icon == '04d') {
        matching_weather_icon = 'mostlycloudy';
    } else if (icon == '04n') {
        matching_weather_icon = 'nt_mostlycloudy';
    } else if (icon == '09d') {
        matching_weather_icon = 'chancerain';
    } else if (icon == '09n') {
        matching_weather_icon = 'nt_chancerain';
    } else if (icon == '10d') {
        matching_weather_icon = 'rain';
    } else if (icon == '10n') {
        matching_weather_icon = 'nt_rain';
    } else if (icon == '11d') {
        matching_weather_icon = 'tstorms';
    } else if (icon == '11n') {
        matching_weather_icon = 'nt_tstorms';
    } else if (icon == '13d') {
        matching_weather_icon = 'snow';
    } else if (icon == '13n') {
        matching_weather_icon = 'nt_snow';
    } else if (icon == '50d') {
        matching_weather_icon = 'fog';
    } else if (icon == '50n') {
        matching_weather_icon = 'nt_fog';
    } else {
        matching_weather_icon = 'clear';
    }
    return `weather_icons/${matching_weather_icon}.svg`;
};

const getLatLongFromZip = async (geourl: string): Promise<any> => {
    let lat, lon;
    await fetch(geourl)
        .then((response) => response.json())
        .then((data) => {
            lat = data.lat;
            lon = data.lon;
        })
        .catch((error) => {
            console.error(error);
        });
    return { lat, lon };
};

export default function WeatherBlock(props: WeatherBlockI) {
    interface CurrentWeatherI {
        temp: number;
        icon: string;
        snowInSixHours?: boolean;
        snowAmount?: number;
    }
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_GEO_API_KEY;
    const apiKeyTwo = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
    const propLat = props.gps !== undefined ? props.gps.split(', ')[0] : '';
    const propLon = props.gps !== undefined ? props.gps.split(', ')[1] : '';
    const [currentWeather, setCurrentWeather] =
        React.useState<null | CurrentWeatherI>(null);
    const [forecastWeather, setForecastWeather] =
        React.useState<null | CurrentWeatherI>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    const [latLong, setLatLong] = React.useState<{ lat: string; lon: string }>({
        lat: propLat,
        lon: propLon,
    });

    React.useEffect(() => {
        if (latLong.lat === '' && props.location.length > 5) {
            const geourl = `https://api.openweathermap.org/geo/1.0/zip?zip=${props.location.substring(
                props.location.length - 5
            )}&limit=1&appid=${apiKey}`;
            getLatLongFromZip(geourl).then((data) => {
                if (data !== undefined) {
                    setLatLong({ lat: data.lat, lon: data.lon });
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (latLong.lat === '') {
            setIsLoading(false);
            return;
        }

        const fetchWeatherData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const [currentResponse, forecastResponse] = await Promise.all([
                    fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${latLong.lat}&lon=${latLong.lon}&units=imperial&appid=${apiKeyTwo}`
                    ),
                    fetch(
                        `https://api.openweathermap.org/data/2.5/forecast?lat=${latLong.lat}&lon=${latLong.lon}&units=imperial&appid=${apiKeyTwo}`
                    ),
                ]);

                if (!currentResponse.ok || !forecastResponse.ok) {
                    throw new Error('Failed to fetch weather data');
                }

                const currentData = await currentResponse.json();
                const forecastData = await forecastResponse.json();

                if (currentData.main) {
                    setCurrentWeather({
                        temp: currentData.main.temp.toFixed(0),
                        icon: currentData.weather[0].icon,
                    });
                }

                if (forecastData.list && forecastData.list.length > 2) {
                    let snow = false;
                    let snowAmount = 0;

                    for (let i = 0; i < 2; i++) {
                        if ('snow' in forecastData.list[i]) {
                            snow = true;
                            snowAmount += forecastData.list[i].snow['3h'];
                        }
                    }

                    setForecastWeather({
                        temp: forecastData.list[2].main.temp.toFixed(0),
                        icon: forecastData.list[2].weather[0].icon,
                        snowInSixHours: snow,
                        snowAmount: snowAmount,
                    });
                }

                setIsLoading(false);
            } catch (err) {
                console.error('Weather fetch error:', err);
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to load weather'
                );
                setIsLoading(false);
            }
        };

        fetchWeatherData();
    }, [props.location, latLong, apiKeyTwo]);

    if (error) {
        return (
            <div className={styles.weather}>
                <h3>Weather</h3>
                <p style={{ color: '#ff6b6b', fontSize: '14px' }}>
                    Unable to load weather data
                </p>
            </div>
        );
    }

    if (isLoading || currentWeather === null) {
        return (
            <div className={styles.weather}>
                <h3>Weather</h3>
                <p>Loading weather data...</p>
            </div>
        );
    }

    return (
        <div className={styles.weather}>
            <h3>Weather</h3>
            <div className={styles.weatherBlock}>
                <div className={styles.weatherBlockCurrent}>
                    <span>Now:</span>
                    <div className={styles.weatherBlockCurrentTemp}>
                        {currentWeather ? `${currentWeather.temp}°` : 'Loading'}
                    </div>
                    <div className={styles.weatherBlockCurrentIcon}>
                        {currentWeather ? (
                            <img
                                alt='weather icon'
                                src={matchWeatherIcon(currentWeather.icon)}
                                width={50}
                                height={50}
                            />
                        ) : (
                            'Loading'
                        )}
                    </div>
                </div>
                <div className={styles.snow}>
                    {forecastWeather?.snowInSixHours &&
                    forecastWeather?.snowAmount !== undefined ? (
                        <div
                            className={styles.snowWarning}
                            style={
                                forecastWeather?.snowAmount > 1
                                    ? {
                                          borderStyle: 'dashed',
                                      }
                                    : {
                                          borderStyle: 'solid',
                                      }
                            }
                        >
                            <span>Snow!</span>
                            <span>
                                {forecastWeather.snowAmount.toFixed(0) === '0'
                                    ? '< 1"'
                                    : forecastWeather.snowAmount.toFixed(0) +
                                      '"'}
                            </span>
                        </div>
                    ) : (
                        <span>No Snow</span>
                    )}
                </div>
                <div className={styles.weatherBlockCurrent}>
                    <span>6 Hours:</span>
                    <div className={styles.weatherBlockCurrentTemp}>
                        {forecastWeather
                            ? `${forecastWeather.temp}°`
                            : 'Loading'}
                    </div>
                    <div className={styles.weatherBlockCurrentIcon}>
                        {forecastWeather ? (
                            <img
                                alt='weather icon'
                                src={matchWeatherIcon(forecastWeather.icon)}
                                width={50}
                                height={50}
                            />
                        ) : (
                            'Loading'
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
