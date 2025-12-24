// utilities
import { useReactiveVar, makeVar } from '@apollo/client';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import useRecipeEntriesQuery from '@/data/use-recipe-entries-query';
import applyQueryString from '@/utils/apply-query-string';
import { handleFilterCheckboxChangeFactory, handleFilterClearFactory, handleFilterSubmitFactory } from '@/utils/category-filters';
import { handleSearchFactory } from '@/utils/search-field';
import updateUrl from '@/utils/update-url';

// components
import LayoutGlobal from '@/components/layouts/global';
import { SectionGroup, SectionWrap, Section, LayoutGrid, Col } from '@/components/layouts/layout-components';
import Pager from '@/components/pager/pager';
import RecipeEntriesList from '@/components/recipe-entries-list/recipe-entries-list';

// types
import type RecipeCategoryCheckbox from '@/types/recipe-category-checkbox';

const templateProps = {
    title: "Recipe Listing"
};

// don't load the filters component server-side
// because it relies on javascript to function
const DynamicListingFilters = dynamic( () => import('../components/listing-filters/listing-filters'), { ssr: false } );

// search queries & category filters trigger a full refetch, 
// so we use Apollo reactive variables to manage them
const submittedSearchQuery = makeVar<string|undefined>(undefined);
const submittedCategories = makeVar<number[]|undefined>(undefined);

export default function Home() {
    const queryLimit = useRef(10);
    const pagerOffset = useRef(0);
    const queryOrderBy = useRef<string|undefined>(undefined);

    // re-usable object for Apollo query hooks
    const gqlSubmittedCats = useReactiveVar(submittedCategories);
    const queryVariables = {
        section: ["recipes"],
        limit: queryLimit.current,
        offset: pagerOffset.current,
        search: useReactiveVar(submittedSearchQuery),
        orderBy: queryOrderBy.current,
        // Craft needs the operator 'and' as the first item in the array
        // in order to search for entries related to multiple categories
        // rather than returning entries related to any of the categories
        relatedTo: gqlSubmittedCats === undefined ? undefined : ['and', ...gqlSubmittedCats],
    };

    // value of the search input can be different from
    // the query filter value for various reasons so we store
    // them separately
    const [searchField, setSearchField] = useState('');
    const searchIsChanging = useRef(false);    
    const debounceTimer = useRef(0);
    
    // submitted categories must be stored separately
    // from the checkbox UI state to prevent data from
    // being updated without hitting the submit button
    // example: user checks a box but doesn't click submit, 
    // then types in search bar
    const [categoryFields, setCategoryFields] = useState<RecipeCategoryCheckbox[]>([]);
    // we need an effect to run when the category filter data has loaded
    // so we create a state variable we can monitor with a useEffect
    const [categoryFieldDataLoaded, setCategoryFieldDataLoaded] = useState(false);

    const {ref, inView} = useInView(); // infinite scroll trigger
    const router = useRouter(); // for query string access

    // fetch the recipe data using the Apollo Client query function
    // passing in filter parameters if they exist
    const { loading, error, data, fetchMore } = useRecipeEntriesQuery(queryVariables);

    // QUERY STRING FILTERING
    // update the filters based on the query string (or lack thereof)
    // all query filtering should flow from here
    useEffect( () => {
        // only run if the category filters data has already been loaded,
        // otherwise, wait for the categoryFieldDataLoaded state to be
        // updated by the category filters component
        if( categoryFields.length ) {
            applyQueryString({
                queryString: router.query,
                categoryFields: categoryFields, 
                setCategoryFields: setCategoryFields,
                submittedCategories: submittedCategories, // getter and setter passed in the same property
                searchField: searchField,
                setSearchField: setSearchField,
                submittedSearchQuery: submittedSearchQuery, // getter and setter passed in the same property
                searchIsChanging: searchIsChanging,
                orderBy: queryOrderBy,
                pagerOffset: pagerOffset,
            });
        }
    },[router, categoryFieldDataLoaded]);


    // INFINITE SCROLL PAGINATION
    // trigger Apollo fetchMore() when 
    // pagination enters the viewport
    useEffect(() => {
        if(!data) return;
        if(inView && !loading && data.recipeList.length < data.entryCount) {
            fetchMore({
                variables: {
                    ...queryVariables,
                    offset: pagerOffset.current = data.recipeList.length
                }
            });
        }
        
    }, [inView]);

    // clear any pending debounce timers
    // when component unmounts
    useEffect(() => {
        return () => clearTimeout(debounceTimer.current);
    }, []);

    // EVENT HANDLERS
    // factories are used to pass in state
    // and other variables to the handlers
    // without needing to re-declare them
    // on every render
    const handleFilterCheckboxChange = handleFilterCheckboxChangeFactory({
        categoryFields,
        setCategoryFields
    });

    const handleFilterSubmit = handleFilterSubmitFactory({
        categoryFields,
        submittedSearchQuery,
        router
    });

    const handleFilterClear = handleFilterClearFactory({
        categoryFields,
        setCategoryFields,
        submittedSearchQuery,
        router
    });

    const handleSearch = handleSearchFactory({
        setSearchField,
        debounceTimer,
        searchIsChanging,
        router,
        submittedCategories,
    });

    return (
        <LayoutGlobal 
            title={ templateProps.title }
        >
            <DynamicListingFilters 
                searchInputValue={searchField} 
                handleSearchChange={handleSearch} 
                handleSearchSubmit={handleSearch}
                categoryFields={categoryFields}
                setCategoryFields={setCategoryFields}
                handleFilterCheckboxChange={handleFilterCheckboxChange}
                handleFilterSubmit={handleFilterSubmit}
                handleFilterClear={handleFilterClear}
                setCategoryFieldDataLoaded={setCategoryFieldDataLoaded}
            />
            
            <SectionGroup>
                <SectionWrap>
                    <Section>
                        <LayoutGrid>
                            <Col>                                
                                <RecipeEntriesList 
                                    error={error} 
                                    data={data} 
                                /> 
                            </Col>  

                            <Col>
                                {data && data.recipeList.length < data.entryCount && (
                                    <Pager 
                                        entryCount={data.entryCount}
                                        limit={queryLimit.current}
                                        offset={pagerOffset.current}
                                        loading={loading}
                                        viewRef={ref}       
                                    />
                                )}
                            </Col>
                        </LayoutGrid>                        
                    </Section>
                </SectionWrap>
            </SectionGroup>
        </LayoutGlobal>
    )
    
}
