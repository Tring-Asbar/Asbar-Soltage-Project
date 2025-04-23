import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar/Sidebar"

const DashboardLayout = () => {
  return (
    <div className="dashboard-container">
        <div>
            <Sidebar/>
        </div>
        <div>
            <Outlet/>
        </div>
    </div>
  )
}

export default DashboardLayout