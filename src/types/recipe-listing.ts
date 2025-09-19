export default interface RecipeListing {
    id: number;
    title: string;
    uri: string;
    recipeImg: [
        {
            url: string;
        }
    ];
}