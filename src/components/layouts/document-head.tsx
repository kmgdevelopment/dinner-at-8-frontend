import Head from 'next/head';
import pageProps from '@/types/page-props';
import { globalConfig } from '@/global-config';

export default function DocumentHead(pageProps: pageProps) {
    return (
        <Head>
            <title>{ `${pageProps.title} | ${globalConfig.siteName}` }</title>
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            <link rel="alternate icon" href="/favicon.ico" />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            <meta name="robots" content="noindex,noarchive,nofollow" />
        </Head>
    )
}