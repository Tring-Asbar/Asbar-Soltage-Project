import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import {  useLazyQuery } from "@apollo/client";
import {fetchUserAttributes , fetchAuthSession } from "aws-amplify/auth";
import Sidebar from "./Sidebar/Sidebar";
import "./DashboardLayout.scss";
import { GET_USER_BY_EMAIL } from "../../graphql/query";
import { CircularProgress } from "@mui/material";

const DashboardLayout = () => {
  const [userData, setUserData] = useState<any>(null);
  const [getUser, { data, loading, error ,refetch}] = useLazyQuery(GET_USER_BY_EMAIL);

  useEffect(() => {
    const fetchEmailAndUser = async () => {
      try {
        const currentUser = await fetchAuthSession();
        if (!currentUser.tokens?.idToken) {
          return;
        }
        const attributes = await fetchUserAttributes();
        const email = attributes.email;
        if (email) {
          getUser({ variables: { emailId: email } });
          refetch({emailId:email});
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
    return <div className="loader"><CircularProgress color="inherit"/></div>;
  }
  if (error){
    return <div className="error">Failed to load user data</div>;
  } 

  return (
    <div className="dashboard-container">
     <Sidebar user={userData} refetchUser={() => refetch({ email:userData?.emailId})}/>
      <Outlet context={{ user: userData }} />
    </div>
  );
};

export default DashboardLayout;


