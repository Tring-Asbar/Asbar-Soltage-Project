
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import SoltageLogo from "../../../assets/images/logoimg1@2x.png";
import Logo from "../../../assets/images/shape@2x.png";
import { select } from "../../../assets/images";
import {userprofile,Dashboard,ProjectTracking,Project,UserManagement,Notification,hamburger,DashboardActive,ProjectActive,ProjectTrackingActive,NotificationActive,UserManagementActive} from "../../../assets/images"; 
import images from "../../../assets/icons/index";
import "./Sidebar.scss";

type sidebarProps = {
  user: any;
};

const Sidebar = ({ user }: sidebarProps) => {
  const {
    LockActive, 
    LoadActive, 
    Load, 
    Lock
  } = images;
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const sidebarMenu = [
    { icon: Dashboard,activeIcon:DashboardActive, path: "/dashboard", label: "Dashboard", roles: ["admin", "user"] },
    { icon: ProjectTracking,activeIcon:ProjectTrackingActive, path: "/project-tracking", label: "Project Tracking", roles: ["admin", "user"] },
    { icon: UserManagement,activeIcon:UserManagementActive, path: "/usermanagement", label: "User Management", roles: ["admin"] },
    { icon: Project,activeIcon:ProjectActive, path: "/projects", label: "Projects", roles: ["admin", "user"] },
    { icon: Notification,activeIcon:NotificationActive, path: "/notification", label: "Notification", roles: ["admin", "user"] },
    { icon: Load,activeIcon:LoadActive, path: "/nys_load", label: "NYS Load", roles: ["admin"] },
    { icon: Lock,activeIcon:LockActive, path: "/changepassword", label: "Change Password", roles: ["admin", "user"] },
  ];

  const filteredMenu = sidebarMenu.filter(menu => menu.roles.includes(user?.userRole));

  return (
    <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
      <div className="sidebar-content">
        <div className={`sidebar-header ${isOpen ? "open" : ""}`}>
          <img src={isOpen ? SoltageLogo : Logo} alt="logo" className={isOpen?"":"logo"} />
          <img onClick={toggleMenu} className="toggle-btn" src={hamburger} alt="hamburger" />
        </div>

        <div className="sidebar-menu">
          {filteredMenu.map((menu) => {
            const isActive = menu.path.includes(location.pathname);

           return isOpen ? (
              <div key={menu.path} className={`menu ${isActive ? "active" : ""}`} onClick={() => navigate(menu.path)}>
                  <img src={isActive ? menu.activeIcon : menu.icon} alt="menu icon" />
                  <Link to={menu.path}>{menu.label}</Link>                
              </div>
            ) : (
              <div key={menu.path} className={`menu ${isActive ? "active" : ""}`}onClick={() => navigate(menu.path)}>
                {/* <img src={select} alt="select" /> */}
                <img src={isActive ? menu.activeIcon : menu.icon} alt="menu icon" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="footer-left">
          <img src={userprofile} alt="user profile" />
          {isOpen && (
            <>
              <p>{user?.firstName} {user?.lastName}</p>
              <h1>{user?.emailId}</h1>
            </>
          )}
        </div>        
      </div>
    </div>
  );
};

export default Sidebar;
