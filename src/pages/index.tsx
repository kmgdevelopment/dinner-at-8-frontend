// config
import { globalConfig } from '@/global-config';

// utilities
import { useInfiniteQuery, QueryClient, dehydrate } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

// components
import LayoutGlobal from '@/components/layouts/global';
import { SectionGroup, SectionWrap, Section, LayoutGrid, Col } from '@/components/layouts/layout-components';
import RecipeCard from '@/components/recipe-card/recipe-card';
import Pager from '@/components/pager/pager';

// types
import type ListingMeta from '@/types/listing-meta';
import type RecipeListing from '@/types/recipe-listing';
import type RecipeCategoryCheckbox from '@/types/recipe-category-checkbox';
import type RecipeQueryFilters from '@/types/recipe-query-filters';

const templateProps = {
    title: "Recipe Listing"
};

// get Craft Entry API data from the api site
// pageParam is provided by useInfiniteQuery
const getEntries = async (
    pageParam: number,
    filterParams?: RecipeQueryFilters, 
): Promise<{ 
    entries: RecipeListing[], 
    meta: ListingMeta 
}> => {
    let url = globalConfig.apiBaseUrl + '/recipes.json';

    url += buildQueryString(pageParam, filterParams);
    
    const response = await fetch(url);

    return response.json();
}

const buildQueryString = (
    pageParam?: number, 
    filterParams?: RecipeQueryFilters
) => {
    let queryItems = [];
    let queryString: string = '';

    if(pageParam) {
        queryItems.push(`page=${pageParam}`);
    }
    if(filterParams?.searchQuery) {
        queryItems.push(`query=${filterParams.searchQuery}`);
    }
    if(filterParams?.categories && filterParams?.categories.length) {
        queryItems.push('category=' + filterParams.categories.join('+'));
    }

    if( queryItems.length ) {
        queryString = '?' + queryItems.join('&');
    }
    
    return queryString;
}

// options to pass into useInfiniteQuery
// since we call this twice - once for SSR
// and once for hydration it's easier to have
// it as a reusable function
const getInfiniteQueryOptions = (
    filterParams?: RecipeQueryFilters
) => {
    // IMPORTANT: Query key should match the unique filter parameters
    let queryKey = 'defaultEntries';

    if( 
        filterParams 
        && (
            filterParams.searchQuery != "" 
            || (
                filterParams.categories 
                && filterParams.categories.length > 0
            )
        )
    ) {
        queryKey = buildQueryString(undefined, filterParams);
    }

    // TODO: store cached data in localStorage for more persistent caching
    // https://tanstack.com/query/latest/docs/react/plugins/persistQueryClient

    const infiniteQueryOptions = {
        // give the fetch a unique identifier name that it will be cached with
        queryKey: [queryKey], 
        initialPageParam: 1,
        queryFn: ({ pageParam }: { pageParam: number }) => getEntries(pageParam, filterParams),
        getNextPageParam: (lastPage: { entries: RecipeListing[]; meta: ListingMeta; }) => {
            const pagerData = lastPage.meta.pagination;
            if( pagerData.current_page < pagerData.total_pages ) {
                return lastPage.meta.pagination.current_page + 1;
            } 
            return;
        },
        // only refetch data every 5 minutes
        // (refetched automatically on component mount)
        staleTime: (5 * 60 * 1000)
    };

    return infiniteQueryOptions;
}

const DynamicListingFilters = dynamic( () => import('../components/listing-filters/listing-filters'), { ssr: false } );

