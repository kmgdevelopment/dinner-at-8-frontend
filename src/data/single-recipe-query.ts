import { gql } from "@apollo/client";

const GET_RECIPE = gql`
    query GetRecipe(
        $slug: [String]
        ) {
        recipe: entry(
            section: ["recipes"], 
            slug: $slug, 
            limit: 1
        ) {
            title
            ... on recipes_recipes_Entry {
                recipeServes
                recipeMakes {
                    quantity
                    unit
                }
                recipeImg {
                    url
                }
                recipeIngredients_new {
                    quantity
                    unit
                    ingredient
                    preparation
                    heading
                }
                recipeInstructions_new
                recipeNotes
                recipeSourceName
                recipeSourceUrl
            } 
        }
    }
`;

export default GET_RECIPE;