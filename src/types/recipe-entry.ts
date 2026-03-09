import RecipeIngredient from "./recipe-ingredient"

export default interface RecipeEntry {
    "title": string,
    "recipeServes": number | null,
    "recipeMakes": [{
        "quantity": string,
        "unit": string
    }],
    "recipeImg": [
        {
            url: string,
        }
    ],
    "recipeIngredients_new": RecipeIngredient[],
    "recipeInstructions_new": string,
    "recipeNotes": string | null,
    "recipeSourceName": string | null,
    "recipeSourceUrl": string | null
}