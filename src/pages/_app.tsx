import '@/sass/global.scss';
import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import queryClient from '@/data/query-client';
import { montserrat, frankRuhlLibre } from '@/utils/fonts';
import { useRef } from 'react';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ApolloProvider client={queryClient}>
            <style jsx global>{`
                :root {
                    --montserrat-font: ${montserrat.style.fontFamily};
                    --frank-ruhl-libre-font: ${frankRuhlLibre.style.fontFamily};
                }
            `}</style>

            <Component {...pageProps} />
        </ApolloProvider>
    )
}

export function getStaticProps({ loadingScreenRef }: { loadingScreenRef: Element | null }) {
    return {
        props: {
            loadingScreenRef: loadingScreenRef
        }
    }
}