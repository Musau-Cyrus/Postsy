import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
    mutation RegisterUser(
        $firstName: String!, 
        $lastName: String!, 
        $email: String!, 
        $username: String!, 
        $password: String!
    ) {
        registerUser(
            firstName: $firstName, 
            lastName: $lastName, 
            email: $email, 
            username: $username, 
            password: $password
        ) {
            token
            user {
                id
                firstName
                lastName
                email
                username
            }
        }
    }
`;

export const LOGIN_USER = gql`
    mutation LoginUser($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            token
            user {
                id
                username
                email
            }
        }
    }
`;

export const GOOGLE_AUTH = gql`
    mutation GoogleAuth($token: String!) {
        googleAuth(token: $token) {
            token
            user {
                id
                username
                email
            }
        }
    }
`;

export const FACEBOOK_AUTH = gql`
    mutation FacebookAuth($token: String!) {
        facebookAuth(token: $token) {
            token
            user {
                id
                username
                email
            }
        }
    }
`;