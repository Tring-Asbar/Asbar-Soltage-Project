import { useForm } from "react-hook-form"
import InputField from "../Components/InputField"
import './SignIn.scss'
import logo from '../assets/images/SoltageLogo.png'
import Button from "../Components/Button"
import { signIn } from "aws-amplify/auth"
import { useNavigate } from "react-router-dom"
import { useState } from "react"


type FormData = {
  Email:string
  Password:string
}
const fields: {
  id: string;
  name: keyof FormData;
  className: string;
  placeholder: string;
  type: string;
  validation: any;
}[] = [
  {
    id: 'email',
    name: 'Email',
    className: 'email',
    placeholder: 'Enter email',
    type: 'text',
    validation: {
      required: 'Email is required',
    }
  },
  {
    id: 'password',
    name: 'Password',
    className: 'password',
    placeholder: 'Enter password',
    type: 'password',
    validation: {
      required: 'Password is required',
    }
  }
];

const SignIn = () => {
  const navigate = useNavigate()
  const [loading,setLoading] = useState(false)

  const {register,handleSubmit,formState:{errors}}  = useForm<FormData>({
    defaultValues:{
      Email:"",
      Password:"",
    },
    mode:'onChange'
  })

  const onSubmit= async(values:FormData)=>{
    setLoading(true)
    const {Email,Password} = values;
    try{
       const user = await signIn({
        username:Email,
        password:Password
      })
      console.log(values)
      console.log(user)
      navigate('/dashboard')
    }
    catch(err){
      console.error(err);
    }
    setLoading(false)
  }

  return (
    <div className="login_page">
      <div className="login_content">
        <h1>Welcome to the Soltage Nexus</h1>
        <h1>Mangement Platform</h1>
        <p>The Nexus platform provides a central point of connection and collaboration for Soltage's portfolio of projects.</p>
      </div>
      <div className="login_container">
        <div className="login_sub-container">
          <img src={logo} alt="" />
          <h1>It’s good to have you back!</h1>
          <p className="content">Please login into this platform using your Soltage Nexus credentials</p>
          <form onSubmit={handleSubmit(onSubmit)} className="fields">
        {fields.map((input) => (
          <div key={input.id} className='form-group'>
            <label>{input.name}<span> *</span></label><br />
            <InputField
              className={input.className}
              placeholder={input.placeholder}
              type={input.type}
              {...register(input.name, input.validation)}
            />
            {errors[input.name] && (
              <p className="error">
                {errors[input.name]?.message}
              </p>
            )}
          </div>
        ))}
          <div className="forgot-password">
            <div className="fg">Forgot Password</div>
          </div>
          <div>
            <Button className="signin-btn" action='Sign In' disabled={loading}/>
          </div>
          </form>
        </div>
      </div>

    </div>
  )
}

export default SignIn