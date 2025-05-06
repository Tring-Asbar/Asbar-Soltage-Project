import Button from '../../Components/Button'
import './ChangePassword.scss'
import { useOutletContext} from 'react-router-dom'
import { FormProvider, useForm , SubmitHandler } from 'react-hook-form'
import InputField from '../../Components/InputField'
import { useMutation } from '@apollo/client'
import { CHANGE_PASSWORD } from '../../graphql/mutation'
import ChangePasswordSidebar from './ChangePasswordSidebar'
import ToastMessage from '../../Components/ToastMessage'

type ChangePasswordProps = {
  OldPassword:string
  Password:string
  ConfirmPassword:string
}
type OutletContextType = {
  user: any; 
};

const ChangePassword = () => {

  const { user } = useOutletContext<OutletContextType>();

  const [changeUserPassword] = useMutation(CHANGE_PASSWORD)

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
        ToastMessage({message:data.changeUserPassword.response.message,toastType:'success'});
        reset()
      }
    }
    catch(err){
      console.error("Change Password Error:",err);
      reset();
    }
  }


  return (
    <div className="change-password">
      <ChangePasswordSidebar/>
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
