import { useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { signIn, confirmSignIn } from "aws-amplify/auth";
import InputField from "../Components/InputField";
import Button from "../Components/Button";
import { logo , close } from "../assets/images";
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import "./SignIn.scss";
import ToastMessage from "../Components/ToastMessage";

type FormData = {
  Email: string;
  Password: string;
};

const SignIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mfaDialogOpen, setMfaDialogOpen] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [userSession, setUserSession] = useState<any>(null);


  const methods = useForm<FormData>({
    defaultValues: {
      Email: "",
      Password: "",
    },
    mode: "onChange",
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    setLoading(true);
    const { Email, Password } = values;
    try {
      const {nextStep}= await signIn({
        username: Email,
        password: Password,
      });
      if (
        nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE' ||
        nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE' ||
        nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE'
      ) {
        setUserSession(nextStep)
        setMfaDialogOpen(true);
      }
    
    } catch (err) {
      console.log("cffdjd")
      ToastMessage({message:'Incorrect username or password',toastType:'error'})
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async () => {

    if (!mfaCode) {
      return;
    }
    setLoading(true);
    try {
      await confirmSignIn({
        challengeResponse: mfaCode,
      });
      
      setMfaDialogOpen(false);
      ToastMessage({message:'Signin successful!',toastType:'success'})
      navigate("/dashboard");
    } catch (error) {
      ToastMessage({message:"Incorrect MFA Code",toastType:'error'})
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
        {loading && <div className="loader"><CircularProgress color="inherit" /></div>}
        <div className="login_sub-container">
          <img src={logo} alt="Soltage Logo" className="soltage" />
          <h1>It’s good to have you back!</h1>
          <p className="content">Please login into this platform using your Soltage Nexus credentials</p>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="fields">
              <div className="form-group">
                <label>Email <span>*</span></label>
                <InputField name="Email" type="text" placeholder="Enter email" className="email" readOnly={loading} />
              </div>

              <div className="form-group">
                <label>Password <span>*</span></label>
                <InputField name="Password" type="password" placeholder="Enter password" className="password" readOnly={loading} />
              </div>

              <div className="forgot-password">
                <div className="fg">Forgot Password</div>
              </div>

              <Button className="signin-btn" action="Sign In" type="submit" disabled={loading} />
            </form>
          </FormProvider>
        </div>
      </div>

      <Dialog className="mfa-dialog" open={mfaDialogOpen} onClose={() => setMfaDialogOpen(false)}>
        <img src={close} alt="closeicon" onClick={()=>setMfaDialogOpen(false)}/>
        <h1>Multi-factor Authentication</h1>
        <p>Check Your Mobile Device Use Authenticator App to approve the request to Log Into the Soltage Nexus System</p>
        
        <DialogContent>
          <label>Enter an MFA code to complete sign-in.</label>
          <input
            name="MFA"
            type="text"
            placeholder="Enter code"
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
        <Button className="discard" action="Discard" onClick={() => setMfaDialogOpen(false)}/>
        <Button className="verify" action="Verify" onClick={() => handleMfaSubmit()} />
        
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default SignIn;
