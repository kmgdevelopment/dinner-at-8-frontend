import styles from './loading-screen.module.scss';
import { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LoadingScreen() {
    const loadingScreenRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // display loading screen when page changes
    useEffect( () => {
        let timeout = 0;

        const handleRouteChangeStart = (url: string) => {
            // if destination URL does not contain a query string
            // doesn't account for all possible navigation
            // variants but good enough for our purposes
            if(!/[?]/.test(url)) {
                // only display element after 1 second delay
                timeout = window.setTimeout( () => {
                    if(loadingScreenRef.current) {
                        loadingScreenRef.current.classList.add(styles['visible']);
                    }
                }, 1000);
            }
        }
        const handleRouteChangeComplete = () => {
            clearTimeout(timeout);
            if(loadingScreenRef.current) {
                loadingScreenRef.current.classList.remove(styles['visible']);
            }
        }

        router.events.on('routeChangeStart', (url) => handleRouteChangeStart(url) ); 
        router.events.on('routeChangeComplete', handleRouteChangeComplete);
        router.events.on('routeChangeError', handleRouteChangeComplete); 

        return () => {
            clearTimeout(timeout);
            router.events.off('routeChangeStart', (url) => handleRouteChangeStart(url) ); 
            router.events.off('routeChangeComplete', handleRouteChangeComplete);
            router.events.off('routeChangeError', handleRouteChangeComplete); 
        }
    }, []);

    return (
        <div 
            className={ styles['loading-screen'] }
            ref={ loadingScreenRef }
        >
            {/* <p className={ styles['spinner'] }>Loading...</p> */}
        </div>
    );
}