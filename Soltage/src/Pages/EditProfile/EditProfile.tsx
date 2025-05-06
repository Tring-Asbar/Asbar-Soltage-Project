import './EditProfile.scss'
import ChangePasswordSidebar from '../ChangePassword/ChangePasswordSidebar'
import  Button  from '../../Components/Button'
import { Edit } from '../../assets/images'
import { useEffect,useState } from 'react'
import { useForm , FormProvider, SubmitHandler} from 'react-hook-form'
import { useOutletContext } from 'react-router-dom'
import InputField from '../../Components/InputField'
import { UPDATE_PROFILE } from '../../graphql/mutation'
import { PRESIGNED_URL } from '../../graphql/query'
import { useLazyQuery, useMutation} from '@apollo/client'
import {  DialogActions } from '@mui/material'
import images from '../../assets/icons'
import moment from 'moment'
import ToastMessage from '../../Components/ToastMessage'

type FormData = {
  FirstName:string
  LastName:string 
  Phone:string
  Email:string
  ProfileImage:string
}

type OutletContextType = {
  user: any;
  refetch :()=>void 
};

const EditProfile = () => {
  const {UserIcon} = images

  const { user ,refetch} = useOutletContext<OutletContextType>();

  const [update_users] = useMutation(UPDATE_PROFILE)
  const[getUploadSignedUrl] = useLazyQuery(PRESIGNED_URL)

  const [profileImage,setProfileImage] = useState<string>(UserIcon)
  const[isEditing,setIsEditing] = useState(false)
  

  const methods = useForm<FormData>({
      defaultValues:{
        FirstName:user?.firstName,
        LastName:user?.lastName,
        Phone:user?.phoneNumber,
        Email:user?.emailId,
        ProfileImage:profileImage
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
        Email: user.emailId || '',
      });
      setProfileImage(user?.profileImage || UserIcon)
    }
  }, [user, reset]);


  const handleUploadtoS3 = async (file: File, setImageURL: (url: string) => void) => {
    try {
      const originalName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
      const sanitizedFileName = originalName.replace(/ /g, '_');
      const lastDotIndex = file.name.lastIndexOf('.');
      const extension = lastDotIndex !== -1 ? file.name.slice(lastDotIndex) : '';
  
      const newFileName = `s3://soltage-media-dev/images/${sanitizedFileName}-${moment().unix()}${extension}`;
      console.log(newFileName)
  
      const { data } = await getUploadSignedUrl({
         variables: { 
            key: newFileName,
            bucketName:import.meta.env.VITE_BUCKET_NAME
        } 
      });
  
      const preSignedUrl = data?.getUploadSignedUrl?.preSignedUrl;
      console.log(preSignedUrl)
      if (!preSignedUrl){
        throw new Error("Failed to get presigned URL");
      }
  
      const uploadRes = await fetch(preSignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type
        },
        body: file,
      });
  
      if (uploadRes.ok) {
        const uploadedURL = `${import.meta.env.VITE_FRONTEND_URL}${newFileName}`;
        setImageURL(uploadedURL);
        console.log(uploadedURL) 
        
      } else {
        throw new Error("Upload to S3 failed");
      }
    } catch (err) {
      console.error("Image upload failed", err);
    }
  };


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_SIZE = 3 * 1024 * 1024
    const  file = e.target.files?.[0];
    
    const imageType = ['image/jpeg', 'image/png','image/svg', 'image/jpg']
    if (file) {
      if(file.size>MAX_SIZE){
        ToastMessage({message:"File size upto 3 MB",toastType:'error'})
      }
      else if(!imageType.includes(file.type)){
        ToastMessage({message:'Image should be in .jpg,.jpeg,.png or .svg',toastType:'error'})
      }
      else{
        handleUploadtoS3(file, setProfileImage);
      }
   } 
  };

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
            u_status:user?.userStatus,
            u_profile_image:profileImage
          }
        }
      })
      
      if(data?.update_users){
        ToastMessage({message:"Profile updated successfully",toastType:'success'})
        refetch()
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
      <div className='edit-layout'>
      <div className='edit-content'>
         <div className='edit-bg'>
          <div className='profile'>
            <div className='upload-img'>
            <img src={profileImage} alt='User' className='profile-placeholder' onClick={() =>{isEditing && document.getElementById("fileInput")?.click()} } />
            </div>
            <h3>{user?.firstName} {user?.lastName}</h3>
            <p>{user?.department}</p>
          </div>
         </div>
         <div className='edit-field'>
          <div></div>
          <FormProvider {...methods}>
            <form className='edit-form' onSubmit={handleSubmit(onSubmit)}>
            <InputField id='fileInput' name='ProfileImage' type="file" accept='image/*' className='image-file'onChange={handleImageUpload} />
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
      </div>
      
    </div>
  )
}

export default EditProfile
