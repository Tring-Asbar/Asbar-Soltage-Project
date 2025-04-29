import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import {  useLazyQuery } from "@apollo/client";
import { fetchUserAttributes } from "aws-amplify/auth";
import Sidebar from "./Sidebar/Sidebar";
import "./DashboardLayout.scss";
import { GET_USER_BY_EMAIL } from "../../graphql/query";

const DashboardLayout = () => {
  const [userData, setUserData] = useState(null);
  const [getUser, { data, loading, error }] = useLazyQuery(GET_USER_BY_EMAIL);

  useEffect(() => {
    const fetchEmailAndUser = async () => {
      try {
        const attributes = await fetchUserAttributes();
        const email = attributes.email;
        if (email) {
          getUser({ variables: { emailId: email } });
        }
      } catch (err) {
        console.error("Failed to get user email from Cognito:", err);
      }
    };

    fetchEmailAndUser();
  }, [getUser]);

  useEffect(() => {
    if (data?.users?.[0]) {
      setUserData(data.users[0]);
    }
  }, [data]);

  if (loading){
    return <div className="loader">Loading dashboard...</div>;
  }
  if (error){
    return <div className="error">Failed to load user data</div>;
  } 

  return (
    <div className="dashboard-container">
      <Sidebar user={userData} />
      <Outlet context={{ user: userData }} />
    </div>
  );
};

export default DashboardLayout;
