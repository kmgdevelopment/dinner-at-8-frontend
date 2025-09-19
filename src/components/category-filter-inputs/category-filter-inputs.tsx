import type RecipeCategoryCheckbox from "@/types/recipe-category-checkbox"; 
import styles from './category-filter-inputs.module.scss';

export default function CategoryFilterInputs({
    groupId,
    categoryFields, 
    handleFilterCheckboxChange
}: {
    groupId: number,
    categoryFields: RecipeCategoryCheckbox[],
    handleFilterCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {            

    const categories = categoryFields.filter( (category) => {
        if( category.groupId == groupId ) {
            return category;
        }
        return false;
    });

    return (
        <>
            {categories.map( (category) => (
                <div 
                    className={styles['category-filters-input']} 
                    key={category.id}
                >                                
                    <input 
                        type="checkbox" 
                        name={'cat' + category.id} 
                        id={'cat' + category.id} 
                        value={category.id} 
                        checked={category.checked}
                        onChange={ (e) => handleFilterCheckboxChange(e) }
                    />
                    <label 
                        htmlFor={'cat' + category.id}
                    >
                        { category.title }
                    </label>
                </div>
            ) )}
        </>
    )
}