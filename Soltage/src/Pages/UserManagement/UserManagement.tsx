  import React, { useState, useCallback,useRef, useEffect } from 'react';
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
    MenuItem,
    TablePagination,
    AlertColor,  
  } from '@mui/material';
  import InputField from '../../Components/InputField';
  import Button from '../../Components/Button';
  import UserIcon from '../../assets/icons/profilePlaceholder.svg';
  import { debounce } from 'lodash';
  import { plus, filter, close, menu } from '../../assets/images';
  import { CREATE_USER, UPDATE_USER_STATUS , DELETE_USER } from '../../graphql/mutation';
  import { RESEND_INVITE , GET_USERS} from '../../graphql/query';
  import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
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
    const [updateUserStatus] = useMutation(UPDATE_USER_STATUS);
    const [createUser] = useMutation(CREATE_USER);
    const [deleteUserAccount] = useMutation(DELETE_USER)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [resendInviteLink] = useLazyQuery(RESEND_INVITE)
    const [isEditMode, setIsEditMode] = useState(false);

    const [showFilter, setShowFilter] = useState(false);
    const [selectedRole, setSelectedRole] = useState('All Roles');
    const [selectedStatus, setSelectedStatus] = useState('All Status');
   
  
    const { data, loading, error, refetch } = useQuery(GET_USERS, {
      variables: {
        search: '%%',
        roles: ['Admin', 'Executives', 'Standard'],
        statuses: ['PENDING', 'ACTIVE', 'INACTIVE'],
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      },
      fetchPolicy: 'network-only',
    });

    const handleSearch = () => {
      refetch({
        search: searchInput || '%%',
        roles: selectedRole === 'All Roles' ? ['Admin', 'Executives', 'Standard'] : [selectedRole],
        statuses: selectedStatus === 'All Status' ? ['PENDING', 'ACTIVE', 'INACTIVE'] : [selectedStatus],
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      });
    };
  
    const handleReset = () => {
      setSelectedRole('All Roles');
      setSelectedStatus('All Status');
      setShowFilter(false);
      refetch({
        search: searchInput || '%%',
        roles: ['Admin', 'Executives', 'Standard'],
        statuses: ['PENDING', 'ACTIVE', 'INACTIVE'],
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      });
    };
  
    const handleApplyFilter = () => {
      const roles = selectedRole === 'All Roles' ? ['Admin', 'Executives', 'Standard'] : [selectedRole];
      const statuses = selectedStatus === 'All Status' ? ['PENDING', 'ACTIVE', 'INACTIVE'] : [selectedStatus];
      refetch({
        search: searchInput || '%%',
        roles,
        statuses,
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      });
      setShowFilter(false);
    };

    const filterRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
          setShowFilter(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
  
    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  

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
    const [message,setMessage] = useState("");
    const[type,setType] = useState<AlertColor | undefined>();

    const handleCloseSnackbar = () => setSnackbarOpen(false);
    

    const methods = useForm<UserFormData>({
      defaultValues: {
        FirstName: '',
        LastName: '',
        Email: '',
        Phone: '',
        Department: '',
      },
      mode: 'onChange'
    });

    const { handleSubmit, reset } = methods;

    const setIsOpenState = (value: boolean) => {
      setIsOpen(value);
      reset();
      setIsEditMode(false); 
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInput(event.target.value);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLImageElement>, user: any) => {
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
          setMessage(response.createUser.userCreated.message)
          setType("success")
          setIsOpen(false);
          refetch();
        } else {
          console.error('Failed to create user.');
        }
      } catch (err) {
        console.error('Error creating user:', err);
      }
    };

    const menuActions: { [key: string]: () => void } = {
      'Deactivate': async () => {
        try {
          const { data :userStatusDeactive } = await updateUserStatus({
            variables: {
              updateuserstatusInput: {
                userId: selectedUser.id,
                userStatus: 'INACTIVE'
              }
            }
          });
          if (userStatusDeactive?.updateUserStatus?.response) {
            setSnackbarOpen(true)
            setMessage(userStatusDeactive.updateUserStatus.response.message)
            setType("error")
            refetch();
          }
        } catch (err) {
          console.error('Error deactivating user:', err);
        }
      },

      'Activate User': async () => {
        try {
          const { data:userStatusActive } = await updateUserStatus({
            variables: {
              updateuserstatusInput: {
                userId: selectedUser.id,
                userStatus: 'ACTIVE'
              }
            }
          });
          if (userStatusActive?.updateUserStatus?.response) {
            setSnackbarOpen(true)
            setMessage(userStatusActive.updateUserStatus.response.message)
            setType("success")
            refetch();
          }
        } catch (err) {
          console.error('Error activating user:', err);
        }
      },

      'Delete': async () => {
        try{
          const {data : deleteUser} = await deleteUserAccount({
            variables:{
              deleteUserInput:{
                userId:selectedUser.id
              }
            }
          });
          if(deleteUser?.deleteUserAccount?.response){
            setSnackbarOpen(true)
            setMessage(deleteUser.deleteUserAccount.response.message)
            setType("success")
            refetch();
          }
          
        }
        catch(err){
          console.error("Error Deleting User:",err);
        }
      },

      'Resend Invite': async() => {
        try {
          const { data : resendInvite } = await resendInviteLink({
            variables: {
              resendInviteLinkInput: {
                emailId: selectedUser.emailId,
              }
            }
          });
          if (resendInvite?.resendInviteLink?.response) {
            setSnackbarOpen(true)
            setMessage(resendInvite.resendInviteLink.response.message)
            setType("success")
            refetch();
          }
        } catch (err) {
          console.error('Error sending mail:', err);
        }
      },

      'Edit': () => {
        if (selectedUser) {
          setIsOpenState(true);
          setIsEditMode(true);
          reset({
            FirstName: selectedUser.firstName || '',
            LastName: selectedUser.lastName || '',
            Email: selectedUser.emailId || '',
            Phone: selectedUser.phoneNumber || '',
            Department: selectedUser.department || '',
          });
        }
      },

      'Reset MFA': () => {
        console.log('Resetting MFA for', selectedUser);
      }
    };

    const handleMenuItemClick = (option: string) => {
      handleMenuClose();
      const action = menuActions[option];
      if (action) {
        action();
      } else {
        console.warn('No action mapped for', option);
      }
    };

    if (loading){ 
      return <div>Loading...</div>
    }
    if (error){ 
      return <div>Error loading users!</div>
    }

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
                <h1>{isEditMode ? 'Edit User' : 'Create New User'}</h1>
                <p>{isEditMode?"Please verify the below details and edit as necessary":"Please provide the following details"}</p>
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
                    name='Department'
                    className='department'
                    options={['Admin', 'Executives', 'Standard']}
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
                    <Button action={isEditMode ? 'Update User' : 'Create User'} className='create' type='submit' />
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
              <Button icon={filter} action='Filter' className='filter' onClick={() => setShowFilter(!showFilter)} />
            </div>
          </div>

          {showFilter && (
            <div className="filter-container" ref={filterRef}>
              <h3>Filter</h3>
              <div className="filter-fields">
                <div className="form-group">
                  <label>Roles</label>
                  <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                    <option>All Roles</option>
                    <option>Admin</option>
                    <option>Executives</option>
                    <option>Standard</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Active Status</label>
                  <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                    <option>All Status</option>
                    <option>ACTIVE</option>
                    <option>PENDING</option>
                    <option>INACTIVE</option>
                  </select>
                </div>
              </div>
              <div className="filter-buttons">
                <Button action="Reset" className="reset" onClick={handleReset} />
                <Button action="Apply" className="apply" onClick={handleApplyFilter} />
              </div>
            </div>
          )}

          <div className='allUsers'>
            <TableContainer className='table-container'>
              <Table stickyHeader>
                <TableHead className='table-head'>
                  <TableRow >
                    <TableCell className='table-header-cell'>First Name</TableCell>
                    <TableCell className='table-header-cell'>Last Name</TableCell>
                    <TableCell className='table-header-cell'>Email</TableCell>
                    <TableCell className='table-header-cell'>Department</TableCell>
                    <TableCell className='table-header-cell'>Status</TableCell>
                    <TableCell className='table-header-cell'></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className='table-body'>
                  {data?.users?.map((user: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className='table-cell'>{user.firstName || '-'}</TableCell>
                      <TableCell className='table-cell'>{user.lastName || '-'}</TableCell>
                      <TableCell className='table-cell'>{user.emailId}</TableCell>
                      <TableCell className='table-cell'>{user.department}</TableCell>
                      <TableCell className='table-cell'>
                        <div className={user.status === 'PENDING' ? 'pending' : user.status === 'ACTIVE' ? 'active' : 'inactive'}>
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
            
          </div>
          <TablePagination
              className='pagination-left'
              rowsPerPageOptions={[10,20,30]}
              component="div"
              count={data?.totalUsers?.aggregate?.count ?? 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          {selectedUser &&
            getMenuOptions(selectedUser.status).map((option: string, index: number) => (
              <MenuItem key={index} onClick={() => handleMenuItemClick(option)}>
                {option}
              </MenuItem>
            ))}
        </Menu>

        <CustomSnackbar
          open={snackbarOpen}
          message={message}
          severity={type}
          onClose={handleCloseSnackbar}
        />
      </div>
    );
  };

  export default UserManagement;
