import { gql, useQuery } from "@apollo/client";
import type RecipeQueryFilters from "@/types/recipe-query-filters";
import type RecipeListing from "@/types/recipe-listing";

const GET_RECIPE_ENTRIES = gql`
    query GetRecipeEntries(
        $section: [String]
        $limit: Int 
        $offset: Int 
        $search: String
        $orderBy: String
        $relatedTo: [QueryArgument]
    ) {
        recipeList: entries(
            section: $section
            limit: $limit
            offset: $offset
            search: $search
            orderBy: $orderBy
            relatedTo: $relatedTo
        ) {
            id
            title
            uri
            ... on recipes_recipes_Entry {
                recipeImg {
                    url
                }
            }
        }
        entryCount(
            section: $section,
            limit: $limit,
            offset: $offset,
            search: $search,
            orderBy: $orderBy,
            relatedTo: $relatedTo
        )
    }
`;

export default function useRecipeEntriesQuery(variables: RecipeQueryFilters) {
    return useQuery<{ recipeList: RecipeListing[], entryCount: number }>(GET_RECIPE_ENTRIES, { variables });
}