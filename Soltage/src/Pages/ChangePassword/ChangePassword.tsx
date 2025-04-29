import Button from '../../Components/Button'
import { Logout } from '../../assets/images'
import { signOut } from 'aws-amplify/auth'
import './ChangePassword.scss'
import { Link, useNavigate , useOutletContext} from 'react-router-dom'
import { FormProvider, useForm , SubmitHandler } from 'react-hook-form'
import InputField from '../../Components/InputField'
import { useMutation } from '@apollo/client'
import { CHANGE_PASSWORD } from '../../graphql/mutation'

type ChangePasswordProps = {
  OldPassword:string
  Password:string
  ConfirmPassword:string
}
type OutletContextType = {
  user: any; 
};

const ChangePassword = () => {

  const menus=[
    {path:'/changepassword', label:'Change Password'},
    {path:'/editprofile',label:'Edit Profile'}
  ]

  const { user } = useOutletContext<OutletContextType>();

  const [changeUserPassword] = useMutation(CHANGE_PASSWORD)

  const navigate = useNavigate();
  const methods = useForm<ChangePasswordProps>({
    defaultValues:{
      OldPassword:'',
      Password:'',
      ConfirmPassword:''
    },
    mode :'onChange'
  });

  const {
    handleSubmit,
    reset
  } = methods;

  const onSubmit: SubmitHandler<ChangePasswordProps> = async (values) => {
    try{
      const {data} = await changeUserPassword({
        variables:{
          userInputs:{
            emailId:user.emailId,
            newPassword:values.Password,
            oldPassword:values.OldPassword
          }
        }
      })
      if(data?.changeUserPassword?.response){
        console.log(data.changeUserPassword.response.message);
        reset()
      }
    }
    catch(err){
      console.error("Change Password Error:",err);
      reset();
    }
  }

  const handleLogout = async () => {
      try {
        await signOut();
        localStorage.clear();
        navigate("/signin");
      } catch (err) {
        console.error(err);
      }
    };

  return (
    <div className="change-password">
      <div className='changepassword-sidebar'>
        <div className='content'>
          <div>
          <h1>My Account</h1>
          <p>Home/Account</p>
          </div>
          
          {menus.map((menu)=>(
            <div key={menu.path}>
              <Link to={menu.path}>{menu.label}</Link>
            </div>
          ))}
        </div>
        <div>
          <Button icon={Logout} action="Logout" onClick={handleLogout}  className="logout"/>
        </div>
      </div>
      <div className='change-password-field'>
        <div className='change-password-content'>
          <div>
            <div className="header">
              <h1>Change Password</h1>
              <p>Secure your account by changing the account password</p>
            </div>
          </div>
          <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className='password-field'>
            <div className='form-fields'>
            <div className='form-group'>
              <label>Old Password</label>
              <InputField type="password" className='field' name='OldPassword' placeholder='Enter old password'/>
            </div>
            <div className='form-group'>
              <label>New Password</label>
              <InputField type="password" className='field' name='Password' placeholder='Enter new password'/>
            </div>
            <div className='form-group'>
              <label>Confirm Password</label>
              <InputField type="password" className='field' name='ConfirmPassword' placeholder='Retype new password'/>
            </div>
            </div>
            <div className='buttons'>
              <Button  type='reset'action="Discard" className='discard'/>
              <Button  type='submit'action="Update Password" className='update' />
            </div>
          </form>
          </FormProvider>
        </div>
        
      </div>
    </div>
  )
}

export default ChangePassword
