import styles from "./wakelock.module.scss";
import { useWakeLock } from '@/utils/react-screen-wake-lock';
import { useRouter } from 'next/router';
import { useEffect } from "react";

export default function Wakelock() {
    const router = useRouter();
    const debug = false;

    const { 
        wakeLock,
        isSupported, 
        released, 
        request, 
        destroy
    } = useWakeLock({
        onRequest: () => {
            debug && console.log('Wakelock requested');
        },
        onError: (error) => {
            console.error(`Wakelock error: ${error.name}, ${error.message}`);
            alert('There was a problem preventing sleep. Usually this is due to your device being in Battery Saver mode. Check your browser console for more information.');
        },
        onRelease: () => {
            debug && console.log('Wakelock released');
        },
        onDestroy: () => {
            debug && console.log('Wakelock destroyed');
        }
    });

    // disconnect wakelock when the user navigates away from the page
    useEffect( () => {
        const handleRouteChange = () => {
            if(wakeLock.current != null) {
                destroy();
            }
        }
        router.events.on('routeChangeStart', handleRouteChange);

        return () => {
            router.events.off('routeChangeStart', handleRouteChange); 
        }
    },[router]);

    return (
        <>
        {isSupported && (
            <div className={ styles['wakelock'] }>
                <input 
                    type="checkbox" 
                    checked={ released === false ? true : false }
                    name="wakelock" 
                    id="wakelock"
                    onChange={ () => (released === false ? destroy() : request()) }
                />
                <label htmlFor="wakelock">Prevent Sleep</label>
            </div>
        
        )}
        </>
    )
}