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

export const DELETE_USER = gql`
    mutation DeleteUserAccount($deleteUserInput: DeleteUserInput!) {
        deleteUserAccount(DeleteUserInput: $deleteUserInput) {
            response   
            __typename  
        }
    }
`;

export const EDIT_USER = gql`
    mutation UpdateUser($updateUserInput: updateUserInput!) {
        updateUser(updateUserInput: $updateUserInput) {
            status
            message
            __typename
        }
    }
`;

export const UPDATE_PROFILE = gql`
 mutation UpdateUser ($UserInputs: users_set_input!, $userId: uuid) {
  update_users(where: {u_id:{_eq:$userId},u_deleted_at:{_is_null:true}}, _set: $UserInputs) {
    affected_rows
    returning {
      emailId: u_email_id
      firstName: u_first_name
      userId: u_id
      lastName: u_last_name
      phoneNumber: u_phone_number
      profileImage: u_profile_image
      department: u_department
      userStatus: u_status
    }
  }
}
`;
