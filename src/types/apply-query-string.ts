import { ParsedUrlQuery } from "querystring";
import { ReactiveVar } from "@apollo/client";
import { MutableRefObject, SetStateAction, Dispatch } from "react";
import RecipeCategoryCheckbox from "@/types/recipe-category-checkbox";

export default interface ApplyQueryString {
    queryString: ParsedUrlQuery;
    categoryFields: RecipeCategoryCheckbox[];
    setCategoryFields: (cats: RecipeCategoryCheckbox[]) => void;
    submittedCategories: ReactiveVar<number[]|undefined>;
    searchField: string;
    setSearchField: Dispatch<SetStateAction<string>>;
    submittedSearchQuery: ReactiveVar<string|undefined>;
    orderBy: MutableRefObject<string|undefined>;
    pagerOffset: MutableRefObject<number>;
}