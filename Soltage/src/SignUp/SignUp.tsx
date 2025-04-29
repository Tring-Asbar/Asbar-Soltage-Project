import { FormProvider, useForm , SubmitHandler} from 'react-hook-form';
import {logo} from "../assets/images";
import InputField from '../Components/InputField';
import Button from '../Components/Button';
import { useState , useEffect } from 'react';
import { SIGNUP } from '../graphql/mutation';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useNavigate , useParams } from 'react-router-dom';
import './SignUp.scss'
import { GET_USER_STATUS } from '../graphql/query';

type FormData = {
  FirstName: string
  LastName:string
  Email:string
  Password: string
  ConfirmPassword:string
  Department:string
};

export const SignUp = () => {
  const navigate = useNavigate()
   const [loading, setLoading] = useState(false);
   const [userSignUp] = useMutation(SIGNUP);
   const { token } = useParams();
   const [userStatus] = useLazyQuery(GET_USER_STATUS)

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
  const {handleSubmit,setValue} = methods;

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const { data } = await userStatus({
            variables: { emailId: token },
            fetchPolicy: 'network-only', 
          });
          
          if (data?.userStatus) {
            const { firstName, lastName, emailId, department } = data.userStatus;
            setValue('FirstName', firstName || '');
            setValue('LastName', lastName || '');
            setValue('Email', emailId || '');
            setValue('Department', department || '');
          }
        } catch (error) {
          console.error('Error fetching user status:', error);
        }
      }
    };

    fetchUserData();
  }, [token, userStatus, setValue]);

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    setLoading(true);
    try {
      const { data } = await userSignUp({
        variables: {
          UserSignupInput: {
            firstName: values.FirstName,
            lastName: values.LastName,
            emailId: values.Email,
            password: values.Password,
          },
        },
      });
      console.log('Signup Success:', data);
      navigate('/dashboard')
    } catch (error) {
      console.error('Signup Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup_page">
      <div className="signup_content">
        <h1>Welcome to the Soltage Nexus</h1>
        <h1>Mangement Platform</h1>
        <p>The Nexus platform provides a central point of connection and collaboration for Soltage's portfolio of projects.</p>
      </div>
      <div className="signup_container">
      <div className="signup_sub-container">
          <img src={logo} alt="Soltage Logo" />
          <h1>Welcome, Sign Up</h1>
          <p className="content">Please create your Soltage Nexus log in credentials by providing the details below</p>
          <FormProvider {...methods}>
            <form className='fields' onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <div className="names">
                  <div className='field'>
                  <label>First Name <span>*</span></label><br />
                  <InputField
                    name="FirstName"
                    type="text"
                    placeholder="Enter first name"
                    className="firstname"
                  />
                  </div>
                  <div className='field'>
                  <label>Last Name <span>*</span></label><br />
                  <InputField
                    name="LastName"
                    type="text"
                    placeholder="Enter last name"
                    className="lastname"
                  />
                  </div>
                </div>
              </div>
              <div className="form-group">
              <label>Email<span>*</span></label><br />
                <InputField
                  name="Email"
                  type="text"
                  placeholder="Enter email"
                  className="email"
                />
              </div>
              <div className="form-group">
              <label>Password<span>*</span></label><br />
                <InputField
                  name="Password"
                  type="password"
                  placeholder="Enter password"
                  className="password"
                />
              </div>
              <div className="form-group">
              <label>Confirm Password<span>*</span></label><br />
                <InputField
                  name="ConfirmPassword"
                  type="password"
                  placeholder="Re-Type password"
                  className="confirmpassword"
                />
              </div>
              <div className="form-group">
              <label>Department<span>*</span></label><br />
                <InputField
                  name="Department"
                  type="text"
                  placeholder="Enter department"
                  className="department"
                />
              </div>
                <Button className="signup-btn" action="Sign Up" type="submit" disabled={loading}/>
              
            </form>
          </FormProvider>
      </div>
      </div>
    </div>
  )
}
