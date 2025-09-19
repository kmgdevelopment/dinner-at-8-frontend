import { useQuery } from '@apollo/client';
import GET_RECIPE from '@/data/single-recipe-query';
import type RecipeEntry from '@/types/recipe-entry';

export default function useSingleRecipeQuery(slug: string) {
    return useQuery<{ recipe: RecipeEntry }>(GET_RECIPE, {
        variables: {
            slug: slug
        }
    });
}