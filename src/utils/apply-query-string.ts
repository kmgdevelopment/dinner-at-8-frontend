import type ApplyQueryString from "@/types/apply-query-string";
import RecipeCategoryCheckbox from "@/types/recipe-category-checkbox";

function updateCategoryFilters({
    queryString, 
    categoryFields, 
    setCategoryFields,
}: {
    queryString: string | string[] | undefined;
    categoryFields: RecipeCategoryCheckbox[];
    setCategoryFields: (cats: RecipeCategoryCheckbox[]) => void;
}) {
    // convert the query key into an array (undefined if no query string exists)
    // we have to check for both string and array types because Next.js
    // uses a special query handling method
    // https://stackoverflow.com/a/21644539/532742
    let newSubmittedCategories: number[]|undefined;
    if (typeof queryString === "string") {
        newSubmittedCategories = queryString.split(' ').map(Number);
    } else if (Array.isArray(queryString)) {
        // thanks copilot :)
        newSubmittedCategories = queryString.flatMap(q => q.split(' ').map(Number));
    } else {
        newSubmittedCategories = undefined;
    }
    // the UI fields start out empty because we have to update checked/unchecked first
    let newCategoryFields: RecipeCategoryCheckbox[] = [];

    // create a new array of category UI fields
    // with the appropriate boxes checked
    // if no category query string exists, all boxes are unchecked
    newCategoryFields = categoryFields.map( (cat) => {
        const checkedCategories = newSubmittedCategories !== undefined ? newSubmittedCategories : [];
        // check the box if it matches a queried category
        if( checkedCategories.includes(Number(cat.id)) ) {
            return {
                ...cat,
                checked: true
            }
        }
        // uncheck if not
        return {
            ...cat,
            checked: false
        }
    });

    // check if the category field UI has already been updated
    // by manual user input. If so, don't bother re-applying state
    // (arrays are objects and can't be compared directly so we stringify them)
    if( JSON.stringify(categoryFields) != JSON.stringify(newCategoryFields) ) setCategoryFields(newCategoryFields);
    
    return newSubmittedCategories;
}

function updateSearchFilter({
    queryString,
    searchField,
    setSearchField,
    orderBy,
}: {
    queryString: string | string[] | undefined;
    searchField: string;
    setSearchField: (s: string) => void;
    orderBy: React.MutableRefObject<string|undefined>;
}) {
    // set the query string value if there is one, undefined if not
    // we have to check for both string and array types because Next.js
    // uses a special query handling method (thanks copilot :P)
    let newSearchQuery: string|undefined = 
        typeof queryString === "string"
            ? queryString.trim()
            : Array.isArray(queryString)
                ? queryString.join(" ").trim()
                : undefined;
    // input elements can't be set to undefined so we use an empty string instead
    let newSearchField: string = 
        queryString === undefined
            ? ''
            : Array.isArray(queryString)
                ? queryString.join(" ")
                : queryString;

    // update search input if filter effect
    // was not triggered by a manual user input change
    // i.e. direct URL navigation, back/forward button click, etc.
    if( newSearchField != searchField ) setSearchField(newSearchField); 
    
    // order results by score if a query exists
    // otherwise use default ordering (postDate desc)
    orderBy.current = (newSearchQuery !== undefined) ? 'score' : undefined;

    // for Apollo filtering purposes, 
    // undefined is equivalent to no search query
    return newSearchQuery;
}

// pager query string 
// work in progress...
function updatePagerQuery({
    queryString,
    queryLimit,
}: {
    queryString: string | string[] | undefined;
    queryLimit: number;
}) {
    // If a page query string exists, multiply the 
    // page number by the query limit to get the offset
    // Set to 0 if no page query string exists
    let newOffset = 0;
    let pageNum: number | undefined;
    if (typeof queryString === "string") {
        pageNum = parseInt(queryString, 10);
    } else if (Array.isArray(queryString) && queryString.length > 0) {
        pageNum = parseInt(queryString[0], 10);
    }
    if (!isNaN(pageNum as number) && pageNum !== undefined) {
       newOffset = pageNum * queryLimit;
    }

    return newOffset;
}

export default function applyQueryString({ 
    queryString, 
    categoryFields, 
    setCategoryFields, 
    submittedCategories,
    searchField,
    setSearchField,
    submittedSearchQuery,
    orderBy,
    pagerOffset,
}: ApplyQueryString) { 
    const newCategoryFilters = updateCategoryFilters({
        queryString: queryString.category,
        categoryFields: categoryFields,
        setCategoryFields: setCategoryFields,
    });

    const newSearchFilter = updateSearchFilter({
        queryString: queryString.query,
        searchField: searchField,
        setSearchField: setSearchField,
        orderBy: orderBy,
    });

    // refetch Apollo query with new filters
    // only refetch if something has changed    
    if(submittedCategories() !== newCategoryFilters || submittedSearchQuery() !== newSearchFilter) {
        // reset pager offset to 0 if filters change
        pagerOffset.current = 0;
        submittedCategories(newCategoryFilters);
        submittedSearchQuery(newSearchFilter);
    }
}