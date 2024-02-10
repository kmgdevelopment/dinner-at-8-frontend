import styles from './search-filter.module.scss';

interface SearchFilter {
    searchField?: string;
    handleSearch: (e: React.FormEvent) => void;
}

function SearchFilter({searchField, handleSearch}: SearchFilter) {
    // we don't bother with a submit button since 
    // search won't work without JS enabled anyway
    return (
        <form 
            role="search" 
            className={ styles['search-filter'] }
            onSubmit={ (e) => handleSearch(e) }
        >
            <input 
                type="search" 
                name="q" 
                value={ searchField }
                onChange={ (e) => handleSearch(e) }
            />
        </form>
    );
}

export default SearchFilter;