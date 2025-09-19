export default interface RecipeQueryFilters {
    section: string[],
    limit: number,
    offset: number,
    search?: string,
    orderBy?: string,
    relatedTo?: (string | number)[] | undefined,
}
