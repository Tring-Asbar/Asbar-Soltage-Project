import React, { useState, useCallback, useEffect } from 'react';
import {
  useForm,
  FormProvider,
  SubmitHandler
} from 'react-hook-form';
import {
  Dialog,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  MenuItem
} from '@mui/material';
import InputField from '../../Components/InputField';
import Button from '../../Components/Button';
import UserIcon from '../../assets/icons/profilePlaceholder.svg';
import { debounce } from 'lodash';
import { plus, filter, close, menu } from '../../assets/images';
import { CREATE_USER , DEACTIVATE_USER } from '../../graphql/mutation';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USERS } from '../../graphql/query';
import './UserManagement.scss';
import CustomSnackbar from '../../Components/CustomSnackbar';

type UserFormData = {
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Department: string;
};

const UserManagement = () => {
  const [searchInput, setSearchInput] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [updateUserStatus] = useMutation(DEACTIVATE_USER)
  const [createUser] = useMutation(CREATE_USER);
  const { data, refetch } = useQuery(GET_USERS, {
    variables: {
      search: '%%',
      roles: ['Admin', 'Executives', 'Standard'],
      statuses: ['PENDING', 'ACTIVE', 'INACTIVE'],
      limit: 10,
      offset: 0
    }
  });

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      refetch({
        search: value || '%%',
        roles: ['Admin', 'Executives', 'Standard'],
        statuses: ['PENDING', 'ACTIVE', 'INACTIVE'],
        limit: 10,
        offset: 0
      });
    }, 500),
    [refetch]
  );

  useEffect(() => {
    debouncedSearch(searchInput);
  }, [searchInput, debouncedSearch]);

  const [isOpen, setIsOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleClose = () => setSnackbarOpen(false);

  const methods = useForm<UserFormData>({
    defaultValues: {
      FirstName: '',
      LastName: '',
      Email: '',
      Phone: '',
      Department: ''
    },
    mode: 'onChange'
  });

  const { handleSubmit, reset } = methods;

  const setIsOpenState = (value: boolean) => {
    setIsOpen(value);
    reset();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLImageElement>,user: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const getMenuOptions = (status: string) => {
    switch (status) {
      case 'PENDING':
        return ['Resend Invite', 'Edit'];
      case 'ACTIVE':
        return ['Deactivate', 'Edit'];
      case 'INACTIVE':
        return ['Activate User', 'Edit', 'Reset MFA', 'Delete'];
      default:
        return [];
    }
  };

  const onSubmit: SubmitHandler<UserFormData> = async (values) => {
    try {
      const { data: response } = await createUser({
        variables: {
          createUserInput: {
            firstName: values.FirstName,
            lastName: values.LastName,
            email: values.Email,
            phoneNumber: values.Phone,
            department: values.Department
          }
        }
      });

      if (response.createUser.userCreated) {
        setSnackbarOpen(true);
        setIsOpen(false);
      } else {
        console.error('Failed to create user.');
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div className='user-management'>
      <div className='user-header'>
        <div>
          <h1>User Management</h1>
          <p>
            Home/<span>User Management</span>
          </p>
        </div>
        <div>
          <Button
            icon={plus}
            action='Create New User'
            className='create-btn'
            onClick={() => setIsOpenState(true)}
          />
        </div>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpenState(false)}>
        <FormProvider {...methods}>
          <div className='createuser-container'>
            <div className='close-icon'>
              <img src={close} alt='' onClick={() => setIsOpenState(false)} />
            </div>
            <div>
              <h1>Create New User</h1>
              <p>Please provide the following details</p>
            </div>
            <div>
              <img src={UserIcon} alt='User' />
            </div>
            <form className='form-fields' onSubmit={handleSubmit(onSubmit)}>
              <div className='names'>
                <div className='form-group'>
                  <label>First Name *</label>
                  <InputField
                    type='text'
                    name='FirstName'
                    placeholder='Enter first name'
                    className='firstname'
                  />
                </div>
                <div className='form-group'>
                  <label>Last Name *</label>
                  <InputField
                    type='text'
                    name='LastName'
                    placeholder='Enter last name'
                    className='lastname'
                  />
                </div>
              </div>
              <div className='centerfield'>
                <div className='form-group'>
                  <label>Email *</label>
                  <InputField
                    type='email'
                    name='Email'
                    placeholder='Enter email'
                    className='email'
                  />
                </div>
              </div>
              <div className='profile-details'>
                <div className='form-group'>
                  <label>Phone</label>
                  <InputField
                    type='text'
                    name='Phone'
                    placeholder='Enter phone'
                    className='phone'
                  />
                </div>
                <div className='form-group'>
                  <label>Department *</label>
                  <InputField
                    type='text'
                    name='Department'
                    placeholder='Enter department'
                    className='department'
                  />
                </div>
              </div>
              <DialogActions>
                <div className='buttons'>
                  <Button
                    action='Discard'
                    className='discard'
                    type='reset'
                    onClick={() => setIsOpenState(false)}
                  />
                  <Button action='Create User' className='create' type='submit' />
                </div>
              </DialogActions>
            </form>
          </div>
        </FormProvider>
      </Dialog>

      <div className='users-table'>
        <div className='searchFilter'>
          <div>
            <input
              type='text'
              name='search'
              placeholder='Search here'
              className='search'
              value={searchInput}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Button icon={filter} action='Filter' className='filter' />
          </div>
        </div>

        <div className='allUsers'>
          <TableContainer className='table-container'>
            <Table stickyHeader>
              <TableHead className='table-head'>
                <TableRow>
                  <TableCell className='table-header-cell'>First Name</TableCell>
                  <TableCell className='table-header-cell'>Last Name</TableCell>
                  <TableCell className='table-header-cell'>Email</TableCell>
                  <TableCell className='table-header-cell'>Department</TableCell>
                  <TableCell className='table-header-cell'>Status</TableCell>
                  <TableCell className='table-header-cell'></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.users?.map((user: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className='table-cell'>{user.firstName || '-'}</TableCell>
                    <TableCell className='table-cell'>{user.lastName || '-'}</TableCell>
                    <TableCell className='table-cell'>{user.emailId}</TableCell>
                    <TableCell className='table-cell'>{user.department}</TableCell>
                    <TableCell className='table-cell'>
                      <div className={user.status === 'PENDING'? 'pending': user.status === 'ACTIVE'? 'active': 'inactive'} >
                        <div className='statusDot'></div>
                        <span>{user.status.toLowerCase()}</span>
                      </div>
                    </TableCell>
                    <TableCell className='table-cell'>
                      <img
                        src={menu}
                        alt='menu'
                        width={20}
                        onClick={(e) => handleMenuOpen(e, user)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* <div className='table-footer'>
            <div>Rows per page</div>
            <div>pages</div>
          </div> */}
        </div>
      </div>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {selectedUser &&
          getMenuOptions(selectedUser.status).map((option: string, index: number) => (
            <MenuItem
              key={index}
              onClick={async () => {
                handleMenuClose();
                if (option === 'Deactivate') {
                  try {
                    const { data } = await updateUserStatus({
                      variables: {
                        updateuserstatusInput: {
                          userId: selectedUser.id,
                          userStatus: 'INACTIVE'
                        }
                      }
                    });
                    if (data?.updateUserStatus?.response) {
                      console.log('User deactivated successfully');
                      refetch(); 
                    }
                  } catch (error) {
                    console.error('Error updating user status:', error);
                  }
                } else {
                  console.log(`${option} clicked for`, selectedUser);
                }
              }}
            >
              {option}
            </MenuItem>
          ))}
      </Menu>

      <CustomSnackbar
        open={snackbarOpen}
        message='An activation email sent to the user'
        severity='success'
        onClose={handleClose}
      />
    </div>
  );
};

export default UserManagement;
