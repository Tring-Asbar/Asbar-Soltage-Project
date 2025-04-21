export const config = {
    backend_url: String(import.meta.env.BACKEND_URL),
    soltage_authenticator_app_name: String(import.meta.env.SOLTAGE_AUTHENTICATOR_APP_NAME),
    amplifyConfig: {
      aws_project_region: import.meta.env.REGION,
      aws_cognito_region: import.meta.env.REGION,
      aws_user_pools_id: import.meta.env.USER_POOL_ID,
      aws_user_pools_web_client_id: import.meta.env.CLIENT_ID,
    },
  };