// utilites
import parse from 'html-react-parser';
import dynamic from 'next/dynamic';
import useSingleRecipeQuery from '@/data/use-single-recipe-query';

// components
import LayoutGlobal from '@/components/layouts/global';
import { SectionGroup, SectionWrap, Section, LayoutGrid, Col } from '@/components/layouts/layout-components';
import EntryBanner from '@/components/entry-banner/entry-banner';
import EntryHeroImg from '@/components/entry-hero-img/entry-hero-img';
import EntryIngredientList from '@/components/entry-ingredient-list/entry-ingredient-list';
import EntryInstructionList from '@/components/entry-instruction-list/entry-instruction-list';
import EntryFooter from '@/components/entry-footer/entry-footer';

// types
import type RecipeEntry from '@/types/recipe-entry';

// the wakelock API needs a browser to run so we ignore it for SSR
const DynamicWakelock = dynamic( () => import('../../components/wakelock/wakelock'), { ssr: false } );

// we assign 'slug' in getStaticProps() below,
// which then is pulled in by the main App component
// and passed back to the Page component as 'pageProps'
export default function Page(pageProps: { slug: string }) {
    const { loading, error, data } = useSingleRecipeQuery(pageProps.slug);

    if( error ) {
        console.error(error);
        return <p>There was an error loading the page.</p>
    } 
    if (!data) return null;

    const recipe: RecipeEntry = data.recipe;

    return (
        <LayoutGlobal title={ recipe.title }>
            <EntryBanner {...recipe} />
            <SectionGroup>
                <SectionWrap>
                    { recipe.recipeImg && (
                        <Section>
                            <EntryHeroImg {...recipe} />
                        </Section>
                    )}
                    <Section>
                        <LayoutGrid>
                            <Col>
                                <DynamicWakelock />
                            </Col>
                            <Col>
                                <EntryIngredientList {...recipe} />
                            </Col>
                        </LayoutGrid>
                    </Section>
                    <Section>  
                        <LayoutGrid>
                            <Col>
                                <EntryInstructionList {...recipe} />
                            </Col>
                            
                            { recipe.recipeNotes && (
                                <Col>
                                    <h5>Notes</h5>
                                    { parse(recipe.recipeNotes) }
                                </Col>
                            )}
                        </LayoutGrid>
                    </Section>
                </SectionWrap>
            </SectionGroup>

            <EntryFooter {...recipe} />
        </LayoutGlobal>
    )
}

// params.slug is provided for us by NextJS
// https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes
export async function getStaticProps({ params }: { params: { slug: string }}) {
    return {
        props: {
            slug: params.slug
        }
    };
}

// ISR
// https://nextjs.org/docs/pages/guides/incremental-static-regeneration
export const getStaticPaths = async () => {
    const paths: string[] = [];
  
    return {
      paths,
      fallback: 'blocking',
    };
};