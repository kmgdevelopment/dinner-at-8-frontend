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
            recipeIngredients {
                ... on recipeIngredients_heading_BlockType {
                id
                type: typeHandle
                text
                }
                ... on recipeIngredients_ingredientList_BlockType {
                id
                type: typeHandle
                list {
                    ... on list_BlockType {
                    id
                    quantity
                    unit
                    ingredient
                    preparation
                    }
                }
                }
            }
            recipeInstructions {
                ... on recipeInstructions_heading_BlockType {
                id
                type: typeHandle
                text
                }
                ... on recipeInstructions_instructionList_BlockType {
                id
                type: typeHandle
                list: theList {
                    ... on theList_BlockType {
                    id
                    description
                    }
                }
                }
            }
            recipeNotes
            recipeSourceName
            recipeSourceUrl
            }
            
        }
    }
`;

export default GET_RECIPE;