import type RecipeCategoryCheckbox from "./recipe-category-checkbox";

export default interface CategoryFilters {
    categoryFields: RecipeCategoryCheckbox[];
    setCategoryFields: React.Dispatch<React.SetStateAction<RecipeCategoryCheckbox[]>>;
    handleFilterCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFilterSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleFilterClear: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    setCategoryFieldDataLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}