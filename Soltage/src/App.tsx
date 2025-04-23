import { Routes,Route} from 'react-router-dom'
import { publicRoutes } from './Routes/PublicRoutes'
import { privateRoutes } from './Routes/PrivateRoutes'
import ProtectedRoutes from './Routes/ProtectedRoutes'
import AuthLayout from './Layouts/Auth/AuthLayout'
import DashboardLayout from './Layouts/Dashboard/DashboardLayout'
import './App.scss'

function App() {

  return (
    <Routes>
      <Route element = {<AuthLayout/>}>
        {publicRoutes.map((route)=>(
          <Route 
          key={route.path}
          path={route.path}
          element = {route.element}
          />
        ))}
      </Route>
      <Route element={<DashboardLayout/>}>
        {privateRoutes.map((route)=>(
          <Route 
          key = {route.path}
          path = {route.path}
          element = 
          {
          <ProtectedRoutes>
            {route.element}
          </ProtectedRoutes>
          }
          />
        ))}
      </Route>
    </Routes>
  )
}

export default App
