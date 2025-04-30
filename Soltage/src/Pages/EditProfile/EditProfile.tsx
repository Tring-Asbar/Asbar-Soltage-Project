import './EditProfile.scss'
import ChangePasswordSidebar from '../ChangePassword/ChangePasswordSidebar'
import { Avatar } from '../../assets/images'
import  Button  from '../../Components/Button'
import { Edit } from '../../assets/images'
import { DialogActions } from '@mui/material'
import { useEffect,useState } from 'react'
import { useForm , FormProvider, SubmitHandler} from 'react-hook-form'
import { useOutletContext } from 'react-router-dom'
import InputField from '../../Components/InputField'
import { UPDATE_PROFILE } from '../../graphql/mutation'
import { useMutation } from '@apollo/client'
import { AlertColor } from '@mui/material'
import CustomSnackbar from '../../Components/CustomSnackbar'

type FormData = {
  FirstName:string
  LastName:string 
  Phone:string
  Email:string
}

type OutletContextType = {
  user: any; 
};

const EditProfile = () => {

  const { user } = useOutletContext<OutletContextType>();

  const [update_users] = useMutation(UPDATE_PROFILE)

  const [snackbarOpen, setSnackbarOpen] = useState(false);
      const [message,setMessage] = useState("");
      const[type,setType] = useState<AlertColor | undefined>();
      
      const[isEditing,setIsEditing] = useState(false)
      const handleCloseSnackbar = () => setSnackbarOpen(false);
  

  const methods = useForm<FormData>({
      defaultValues:{
        FirstName:user?.firstName,
        LastName:user?.lastName,
        Phone:user?.phoneNumber,
        Email:user?.emailId
      },
      mode :'onChange'
  })

  const {
    handleSubmit,reset
  } = methods;

  useEffect(() => {
    if (user) {
      reset({
        FirstName: user.firstName || '',
        LastName: user.lastName || '',
        Phone: user.phoneNumber || '',
        Email: user.emailId || ''
      });
    }
  }, [user, reset]);

  

  const onSubmit:SubmitHandler<FormData> = async(values) =>{
    try{
      const {data} = await update_users({
        variables:{
          userId:user?.userId,
          UserInputs:{
            u_first_name:values.FirstName,
            u_last_name:values.LastName,
            u_email_id:values.Email,
            u_phone_number:values.Phone,
            u_department:user?.department,
            u_status:user?.userStatus
          }
        }
      })
      if(data?.update_users){
        setSnackbarOpen(true);
        setMessage("Profile updated successfully")
        setType("success")
        reset()
        
      }
    }
    catch(err){
      console.error("Error Updating User",err);
      reset()
    }
    setIsEditing(false)
  }

  return (
    <div className="edit-profile">
        <ChangePasswordSidebar/>
      <div className='edit-content'>
         <div className='edit-bg'>
          <div className='profile'>
            <img src={Avatar} alt=""/>
            <h3>{user?.firstName} {user?.lastName}</h3>
            <p>{user?.department}</p>
          </div>
         </div>
         <div className='edit-field'>
          <div></div>
          <FormProvider {...methods}>
            <form className='edit-form' onSubmit={handleSubmit(onSubmit)}>
              <div className='row'>
                <div className='fields'>
                  <label>First Name</label><br />
                  <InputField type="text" className='field' name='FirstName' placeholder='Enter first name' readOnly = {!isEditing}/>
                </div>
                <div className='fields'>
                  <label>Last Name</label><br />
                  <InputField type="text" className='field' name='LastName' placeholder='Enter last name'readOnly = {!isEditing}/>
                </div>
              </div>
              <div className='row'>
                <div className='fields'>
                  <label>Email</label><br />
                  <InputField type="text" className='field' name='Email' placeholder='Enter email' readOnly/>
                </div>
                <div className='fields'>
                  <label>Phone</label><br />
                  <InputField type="text" className='field' name='Phone' placeholder='Enter phone number' readOnly = {!isEditing}/>
                </div>
              </div>
              <DialogActions>
                <Button icon={Edit} type="button" className={isEditing?'disabled':'edit'} onClick={() => setIsEditing(true)}  disabled={isEditing} action="Edit Profile"/>
                <Button  action="Discard" onClick={()=>setIsEditing(false)} className={isEditing?'discard':'disabled'}  disabled={!isEditing}/>
                <Button type="submit" className={isEditing?'edit':'disabled'}  disabled={!isEditing} action="Save Changes"/>
               
              </DialogActions>
            </form>
          </FormProvider>
         </div>
      </div>
      <CustomSnackbar
          open={snackbarOpen}
          message={message}
          severity={type}
          onClose={handleCloseSnackbar}
        />
    </div>
  )
}

export default EditProfile

