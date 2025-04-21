import { Navigate} from 'react-router-dom';
import { getAccessTokenFromLocalStorage } from '../main';

type ProtectedRoutesProps = {
    children: React.ReactNode;
  };
  
const ProtectedRoutes:React.FC<ProtectedRoutesProps> = ({children}) => {
    const isAuthenticated = getAccessTokenFromLocalStorage();
  return (
    !isAuthenticated?<Navigate to="/signin" />:children
  )
}

export default ProtectedRoutes