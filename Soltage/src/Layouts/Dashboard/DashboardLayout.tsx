import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar/Sidebar"
import './DashboardLayout.scss'

const DashboardLayout = () => {
  return (
    <div className="dashboard-container">
        
            <Sidebar/>
        
            <Outlet/>
    </div>
  )
}

export default DashboardLayout