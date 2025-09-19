import { globalConfig } from '@/global-config';
import { ApolloClient, createHttpLink } from '@apollo/client';
import queryCache from '@/data/query-cache';

const queryClient = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
        uri: globalConfig.apiBaseUrl + '/index.php?action=graphql/api',
        headers: {
            Authorization: 'Bearer pans53AxqtxHjZTjtAa4yzVBnR2km28c'
        },
    }),
    cache: queryCache
});

export default queryClient;