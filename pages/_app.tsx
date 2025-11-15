import React from 'react';
import PlausibleProvider from 'next-plausible';
import type { AppProps } from 'next/app';
import { ErrorBoundary } from '../components/ErrorBoundary';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ErrorBoundary>
            <PlausibleProvider
                domain='sno-park.site'
                selfHosted={true}
                customDomain='https://io.fun-club.xyz'
            >
                <Component {...pageProps} />
            </PlausibleProvider>
        </ErrorBoundary>
    );
}
