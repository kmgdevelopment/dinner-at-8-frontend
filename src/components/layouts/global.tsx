import DocumentHead from '@/components/layouts/document-head';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';
import { PropsWithChildren } from 'react';
import PageProps from '@/types/page-props';
import LoadingScreen from '@/components/loading-screen/loading-screen';

export default function LayoutGlobal(props: PropsWithChildren<PageProps>) {
    return (
        <>
            <DocumentHead title={props.title} />

            <Header />
            <main>
                <article>
                    {props.children}
                </article>
            </main>
            <Footer />
            <LoadingScreen />
        </>
    )
}