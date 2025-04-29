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
    MenuItem,
    TablePagination,
    AlertColor,  
  } from '@mui/material';
  import InputField from '../../Components/InputField';
  import Button from '../../Components/Button';
  import UserIcon from '../../assets/icons/profilePlaceholder.svg';
  import { debounce } from 'lodash';
  import { plus, filter, close, menu } from '../../assets/images';
  import { CREATE_USER, UPDATE_USER_STATUS } from '../../graphql/mutation';
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
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [resendInviteLink] = useLazyQuery(RESEND_INVITE)
  
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
        console.log('Deleting user', selectedUser);
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
        console.log('Editing user', selectedUser);
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
            <TablePagination
              rowsPerPageOptions={[10,20,30]}
              component="div"
              count={data?.totalUsers ?? 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
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
