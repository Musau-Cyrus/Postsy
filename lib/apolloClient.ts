import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const httpLink = createHttpLink({
    uri: 'https://social-media-project-9u8u.onrender.com/graphql/',
});

const authLink = setContext(async (_, {headers}) => {
    const token = await AsyncStorage.getItem('authToken');

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
            'Content-Type' : 'application/json',
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore',
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
    }
}); 

export default client;