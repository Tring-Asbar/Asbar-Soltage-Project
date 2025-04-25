import { signOut } from "aws-amplify/auth";
import Button from "../../../Components/Button";
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import SoltageLogo from "../../../assets/images/logoimg1@2x.png";
import Logo from "../../../assets/images/shape@2x.png";
import {userprofile,Dashboard,ProjectTracking,Project,UserManagement,Notification,hamburger} from "../../../assets/images"; 
import "./Sidebar.scss";

type sidebarProps = {
  user: any;
};

const Sidebar = ({ user }: sidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.clear();
      navigate("/signin");
    } catch (err) {
      console.error(err);
    }
  };

  const sidebarMenu = [
    { icon: Dashboard, path: "/dashboard", label: "Dashboard", roles: ["admin", "user"] },
    { icon: ProjectTracking, path: "/project-tracking", label: "Project Tracking", roles: ["admin", "user"] },
    { icon: UserManagement, path: "/usermanagement", label: "User Management", roles: ["admin"] },
    { icon: Project, path: "/projects", label: "Projects", roles: ["admin", "user"] },
    { icon: Notification, path: "/notification", label: "Notification", roles: ["admin", "user"] },
    { icon: Dashboard, path: "/nys_load", label: "NYS Load", roles: ["admin"] },
    { icon: Dashboard, path: "/changepassword", label: "Change Password", roles: ["admin", "user"] },
  ];

  const filteredMenu = sidebarMenu.filter(menu => menu.roles.includes(user?.userRole));

  return (
    <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
      <div className="sidebar-content">
        <div className={`sidebar-header ${isOpen ? "open" : ""}`}>
          <img src={isOpen ? SoltageLogo : Logo} alt="logo" className="logo" />
          <img onClick={toggleMenu} className="toggle-btn" src={hamburger} alt="hamburger" />
        </div>

        <div className="sidebar-menu">
          {filteredMenu.map((menu) => {
            const isActive = location.pathname === menu.path;

            return isOpen ? (
              <div key={menu.path} className={`menu ${isActive ? "active" : ""}`}>
                <img src={menu.icon} alt="menu icon" />
                <Link to={menu.path}>{menu.label}</Link>
              </div>
            ) : (
              <div key={menu.path} className={`menu ${isActive ? "active" : ""}`}>
                <img src={menu.icon} alt="menu icon" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="sidebar-footer">
        <img src={userprofile} alt="user profile" />
        {isOpen && (
          <>
            <p>{user?.firstName} {user?.lastName}</p>
            <h1>{user?.emailId}</h1>
          </>
        )}
        <Button action="Logout" onClick={handleLogout} />
      </div>
    </div>
  );
};

export default Sidebar;
