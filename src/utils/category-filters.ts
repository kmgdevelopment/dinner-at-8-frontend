import RecipeCategoryCheckbox from "@/types/recipe-category-checkbox";
import updateUrl from "./update-url";
import { ReactiveVar } from "@apollo/client";
import { NextRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";

// FILTER CHECKBOX CHANGE
// Field UI changes but data filtering does not
export function handleFilterCheckboxChangeFactory({
    categoryFields,
    setCategoryFields
}: {
    categoryFields: RecipeCategoryCheckbox[],
    setCategoryFields: Dispatch<SetStateAction<RecipeCategoryCheckbox[]>>
}) {
    return function handleFilterCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
        let newCategoryFields = [...categoryFields];
        const catId = Number(e.target.value);
        const objIndex = newCategoryFields.findIndex( (cat) => cat.id == catId );
        newCategoryFields[objIndex].checked = !newCategoryFields[objIndex].checked;

        setCategoryFields(newCategoryFields);
    }
}


// FILTER SUBMIT
export function handleFilterSubmitFactory({
    categoryFields,
    submittedSearchQuery,
    router
}: {
    categoryFields: RecipeCategoryCheckbox[],
    submittedSearchQuery: ReactiveVar<string|undefined>,
    router: NextRouter
}) {
    return function handleFilterSubmit (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const newSubmittedCategories: number[] = [];
        categoryFields.map( (cat) => {
            if(cat.checked) {
                newSubmittedCategories.push(cat.id);
            }
        });

        // update url & trigger filter effect
        updateUrl({
            sq: submittedSearchQuery(), 
            cats: newSubmittedCategories,
            router: router,
        });
    }
}

// FILTER CLEAR
export function handleFilterClearFactory({
    categoryFields,
    setCategoryFields,
    submittedSearchQuery,
    router
} : {
    categoryFields: RecipeCategoryCheckbox[],
    setCategoryFields: Dispatch<SetStateAction<RecipeCategoryCheckbox[]>>,
    submittedSearchQuery: ReactiveVar<string|undefined>,
    router: NextRouter
}) {
    return function handleFilterClear (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();

        // update form fields
        const newCatFields = categoryFields.map( (cat) => {
            if(cat.checked) {
                return {
                    ...cat,
                    checked: false
                }
            }
            return cat;
        });

        // update field UI
        setCategoryFields(newCatFields);

        // update url & trigger filter effect
        updateUrl({
            sq: submittedSearchQuery(),
            cats: [],
            router: router,
        });
    }
}

export function handleFilterToggleFactory({
    showFilters,
    setShowFilters
}: {
    showFilters: boolean,
    setShowFilters: Dispatch<SetStateAction<boolean>>
}) {
    return function handleFilterToggle(e: React.MouseEvent) {
        e.preventDefault();
        setShowFilters((currentState) => !currentState);
    }
}
