import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import Button from '../../Components/Button';
import { Logout, Profile, Lock } from '../../assets/images';
import {hamburger} from '../../assets/images'
import './ChangePasswordSidebar.scss'

const ChangePasswordSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menus = [
    { icon: Lock, path: '/changepassword', label: 'Change Password' },
    { icon: Profile, path: '/changepassword/editprofile', label: 'Profile' },
  ];

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.clear();
      navigate("/signin");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className='menu-toggle' onClick={() => setIsOpen(!isOpen)}>
        <img src={hamburger} alt=""/>
      </div>

      <div className={`changepassword-sidebar ${isOpen ? 'open' : ''}`}>
        <div className='content'>
          <div className='header'>
            <h1>My Account</h1>
            <p>Home/Account</p>
          </div>
          <div className='menu-items'>
            {menus.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <div key={menu.path} className={`menu ${isActive ? "active" : ""}`}>
                  <img src={menu.icon} alt='menu' />
                  <Link to={menu.path} onClick={() => setIsOpen(false)}>{menu.label}</Link>
                </div>
              )
            })}
          </div>
        </div>
        <div>
          <Button icon={Logout} action="Logout" onClick={handleLogout} className="logout" />
        </div>
      </div>
    </>
  );
}

export default ChangePasswordSidebar;
