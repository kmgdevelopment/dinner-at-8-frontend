import RecipeIngredient from "./recipe-ingredient"

export default interface RecipeEntry {
    "title": string,
    "recipeServes": number | null,
    "recipeMakes": {
        "quantity": string,
        "unit": string
    } | null,
    "recipeImg": string,
    "recipeIngredients": [
        {
            "id": number,
            "type": string,
            "text": string,
            "list": RecipeIngredient[]
        }
    ],
    "recipeInstructions": [
        {
            "id": number,
            "type": string,
            "text": string,
            "list": [
                {
                    "id": number,
                    "description": string
                }
            ]
        }
    ],
    "recipeNotes": string | null,
    "recipeSourceName": string | null,
    "recipeSourceUrl": string | null
}