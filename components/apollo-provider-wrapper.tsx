import {ApolloClient, ApolloProvider, from, HttpLink, InMemoryCache, split} from "@apollo/client";
import {getOperationAST} from "graphql/utilities";
import {PropsWithChildren, useMemo} from "react";
import {Maybe} from "graphql/jsutils/Maybe";
import {OperationDefinitionNode} from "graphql/language";
import {SSELink} from "./sse-link";


const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL
});

const sseLink = new SSELink({
    url: process.env.NEXT_PUBLIC_GRAPHQL_URL
});

const isSubscription = (def: Maybe<OperationDefinitionNode>) => {
    return def?.operation === "subscription";

}

export const ApolloProviderWrapper = ({ children }: PropsWithChildren) => {
    const client = useMemo(() => {
        return new ApolloClient({
            link: from([
                split(
                    ({ query, operationName, variables }) =>
                        isSubscription(getOperationAST(query, operationName)),
                    sseLink,
                    httpLink
                ),
            ]),
            cache: new InMemoryCache(),
        });
    }, []);

    return <ApolloProvider client={client}>{children}</ApolloProvider>;
};