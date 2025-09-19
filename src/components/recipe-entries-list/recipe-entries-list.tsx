import { LayoutGrid, Col } from "@/components/layouts/layout-components";
import RecipeCard from "@/components/recipe-card/recipe-card";
import RecipeListing from "@/types/recipe-listing";
import { ApolloError } from "@apollo/client";

export default function RecipeEntriesList({error, data}: {
    error: ApolloError | undefined, 
    data: {recipeList: RecipeListing[]} | undefined
}) {
    if( error ) {
        console.error(error);
        return <p>There was an error fetching your results.</p>
    }
    if (!data) return null;

    if( !data.recipeList.length ) {
        return <p>There are no results matching your search/filters.</p>
    }

    return (
        <LayoutGrid 
            colCount={3} 
            stretch
        >
            { data.recipeList.map( (entry: RecipeListing ) => {
                return (
                    <Col key={entry.id}>
                        <RecipeCard entryData={entry} />
                    </Col>
                )
            }) }
        </LayoutGrid>
    );
}