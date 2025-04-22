import { signOut } from "aws-amplify/auth";
import Button from "../../../Components/Button"
import { useNavigate } from "react-router-dom";

const Sidebar = () => {

  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut()
      localStorage.clear()
      navigate('/signin');
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      Sidebar
      <Button action="Logout" onClick={handleLogout}/>
    </div>
  )
}

export default Sidebar