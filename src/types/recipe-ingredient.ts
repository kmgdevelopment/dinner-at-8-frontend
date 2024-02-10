export default interface RecipeIngredient {
    "id": number,
    "quantity": string | null,
    "unit": string | null,
    "ingredient": string,
    "preparation": string | null
}