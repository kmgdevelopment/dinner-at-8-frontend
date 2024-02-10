import styles from './listing-filters.module.scss';
import SectionWrap from '../layouts/section-wrap/section-wrap';
import Section from '../layouts/section/section';
// both types and components are exported
import SearchFilter from '../search-filter/search-filter';
import CategoryFilters from '../category-filter/category-filters';

export default function ListingFilters({
    searchField,
    handleSearch,
    categoryFields,
    setCategoryFields,
    handleFilterCheckboxChange,
    handleFilterSubmit,
    handleFilterClear
}: SearchFilter & CategoryFilters) {
    return (
        <header className={ styles['listing-filters'] }>
            <SectionWrap>
                <Section>
                    <div className={ styles['filter-component'] }>
                        <SearchFilter 
                            searchField={searchField}
                            handleSearch={handleSearch}
                        />
                    </div>
                </Section>
                <Section contentWrap={false}>
                    <CategoryFilters 
                        categoryFields={categoryFields}
                        setCategoryFields={setCategoryFields}
                        handleFilterCheckboxChange={handleFilterCheckboxChange}
                        handleFilterSubmit={handleFilterSubmit}
                        handleFilterClear={handleFilterClear}
                    />
                </Section>
            </SectionWrap>
        </header>
    )
}