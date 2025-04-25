import { gql } from "@apollo/client";

export const CREATE_USER = gql`
    mutation CreateUser($createUserInput: createUserInput!) {
    createUser(createUserInput: $createUserInput) {
        userCreated
        __typename
    }
    }
`;

export const DEACTIVATE_USER = gql`
    mutation UpdateUserStatus($updateuserstatusInput: updateUserStatusInput!) {
    updateUserStatus(updateUserStatusInput: $updateuserstatusInput) {
        response
        __typename
    }
}
`   