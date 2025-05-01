import { useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { signIn } from "aws-amplify/auth";
import InputField from "../Components/InputField";
import Button from "../Components/Button";
import {logo} from "../assets/images";
import CustomSnackbar from "../Components/CustomSnackbar";
import { CircularProgress } from "@mui/material";
import "./SignIn.scss";

type FormData = {
  Email: string;
  Password: string;
};

const SignIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleOpen = () => {
    setSnackbarOpen(true);
  };

  const handleClose = () => {
    setSnackbarOpen(false);
  };

  const methods = useForm<FormData>({
    defaultValues: {
      Email: "",
      Password: "",
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    
  } = methods;

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    setLoading(true);
    const { Email, Password } = values;
    try {
      await signIn({
        username: Email,
        password: Password,
      });
      navigate("/dashboard");
    } catch (err) {
      handleOpen();
    } finally {
      setLoading(false);
    }
  };
  

  return (
   
    <div className="login_page">
      
      <div className="login_content">
        <h1>Welcome to the Soltage Nexus</h1>
        <h1>Management Platform</h1>
        <p>The Nexus platform provides a central point of connection and collaboration for Soltage's portfolio of projects.</p>
      </div>
      <div className="login_container">
        {loading?<div className="loader"><CircularProgress color="inherit"/></div>:<></>}
        <div className="login_sub-container">
          
          <img src={logo} alt="Soltage Logo"  className="soltage"/>
          <h1>It’s good to have you back!</h1>
          <p className="content">Please login into this platform using your Soltage Nexus credentials</p>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="fields">
              <div className="form-group">
                <label>Email <span>*</span></label>
                <InputField
                  name="Email"
                  type="text"
                  placeholder="Enter email"
                  className="email"
                  readOnly={loading}
                />
              </div>

              <div className="form-group">
                <label>Password <span>*</span></label>
                <InputField
                  name="Password"
                  type="password"
                  placeholder="Enter password"
                  className="password"
                  readOnly={loading}
                />
              </div>

              <div className="forgot-password">
                <div className="fg">Forgot Password</div>
              </div>

              <Button className="signin-btn" action="Sign In" type="submit" disabled={loading} />
            </form>
          </FormProvider>
        </div>
      </div>
      <CustomSnackbar
        open={snackbarOpen}
        message="Incorrect username or password"
        severity="error"
        onClose={handleClose}
      />
    </div>
    
  );
};

export default SignIn;
