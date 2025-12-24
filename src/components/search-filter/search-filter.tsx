import styles from "./search-filter.module.scss";

interface SearchFilter {
    searchInputValue?: string;
    handleSearchSubmit: (e: React.FormEvent) => void;
    handleSearchChange: (e: React.FormEvent) => void;
}

function SearchFilter({
    searchInputValue,
    handleSearchSubmit,
    handleSearchChange,
}: SearchFilter) {
    return (
        <form
            role="search"
            className={styles["search-filter"]}
            onSubmit={(e) => handleSearchSubmit(e)}
        >
            <input
                type="search"
                name="q"
                value={searchInputValue}
                onChange={(e) => handleSearchChange(e)}
            />
        </form>
    );
}

export default SearchFilter;
