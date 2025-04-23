import Button from '../../Components/Button'
import plus from '../../assets/images/ic--24--plus-2@2x.png'
import { Dialog, DialogActions } from '@mui/material'
import './UserManagement.scss'
import { useState } from 'react'
import UserIcon from '../../assets/images/user-icon.png'



const UserManagement = () => {
  const [isOpen,setIsOpen] = useState(false)

  const createUser =()  =>{
    return(
      <Dialog open={true}>
        <div className='createuser-container'>
          <div>
            <h1>Create New User</h1>
            <p>Please provide the following details</p>
          </div>
          <div className='profileimage'>
            <img src={UserIcon} alt="" />
          </div>
          <form className='form-fields'>
            <div className='names'>
              <div className="">
                <label htmlFor="">FirstName</label><br />
                <input type="text" />
              </div>
              <div className="">
                <label htmlFor="">FirstName</label><br />
                <input type="text" />
              </div>
            </div>
            <div className='centerfield'>
              <label htmlFor="">FirstName</label><br />
              <input type="text" />
            </div>
            <div className='profile-details'>
              <div className="">
                <label htmlFor="">FirstName</label><br />
                <input type="text" />
              </div>
              <div className="">
                <label htmlFor="">FirstName</label><br />
                <input type="text" />
              </div>
            </div>
            <DialogActions>
              <Button action='Discard'/>
              <Button action='Create User'/>
            </DialogActions>
          </form>
          
        </div>
      </Dialog>
    )
  }
  return (
    <div className="user-management">
      <div className='user-header'>
      <div>
        <h1>User Management</h1>
        <p>Home/<span>User Management</span></p>
      </div>
      <div>
        <Button icon={plus} action="Create New User" className='create-btn' onClick={()=>setIsOpen(!isOpen)}/>
          {isOpen && createUser()}
      </div>
      </div>
      
    </div>
  )
}

export default UserManagement