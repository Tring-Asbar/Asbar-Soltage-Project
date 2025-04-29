import { gql } from "@apollo/client";

export const CREATE_USER = gql`
    mutation CreateUser($createUserInput: createUserInput!) {
    createUser(createUserInput: $createUserInput) {
        userCreated
        __typename
    }
    }
`;

export const UPDATE_USER_STATUS = gql`
    mutation UpdateUserStatus($updateuserstatusInput: updateUserStatusInput!) {
    updateUserStatus(updateUserStatusInput: $updateuserstatusInput) {
        response
        __typename
    }
}
`;

export const SIGNUP = gql`
    mutation UserSignUp($UserSignupInput: userSignupInput!) {
        userSignUp(userSignupInput: $UserSignupInput) {
            userCreated
            __typename
        }
    }
`;

export const CHANGE_PASSWORD = gql`
    mutation ChangeUserPassword($userInputs: ChangePasswordInput!) {
        changeUserPassword(ChangePasswordInput: $userInputs) {
            response
            __typename
        }
    }
`;