export default function Home() {
    // value of the search input can be different from
    // the query filter value for various reasons so we store
    // them separately
    const [searchField, setSearchField] = useState('');
    const submittedSearchQuery = useRef<string>('');
    const searchIsChanging = useRef(false);    
    const debounceTimer = useRef(0);
    // submitted categories must be stored separately
    // from the checkbox UI state to prevent data from
    // being updated without hitting the submit button
    // example: user checks a box but don't click submit, 
    // then types in search bar
    const [categoryFields, setCategoryFields] = useState<RecipeCategoryCheckbox[]>([]);
    const submittedCategories = useRef<number[]>([]);
    const [filterParams, setFilterParams] = useState<RecipeQueryFilters>({searchQuery: '', categories: []});
    const {ref, inView} = useInView();
    const router = useRouter();

    // fetch the data using React Query's useInfinteQuery method
    // pass search and filter state into the options function
    const {
        isError, 
        error,
        isSuccess, 
        hasNextPage, 
        fetchNextPage, 
        isFetchingNextPage, 
        data
    } = useInfiniteQuery(getInfiniteQueryOptions(filterParams));

    const renderEntries = () => {
        if( isError ) {
            console.error(error);
            return <p>There was an error fetching your results.</p>
        }
        if( isSuccess ) {
            if( !data.pages[0].entries.length ) {
                return <p>There are no results matching your search/filters.</p>
            }

            return (
                <LayoutGrid 
                    colCount={3} 
                    stretch
                >
                    {/* infinite query caches the data as 'pages'
                        so we need to loop through each page
                        of data as we go
                    */}
                    { data.pages.map( (page) => 
                        page.entries.map( (entry) => (
                            <Col key={entry.id}>
                                <RecipeCard entryData={entry} />
                            </Col>
                        )
                    )) }
                </LayoutGrid>
            )
            
        }
        return <></>;
    }

    const updateUrl = (sq: string, cats: number[]) => {
        const queryString = buildQueryString(
            undefined,
            {
                searchQuery: sq,
                categories: cats
            }
        )
        
        router.push(queryString, undefined, { scroll: false, shallow: true });
    }

    const renderPager = () => {
        if( isSuccess ) {       
            const props = { 
                pagerData: data.pages[data.pages.length-1].meta.pagination,
                hasNextPage: hasNextPage, 
                isFetchingNextPage: isFetchingNextPage,
                fetchNextPage: fetchNextPage,
                viewRef: ref
            };

            return (
                <Pager {...props} />
            )
        }
        return <></>;
    }

    // trigger infinite query fetch when 
    // pagination enters the viewport
    useEffect(() => {
        if(inView && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView]);

    // SEARCH INPUT CHANGE
    const handleSearch = (e: React.FormEvent): void => {
        clearTimeout(debounceTimer.current);

        if( e.type == 'change' ) {
            // tell query string update effect not to
            // update input field value
            searchIsChanging.current = true;

            // https://bobbyhadz.com/blog/typescript-property-value-not-exist-type-eventtarget
            const target = e.target as HTMLInputElement;

            // update input value
            // should always run immediately
            setSearchField(target.value);

            // update URL & trigger filter effect
            // after debounce
            debounceTimer.current = window.setTimeout(() => {
                updateUrl(target.value, submittedCategories.current);
            }, 500);            

        } else if( e.type == 'submit' ) {
            // we're ignoring submit since onchange
            // handles everything for us already
            e.preventDefault();
            updateUrl(searchField, submittedCategories.current);
        }
    }

    // clear any pending debounce timers
    // when component unmounts
    useEffect(() => {
        return () => clearTimeout(debounceTimer.current);
    }, []);

    // FILTER CHECKBOX CHANGE
    // Field UI changes but data filtering does not
    const handleFilterCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newCategoryFields = [...categoryFields];
        const catId = Number(e.target.value);
        const objIndex = newCategoryFields.findIndex( (cat) => cat.id == catId );
        newCategoryFields[objIndex].checked = !newCategoryFields[objIndex].checked;

        setCategoryFields(newCategoryFields);
    }

    // FILTER SUBMIT
    const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newSubmittedCategories: number[] = [];
        categoryFields.map( (cat) => {
            if(cat.checked) {
                newSubmittedCategories.push(cat.id);
            }
        });

        // update url & trigger filter effect
        updateUrl(submittedSearchQuery.current, newSubmittedCategories);
    }

    // FILTER CLEAR
    const handleFilterClear = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
        updateUrl(submittedSearchQuery.current, []);
    }

    // QUERY STRING UPDATE
    // update the filters whenever the query string changes
    // all query filtering should flow from here
    useEffect( () => {
        const debug = false;

        let newSearchQuery = '';
        let newSubmittedCategories: number[] = [];
        let newCategoryFields: RecipeCategoryCheckbox[] = [];
        
        if(router.query.query !== undefined) {
            if(typeof router.query.query == 'string') {
                newSearchQuery = router.query.query;
            }
        }

        if( router.query.category !== undefined ) {
            if(typeof router.query.category == 'string') {
                // https://stackoverflow.com/a/21644539/532742
                newSubmittedCategories = router.query.category.split(' ').map(Number);
            }
            
            newCategoryFields = categoryFields.map( (cat) => {
                if( newSubmittedCategories.includes(cat.id) ) {
                    return {
                        ...cat,
                        checked: true
                    }
                }
                return {
                    ...cat,
                    checked: false
                }
            });
        } 
        // if there is no category query string, clear the filters
        else {
            newCategoryFields = categoryFields.map( (cat) => {
                if(cat.checked) {
                    return {
                        ...cat,
                        checked: false
                    }
                }
                return cat;
            });
        }
        
        // arrays are objects and therefore cannot be compared directly
        const categoriesMatch = JSON.stringify(submittedCategories.current) == JSON.stringify(newSubmittedCategories);
        const searchQueriesMatch = newSearchQuery == submittedSearchQuery.current;

        // update search input if filter effect
        // was not triggered by a search input change
        // direct URL navigation, back/forward button click, etc.
        if(!searchIsChanging.current && !searchQueriesMatch) {
            debug && console.log('search input updated');
            setSearchField(newSearchQuery);
        }        

        // update checkbox inputs 
        if(!categoriesMatch) {
            debug && console.log('category fields updated');
            setCategoryFields(newCategoryFields);
        }
        
        // update query filters
        if( !searchQueriesMatch || !categoriesMatch ) {
            debug && console.log('query filters updated');
            submittedSearchQuery.current = newSearchQuery;
            submittedCategories.current = newSubmittedCategories;

            setFilterParams({
                searchQuery: submittedSearchQuery.current,
                categories: submittedCategories.current
            });
        }

        // reset change listener
        searchIsChanging.current = false;
        
    },[router.query]);

    return (
        <LayoutGlobal 
            title={ templateProps.title }
        >
            <DynamicListingFilters 
                searchField={searchField} 
                handleSearch={handleSearch} 
                categoryFields={categoryFields}
                setCategoryFields={setCategoryFields}
                handleFilterCheckboxChange={handleFilterCheckboxChange}
                handleFilterSubmit={handleFilterSubmit}
                handleFilterClear={handleFilterClear}
            />

            <SectionGroup>
                <SectionWrap>
                    <Section>
                        <LayoutGrid>
                            <Col>                                
                                { renderEntries() }   
                            </Col>  

                            <Col>
                                { renderPager() }
                            </Col>
                        </LayoutGrid>                        
                    </Section>
                </SectionWrap>
            </SectionGroup>
        </LayoutGlobal>
    )
}

// prefetch the initial data and generate it
// server-side so it loads by default before
// being hydrated client-side
export async function getStaticProps() {
    const queryClient = new QueryClient();

    await queryClient.prefetchInfiniteQuery(getInfiniteQueryOptions());  

    return {
        props: {
            dehydratedState: dehydrate(queryClient)
        },
        revalidate: 60 * 60 * 24
    };
}