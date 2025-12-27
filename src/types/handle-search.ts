import { MutableRefObject } from 'react';

export default interface HandleSearch {
    setSearchInputValue: (value: string) => void;
    router: any;
    submittedCategories: () => number[] | undefined;
};