import { MutableRefObject } from 'react';

export default interface HandleSearch {
    setSearchField: (value: string) => void;
    debounceTimer: MutableRefObject<number>;
    searchIsChanging: MutableRefObject<boolean>;
    router: any;
    submittedCategories: () => number[] | undefined;
};