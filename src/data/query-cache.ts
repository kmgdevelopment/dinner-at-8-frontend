import { InMemoryCache } from '@apollo/client';
import { offsetLimitPagination } from "@apollo/client/utilities";

const queryCache = new InMemoryCache({
  typePolicies: {
    Query: {
        fields: {
            entryCount: {
                keyArgs: ['section', 'search', 'relatedTo'],
            },
            entries: {
                // enable infinite scroll pagination
                // https://www.apollographql.com/docs/react/pagination/overview
                ...offsetLimitPagination(['section', 'search', 'relatedTo']),
                merge(existing = [], incoming) {
                    return [...existing, ...incoming];
                },
            }
        }
    }
  }
});

export default queryCache;