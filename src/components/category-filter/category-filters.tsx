import { globalConfig } from '@/global-config';
import styles from './category-filters.module.scss';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import type RecipeCategory from '@/types/recipe-category';
import type RecipeCategoryCheckbox from '@/types/recipe-category-checkbox';
import type RecipeCategoryGroup from '@/types/recipe-category-group';

const cx = classNames.bind(styles);

const getCategories = async (): Promise<{ cats: RecipeCategory[] }> => {
    const response = await fetch( globalConfig.apiBaseUrl + '/filter-cats.json' );
    return response.json();
}

interface CategoryFilters {
    categoryFields: RecipeCategoryCheckbox[];
    setCategoryFields: React.Dispatch<React.SetStateAction<RecipeCategoryCheckbox[]>>;
    handleFilterCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFilterSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleFilterClear: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function CategoryFilters({
    categoryFields, 
    setCategoryFields, 
    handleFilterCheckboxChange,
    handleFilterSubmit,
    handleFilterClear
}: CategoryFilters) {
    const [showFilters, setShowFilters] = useState(false);
    const categoryGroups = useRef<RecipeCategoryGroup[]>([]);
    const menuBodyClasses = cx({
        "menu-body": true,
        "hidden": !showFilters
    });

    const { isError, isSuccess, data, error } = useQuery({
        queryKey: ['categories'], 
        queryFn: getCategories,
        staleTime: Infinity
    });

    // parse the API data into a list of groups
    // and categories with input data
    // this runs once on mount then never again
    useEffect(() => {
        if( isSuccess ) {
            let categoryList: RecipeCategoryCheckbox[] = [];
            let groupList: RecipeCategoryGroup[] = [];

            data.cats.map( (cat) => {
                // make a list of fields
                categoryList.push({
                    "id": cat.id,
                    "groupId": cat.groupId,
                    "title": cat.title,
                    "checked": false
                });

                // make a list of groups
                let groupExists = false;

                for(let i = 0; i < groupList.length; i++) {
                    if(groupList[i].id == cat.groupId) {
                        groupExists = true;
                        break;
                    }
                }

                if(!groupExists) {
                    groupList.push({
                        "id": cat.groupId,
                        "name": cat.groupName
                    })
                }
            });

            setCategoryFields(categoryList);
            categoryGroups.current = groupList;
        }

        if( isError ) {
            console.error('Error loading category data: ' + error);
        }

    },[data, isSuccess, isError, error]);

    // Open/close the filter menu
    const menuToggleIcon = !showFilters ? '+' : '-';

    const toggleFilterMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowFilters((currentState) => !currentState);
    }

    const renderCheckboxes = (groupId: number) => {
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
                        className={styles['field-checkbox']} 
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
    };

    return (
        <div className={ styles['category-filters'] }>
            <div className={ styles['menu-heading'] }>
                <div className={ styles['gutter'] }>
                    <div className={ styles['container'] }>
                        <div className={ styles['content'] }>
                            <button
                                className={ styles['toggle'] }
                                onClick={ (e) => toggleFilterMenu(e) }
                            >
                                Filters { menuToggleIcon }
                            </button>
                            
                            <button 
                                className={ styles['clear'] }
                                onClick={ (e) => handleFilterClear(e) }
                            >
                                Clear x
                            </button> 
                        </div>
                    </div>
                </div>
            </div>
            
            <div 
                className={ menuBodyClasses }
            >
                <div className={ styles['gutter'] }>
                    <div className={ styles['container'] }>
                        <div className={ styles['content'] }>
                            <form 
                                onSubmit={ (e) => handleFilterSubmit(e) }
                            >
                                <div className={ styles['fieldset'] }>
                                    { categoryGroups.current.map( (group) => (
                                        <div 
                                            className={ styles['fieldgroup'] }
                                            key={group.id}
                                        >
                                            <h6>{ group.name }</h6>

                                            { renderCheckboxes(group.id) }
                                        </div>
                                    ) )}
                                </div>
                                
                                <div className={ styles['buttons'] }>
                                    <input 
                                        type="submit" 
                                        value="Apply" 
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
                                            
    )
}

export default CategoryFilters;