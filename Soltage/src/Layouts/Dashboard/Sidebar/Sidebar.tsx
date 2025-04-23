import { signOut } from "aws-amplify/auth";
import Button from "../../../Components/Button"
import { useState } from "react";
import { useNavigate , Link } from "react-router-dom";
import SoltageLogo from '../../../assets/images/logoimg1@2x.png'
import Logo from '../../../assets/images/shape@2x.png'
import userprofile from '../../../assets/images/userprofile.png'
import Dashboard from '../../../assets/images/dashboardInactive@2x.png'
import ProjectTracking from '../../../assets/images/project-tracking-inactive.png'
import Project from '../../../assets/images/ic--project@2x.png'
import UserManagement from '../../../assets/images/ic--usermanagement@2x.png'
import Notification from '../../../assets/images/notification.png'
import hamburger from '../../../assets/images/hamburger.png'
import './Sidebar.scss'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate()

  const sidebarMenu = [
    { icon:Dashboard,path: '/dashboard', label: 'Dashboard' },
    { icon:ProjectTracking,path: '/project-tracking', label: 'Project Tracking' },
    { icon:UserManagement,path: '/usermanagement', label: 'User Management' },
    { icon:Project,path: '/projects', label: 'Projects' },
    { icon:Notification,path: '/notification', label: 'Notification' },
    { icon:Dashboard,path: '/nys_load', label: 'NYS Load' }
  ];
  const toggleMenu = () => setIsOpen(!isOpen);

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
    <div className="sidebar-container">
      <div className="sidebar-content">
        <div className="sidebar-header">
        <img src={isOpen?SoltageLogo:Logo} alt="" />
        <button 
        className="toggle-btn" 
        onClick={toggleMenu}
        >
        {isOpen ? 'close' : 'open'}
      </button>
        </div>
      
        <div className="sidebar-menu">
          {sidebarMenu.map((menu) => (
            (isOpen?
              <div key={menu.path} className="menu">
                <img src={menu.icon} alt="image"/>
                <Link to={menu.path}>{menu.label}</Link>
              </div>
            :
            <div key={menu.path} className="menu">
              <img src={menu.icon} alt="image"/>
            </div>
              )

          ))}
        </div>
      </div>
      
      <div className="sidebar-footer">
        <img src={userprofile} alt="" />
        <Button action="Logout" onClick={handleLogout}/>
      </div>
      
    </div>
  )
}

export default Sidebar