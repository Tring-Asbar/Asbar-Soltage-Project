export const config = {
    backend_url: String(import.meta.env.VITE_BACKEND_URL),
    soltage_authenticator_app_name: String(import.meta.env.VITE_SOLTAGE_AUTHENTICATOR_APP_NAME),
};

export const amplifyConfig= {
  aws_project_region: import.meta.env.VITE_REGION,
  aws_cognito_region: import.meta.env.VITE_REGION,
  aws_user_pools_id: import.meta.env.VITE_USER_POOL_ID,
  aws_user_pools_web_client_id: import.meta.env.VITE_CLIENT_ID,
  aws_cognito_identity_pool_id:import.meta.env.VITE_IDENTITY_POOL_ID,
}
