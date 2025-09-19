import { NextRouter } from "next/router";

function buildQueryString(
  pageParam?: number, // depreciated
  filterParams?: { 
    searchQuery?: string | undefined, 
    categories?: number[],
}
): string {
  let queryItems: string[] = [];
  let queryString = '';

  // if (filterParams?.page !== undefined) queryItems.push(`page=${filterParams?.page}`); // work in progress
  if (filterParams?.searchQuery) queryItems.push(`query=${filterParams.searchQuery}`);
  if (filterParams?.categories && filterParams.categories.length > 0) {
    queryItems.push('category=' + filterParams.categories.join('+'));
  }

  if (queryItems.length) queryString = '?' + queryItems.join('&');
  return queryString;
}

export default function updateUrl({ 
    sq, 
    cats, 
    router,
}: {
    sq?: string | undefined,
    cats?: number[] | undefined,
    router: NextRouter,
}) {
    const queryString = buildQueryString(
        undefined,
        {
            searchQuery: sq,
            categories: cats,
        }
    )
    
    router.push(queryString, undefined, { scroll: false, shallow: true });
}