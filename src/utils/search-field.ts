import HandleSearch from "@/types/handle-search";
import updateUrl from "./update-url";

// SEARCH INPUT CHANGE
export function handleSearchFactory({
    setSearchField,
    debounceTimer,
    searchIsChanging,
    router,
    submittedCategories,
}: HandleSearch) {
    return function handleSearch(e: React.FormEvent) {
        if (e.type == "change") {
            // every time the input changes, reset the debounce timer
            clearTimeout(debounceTimer.current);

            // tell query string update effect not to
            // update input field value
            searchIsChanging.current = true;

            // https://bobbyhadz.com/blog/typescript-property-value-not-exist-type-eventtarget
            const target = e.target as HTMLInputElement;

            // update input value
            // should always run immediately
            setSearchField(target.value);

            // if the search input hasn't been changed in 500ms
            // refetch the query with the new filter parameters
            debounceTimer.current = window.setTimeout(() => {
                updateUrl({
                    sq: target.value,
                    cats: submittedCategories(),
                    router: router,
                });
            }, 500);
        } else if (e.type == "submit") {
            // we're ignoring submit since onchange
            // handles everything for us already
            e.preventDefault();
        }
    };
}
