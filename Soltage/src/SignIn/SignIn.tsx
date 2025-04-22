import { useForm } from "react-hook-form"
import InputField from "../Components/InputField"

type FormData = {
  username:string
  password:string
}

const SignIn = () => {
  const {register}  = useForm({
    defaultValues:{
      username:"",
      password:"",
    },
    mode:'onChange'
  })
  return (
    <InputField inputType="text" name="username"/>
  )
}

export default SignIn