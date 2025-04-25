import { gql } from "@apollo/client";

export const GET_USER_BY_EMAIL = gql`
  query GetUserByEmail($emailId: String!) {
    users(where: { u_email_id: { _eq: $emailId }, u_deleted_at: { _is_null: true } }) {
      userId: u_id
      emailId: u_email_id
      cognitoId: u_cognito_id
      department: u_department
      firstName: u_first_name
      lastName: u_last_name
      userStatus: u_status
      userRole: u_role
      phoneNumber: u_phone_number
      profileImage: u_profile_image
      __typename
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers($search: String = "%%", $roles: [String!], $statuses: [USER_STATUS_ENUM_enum!], $limit: Int, $offset: Int) {
    users(
      where: {_or: [{u_first_name: {_ilike: $search}}, {u_last_name: {_ilike: $search}}], u_department: {_in: $roles}, u_status: {_in: $statuses}, u_deleted_at: {_is_null: true}}
      order_by: {u_first_name: asc}
      limit: $limit
      offset: $offset
    ) {
      id: u_id
      firstName: u_first_name
      lastName: u_last_name
      emailId: u_email_id
      status: u_status
      role: u_role
      department: u_department
      empId: u_emp_id
      profileImage: u_profile_image
      phoneNumber: u_phone_number
      __typename
    }
    totalUsers: users_aggregate(
      where: {_or: [{u_first_name: {_ilike: $search}}, {u_last_name: {_ilike: $search}}], u_department: {_in: $roles}, u_status: {_in: $statuses}, u_deleted_at: {_is_null: true}}
    ) {
      aggregate {
        count
        __typename
      }
      __typename
    }
  }
`;

export const RESEND_INVITE = gql`
  query ResendInviteLink($resendInviteLinkInput: resendInviteLinkInput!) {
    resendInviteLink(resendInviteLinkInput: $resendInviteLinkInput) {
      response
      __typename
    }
  }
`;