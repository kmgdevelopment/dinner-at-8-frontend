import styles from './category-filters.module.scss';
import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import type RecipeCategoryGroup from '@/types/recipe-category-group';
import useCategoryFiltersQuery from '@/data/use-category-filters-query';
import type CategoryFilters from '@/types/category-filters';
import buildCatFilterGroups from '@/utils/build-cat-filter-groups';
import CategoryFilterInputs from '../category-filter-inputs/category-filter-inputs';
import { handleFilterToggleFactory } from '@/utils/category-filters';
import { useRouter } from 'next/router';

const cx = classNames.bind(styles);

function CategoryFilters({
    categoryFields, 
    setCategoryFields, 
    handleFilterCheckboxChange,
    handleFilterSubmit,
    handleFilterClear,
    setCategoryFieldDataLoaded
}: CategoryFilters) {
    const [showFilters, setShowFilters] = useState(false);
    const categoryGroups = useRef<RecipeCategoryGroup[]>([]);
    const menuBodyClasses = cx({
        "menu-body": true,
        "hidden": !showFilters
    });

    const router = useRouter();

    // Load category data
    const {data, error} = useCategoryFiltersQuery();

    if (error) console.error('Error loading category data: ' + error);

    // do stuff when the category data loads
    useEffect(() => {
        if (!data) return;

        // build the category groups and lists
        const catFilterLists = buildCatFilterGroups(data);
        categoryGroups.current = catFilterLists!.groupList;

        // set the category fields state to the loaded list
        setCategoryFields(catFilterLists!.categoryList);
        // trigger the useEffect for query string application
        setCategoryFieldDataLoaded(true);
            
    }, [data]);

    const handleFilterToggle = handleFilterToggleFactory({
        showFilters,
        setShowFilters
    });

    return (
        <div className={ styles['category-filters'] }>
            <div className={ styles['menu-heading'] }>
                <div className={ styles['gutter'] }>
                    <div className={ styles['container'] }>
                        <div className={ styles['content'] }>
                            <button
                                className={ styles['toggle'] }
                                onClick={ (e) => handleFilterToggle(e) }
                            >
                                Filters { !showFilters ? '+' : '-' }
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

                                            <CategoryFilterInputs
                                                groupId={group.id}
                                                categoryFields={categoryFields}
                                                handleFilterCheckboxChange={handleFilterCheckboxChange}
                                            />  
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