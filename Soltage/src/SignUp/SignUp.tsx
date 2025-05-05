import { FormProvider, useForm, SubmitHandler } from 'react-hook-form';
import { logo, close } from "../assets/images";
import InputField from '../Components/InputField';
import Button from '../Components/Button';
import { useState, useEffect } from 'react';
import { SIGNUP } from '../graphql/mutation';
import { useMutation } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';
import './SignUp.scss';
import { updateMFAPreference } from 'aws-amplify/auth';
import { signIn, setUpTOTP, verifyTOTPSetup } from "aws-amplify/auth";
import { CircularProgress, Dialog, DialogActions } from '@mui/material';
import QRCode from 'react-qr-code';
import ToastMessage from '../Components/ToastMessage';

type FormData = {
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  ConfirmPassword: string;
  Department: string;
};

export const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [otpAuthUrl, setOtpAuthUrl] = useState('');
  const [user, setUser] = useState<any>(null);
  const [mfaCode, setMfaCode] = useState('');

  const [userSignUp] = useMutation(SIGNUP);

  const methods = useForm<FormData>({
    defaultValues: {
      Email: "",
      Password: "",
      FirstName: "",
      LastName: "",
      ConfirmPassword: "",
      Department: "",
    },
    mode: "onChange",
  });

  const { handleSubmit, setValue } = methods;

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const userEncoded = query.get('user');

    if (userEncoded) {
      try {
        const decoded = atob(userEncoded);
        const parsed = JSON.parse(decoded);

        setValue('FirstName', parsed.firstName || '');
        setValue('LastName', parsed.lastName || '');
        setValue('Email', parsed.emailId || '');
        setValue('Department', parsed.role || '');
      } catch (error) {
        console.error("Failed to decode user token:", error);
      }
    }
  }, [location.search, setValue]);

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    setLoading(true);
    try {
      await userSignUp({
        variables: {
          UserSignupInput: {
            firstName: values.FirstName,
            lastName: values.LastName,
            emailId: values.Email,
            password: values.Password,
          },
        },
      });

      const signedInUser = await signIn({
        username: values.Email,
        password: values.Password,
      });

      setUser(signedInUser);

      const totpSetupDetails = await setUpTOTP();
      const otpUrl = totpSetupDetails.getSetupUri(
        import.meta.env.VITE_SOLTAGE_AUTHENTICATOR_APP_NAME,
        values.Email
      );
      console.log(otpUrl.toString())
      setOtpAuthUrl(otpUrl.toString());
      setShowMFA(true);
    } catch (error) {
      console.error('Signup Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMfaVerify = async () => {
    try {
      await verifyTOTPSetup({ code: mfaCode });
      await updateMFAPreference({
        totp: 'PREFERRED',
        sms: 'DISABLED',
      });

      ToastMessage({message:"MFA Setup Successful!",toastType:'success'});
      setShowMFA(false);
      localStorage.clear();
      navigate('/signin');
    } catch (err) {
      ToastMessage({message:"Invalid MFA code. Try again." , toastType:'error'})
      console.error("MFA Verify Failed:", err);
    }
  };

  return (
    <div className="signup_page">
      <div className="signup_content">
        <h1>Welcome to the Soltage Nexus</h1>
        <h1>Management Platform</h1>
        <p>The Nexus platform provides a central point of connection and collaboration for Soltage's portfolio of projects.</p>
      </div>
      <div className="signup_container">
        {loading && <div className="loader"><CircularProgress color="inherit" /></div>}
        <div className="signup_sub-container">
          <img src={logo} alt="Soltage Logo" className='soltage' />
          <h1>Welcome, Sign Up</h1>
          <p className="content">Please create your Soltage Nexus log in credentials by providing the details below</p>
          <FormProvider {...methods}>
            <form className='fields' onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <div className="names">
                  <div className='field'>
                    <label>First Name <span>*</span></label><br />
                    <InputField name="FirstName" type="text" placeholder="Enter first name" className="firstname" />
                  </div>
                  <div className='field'>
                    <label>Last Name <span>*</span></label><br />
                    <InputField name="LastName" type="text" placeholder="Enter last name" className="lastname" />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Email<span>*</span></label><br />
                <InputField name="Email" type="text" placeholder="Enter email" className="email" readOnly />
              </div>
              <div className="form-group">
                <label>Password<span>*</span></label><br />
                <InputField name="Password" type="password" placeholder="Enter password" className="password" />
              </div>
              <div className="form-group">
                <label>Confirm Password<span>*</span></label><br />
                <InputField name="ConfirmPassword" type="password" placeholder="Re-Type password" className="confirmpassword" />
              </div>
              <div className="form-group">
                <label>Department<span>*</span></label><br />
                <InputField name="Department" type="text" placeholder="Enter department" className="department" readOnly />
              </div>
              <Button className="signup-btn" action="Sign Up" type="submit" disabled={loading} />
            </form>
          </FormProvider>
        </div>

        <Dialog open={showMFA}>
          <div className="mfa_setup">
            <img src={close} alt="close"  onClick={() => setShowMFA(false)} />
            <h2>Setup Google Authenticator</h2>
            {otpAuthUrl && (
              <QRCode value={otpAuthUrl} size={200}  />
            )}
            <p>Scan the QR code using Google Authenticator app and enter the 6-digit code below.</p>
            <input
              type="text"
              placeholder="Enter MFA Code"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
            />
            <div className="mfa_buttons">
              <DialogActions>
                <Button action='Discard' className='discard-btn' onClick={() => setShowMFA(false)} />
                <Button onClick={handleMfaVerify} className="verify-btn" action="Add MFA" />
              </DialogActions>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};
