// config
import { globalConfig } from '@/global-config';

// utilites
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import parse from 'html-react-parser';
import dynamic from 'next/dynamic';

// components
import LayoutGlobal from '@/components/layouts/global';
import { SectionGroup, SectionWrap, Section, LayoutGrid, Col } from '@/components/layouts/layout-components';
import EntryBanner from '@/components/entry-banner/entry-banner';
import EntryHeroImg from '@/components/entry-hero-img/entry-hero-img';
import EntryIngredientList from '@/components/entry-ingredient-list/entry-ingredient-list';
import EntryInstructionList from '@/components/entry-instruction-list/entry-instruction-list';
import EntryFooter from '@/components/entry-footer/entry-footer';

const getEntry = async (slug: string) => {
    let url = globalConfig.apiBaseUrl + '/recipes/' + slug + '.json';
    
    const response = await fetch(url);

    return response.json();
}

// since we call useQuery() twice with the same
// options we move them to a single function
const queryOptions = (slug: string) => {
    return {
        queryKey: [slug], 
        queryFn: () => getEntry(slug)
    }
}

// the wakelock API needs a browser to run so we ignore it for SSR
const DynamicWakelock = dynamic( () => import('../../components/wakelock/wakelock'), { ssr: false } );

// we assign 'slug' in getStaticProps() below,
// which then is pulled in by the main App component
// and passed back to the Page component as 'pageProps'
export default function Page(pageProps: { slug: string }) {
    const { isError, isSuccess, data, error } = useQuery(queryOptions(pageProps.slug));

    if( isError ) {
        console.error(error);
        return <p>There was an error loading the page.</p>
    } 
    if( isSuccess ) {
        return (
            <LayoutGlobal title={ data.title }>
                <EntryBanner {...data} />
                <SectionGroup>
                    <SectionWrap>
                        { data.recipeImg && (
                            <Section>
                                <EntryHeroImg {...data} />
                            </Section>
                        )}
                        <Section>
                            <LayoutGrid>
                                <Col>
                                    <DynamicWakelock />
                                </Col>
                                <Col>
                                    <EntryIngredientList {...data} />
                                </Col>
                            </LayoutGrid>
                        </Section>
                        <Section>  
                            <LayoutGrid>
                                <Col>
                                    <EntryInstructionList {...data} />
                                </Col>
                                
                                { data.recipeNotes && (
                                    <Col>
                                        <h5>Notes</h5>
                                        { parse(data.recipeNotes) }
                                    </Col>
                                )}
                            </LayoutGrid>
                        </Section>
                    </SectionWrap>
                </SectionGroup>

                <EntryFooter {...data} />
            </LayoutGlobal>
        )
    }
}

// prefetch the initial data and generate it
// server-side so it loads by default before
// being hydrated client-side
// params.slug is provided for us by NextJS
export async function getStaticProps({ params }: { params: { slug: string }}) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery(queryOptions(params.slug));

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            slug: params.slug
        }
    };
}

// NextJS docs recommend pulling in a list of all possible posts
// for pre-rendering, which isn't practical, IMO
// So we use "fallback: 'blocking'" with an empty paths array
// to build pages on-demand and then cache them for subsequent loads
export const getStaticPaths = async () => {
    const paths: string[] = [];
  
    return {
      paths,
      fallback: 'blocking',
    };
};