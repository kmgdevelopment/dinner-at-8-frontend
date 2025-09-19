import { gql, useQuery } from "@apollo/client";
import type RecipeCategory from '@/types/recipe-category';

const GET_CAT_FILTERS = gql`
    query GetCategoryFilters(
        $group: [String]
        $level: Int
        $orderby: String
    ) {
        cats: categories(
            group: $group
            level: $level
            orderBy: $orderby
        ) {
            groupId
            groupHandle
            id
            title
        }
    }
`;

export default function useCategoryFiltersQuery() {
    return useQuery<{ cats: RecipeCategory[] }>(GET_CAT_FILTERS, { 
        variables: {
            group: ['diet','holiday','meal','protein','season'],
            level: 1,
            orderby: 'groupId,title'
        }
     });
}