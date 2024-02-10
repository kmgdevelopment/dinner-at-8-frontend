import '@/sass/global.scss';
import { useState, useEffect, useRef } from 'react';
import { AppProps } from 'next/app';
import { Montserrat, Frank_Ruhl_Libre } from 'next/font/google';
import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const montserrat = Montserrat({
    subsets: ['latin'],
    display: 'swap'
});
const frankRuhlLibre = Frank_Ruhl_Libre({
    subsets: ['latin'],
    display: 'swap'
});

export default function App({ Component, pageProps }: AppProps) {
    const [queryClient] = useState( () => new QueryClient() );

    return (
        <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={pageProps.dehydratedState}>
                <style jsx global>{`
                    :root {
                        --montserrat-font: ${montserrat.style.fontFamily};
                        --frank-ruhl-libre-font: ${frankRuhlLibre.style.fontFamily};
                    }
                `}</style>

                <Component {...pageProps} />
                <ReactQueryDevtools initialIsOpen={false} />
            </HydrationBoundary>
        </QueryClientProvider>
    )
}

export function getStaticProps({ loadingScreenRef }: { loadingScreenRef: Element | null }) {
    return {
        props: {
            loadingScreenRef: loadingScreenRef
        }
    }
}