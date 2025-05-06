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
    CircularProgress 
  } from '@mui/material';
import InputField from '../../Components/InputField';
import Button from '../../Components/Button';
import { debounce} from 'lodash';
import { plus, filter, close, menu , Search } from '../../assets/images';
import { CREATE_USER, UPDATE_USER_STATUS , DELETE_USER , EDIT_USER } from '../../graphql/mutation';
import { RESEND_INVITE , GET_USERS } from '../../graphql/query';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import './UserManagement.scss';
import images from '../../assets/icons';
import { useOutletContext } from 'react-router-dom';
import ToastMessage from '../../Components/ToastMessage';

  type UserFormData = {
    FirstName: string;
    LastName: string;
    Email: string;
    Phone: string;
    Department: string;
  };
  type OutletContextType = {
    user: any; 
  };

  const UserManagement = () => {
    const { user } = useOutletContext<OutletContextType>();
    const {UserIcon , Left, Right , DoubleLeft , DoubleRight , SelectedLeft,SelectedRight,SelectedDoubleLeft , SelectedDoubleRight} = images
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
    const [updateUser] = useMutation(EDIT_USER)
    const [showFilter, setShowFilter] = useState(false);
    const [ id,setId] = useState<string>("")
    const [selectedRole, setSelectedRole] = useState('All Roles');
    const [selectedStatus, setSelectedStatus] = useState('All Status');
    const [appliedRole, setAppliedRole] = useState('All Roles');
    const [appliedStatus, setAppliedStatus] = useState('All Status');

    const { data, loading, error, refetch } = useQuery(GET_USERS, {
      variables: {
        search: '%%',
        roles: ['Admin', 'Executives', 'Standard'],
        statuses: ['PENDING', 'ACTIVE', 'INACTIVE'],
        limit: rowsPerPage,
        offset: 0,
      },
    });

    const handleReset = () => {
      setSelectedRole('All Roles');
      setSelectedStatus('All Status');
      setShowFilter(false);
      refetch({
        search: `%${searchInput}%` || '%%',
        roles: ['Admin', 'Executives', 'Standard'],
        statuses: ['PENDING', 'ACTIVE', 'INACTIVE'],
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      });
    };
  
    const handleApplyFilter = () => {
      setAppliedRole(selectedRole);
      setAppliedStatus(selectedStatus);

      const roles = selectedRole === 'All Roles' ? ['Admin', 'Executives', 'Standard'] : [selectedRole];
      const statuses = selectedStatus === 'All Status' ? ['PENDING', 'ACTIVE', 'INACTIVE'] : [selectedStatus];

      refetch({
        search: `%${searchInput}%` || '%%',
        roles,
        statuses,
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      });
      setPage(0)
      setShowFilter(false);
    };

    useEffect(() => {
      const roles = appliedRole === 'All Roles' ? ['Admin', 'Executives', 'Standard'] : [appliedRole];
      const statuses = appliedStatus === 'All Status' ? ['PENDING', 'ACTIVE', 'INACTIVE'] : [appliedStatus];
    
      refetch({
        search: `%${searchInput}%` || '%%',
        roles,
        statuses,
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      });
    }, [rowsPerPage]);
    

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

    const debouncedSearch = useCallback(
      debounce((value: string) => {
        const roles = appliedRole === 'All Roles' ? ['Admin', 'Executives', 'Standard'] : [appliedRole];
        const statuses = appliedStatus === 'All Status' ? ['PENDING', 'ACTIVE', 'INACTIVE'] : [appliedStatus];
        setPage(0)
        refetch({
          search: `%${value}%` || '%%',
          roles,
          statuses,
          limit: rowsPerPage,
          offset:0
        });
      }, 500),
      [refetch,appliedRole,appliedStatus ]
    );

    useEffect(() => {
      debouncedSearch(searchInput);
    }, [searchInput, debouncedSearch]);

    const [isOpen, setIsOpen] = useState(false);

    
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
      
      if (!value) {
        setSelectedUser(null);
        setIsEditMode(false);
      } 
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
      setSelectedUser(null)
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

    const editUser = async(values:any)=>{
        try{
          const {data:update} = await updateUser({
            variables:{
              updateUserInput:{
                id,
                firstName:values.FirstName,
                lastName:values.LastName,
                email:values.Email,
                phoneNumber:values.Phone,
                department:values.Department,
              }
              
            }
          })
          
          if(update?.updateUser){
            ToastMessage({message:update?.updateUser?.message,toastType:'success'})
            refetch();
            
          }
        }
        catch(err){
          console.error('Error updating user:',err);
        }
        setIsEditMode(false);
        setSelectedUser(null)
        setId('')
      
    }
    
    const onSubmit: SubmitHandler<UserFormData> = async (values) => {
      if(isEditMode){
        editUser(values)
      }
      else{
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
            ToastMessage({message:response.createUser.userCreated.message,toastType:'success'})
            refetch();
          } else {
            console.error('Failed to create user.');
          }
        } catch (err) {
          console.error('Error creating user:', err);
        }
      }
      setIsOpenState(false);
      
    };

    const menuActions: { [key: string]: () => void } = {
      'Deactivate': async () => {
        try {
          const { data :userStatusDeactive } = await updateUserStatus({
            variables: {
              updateuserstatusInput: {
                userId: selectedUser?.id,
                userStatus: 'INACTIVE'
              }
            }
          });
          if (userStatusDeactive?.updateUserStatus?.response) {
            ToastMessage({message:userStatusDeactive.updateUserStatus.response.message,toastType:'error'})
            refetch();
          }
        } catch (err) {
          console.error('Error deactivating user:', err);
        }
        setSelectedUser(null)
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
            
            ToastMessage({message:userStatusActive.updateUserStatus.response.message,toastType:'success'})
            refetch();
          }
        } catch (err) {
          console.error('Error activating user:', err);
        }
        setSelectedUser(null)
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
            ToastMessage({message:deleteUser.deleteUserAccount.response.message,toastType:'success'})
            refetch();
          }
          
        }
        catch(err){
          console.error("Error Deleting User:",err);
        }
        setSelectedUser(null)
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
            ToastMessage({message:resendInvite.resendInviteLink.response.message,toastType:'success'})
            refetch();
          }
        } catch (err) {
          console.error('Error sending mail:', err);
        }
        setSelectedUser(null)
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
          setId(selectedUser.id)
        }
        setSelectedUser(null)
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

    const navigateToStartEnd = (direction:string)=>{
      const roles = appliedRole === 'All Roles' ? ['Admin', 'Executives', 'Standard'] : [appliedRole];
      const statuses = appliedStatus === 'All Status' ? ['PENDING', 'ACTIVE', 'INACTIVE'] : [appliedStatus];
      if(direction==='start'){
        setPage(0)
        refetch({ search: `%${searchInput}%` || '%%', roles, statuses, limit: rowsPerPage, offset: 0 });
      }
      else if (direction === 'end') {
        const totalCount = data?.totalUsers?.aggregate?.count ?? 0;
        const lastPage = Math.max(0, Math.ceil(totalCount / rowsPerPage) - 1);
        setPage(lastPage);
        refetch({
          search: `%${searchInput}%` || '%%',
          roles,
          statuses,
          limit: rowsPerPage,
          offset: lastPage * rowsPerPage,
        });
      }
    }

    const handleChangePage = (direction: string) => {
      const newPage = direction === 'next' ? page + 1 : page - 1;
      const roles = appliedRole === 'All Roles' ? ['Admin', 'Executives', 'Standard'] : [appliedRole];
      const statuses = appliedStatus === 'All Status' ? ['PENDING', 'ACTIVE', 'INACTIVE'] : [appliedStatus];
    
      setPage(newPage);
      refetch({
        search: `%${searchInput}%` || '%%',
        roles,
        statuses,
        limit: rowsPerPage,
        offset: newPage * rowsPerPage,
      });
    };

    
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

        <Dialog className='mfa_dialog'  open={isOpen} onClose={() => setIsOpenState(false)}>
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
                <img src={UserIcon} alt='User' className='profile-placeholder'/>
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
                      readOnly={isEditMode}
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
                    <Button action={isEditMode ? 'Update' : 'Create User'} className='create' type='submit' />
                  </div>
                </DialogActions>
              </form>
            </div>
          </FormProvider>
        </Dialog>

        <div className='users-table'>
          <div className='searchFilter'>
            <div className='search-input'>
              <input
                type='text'
                name='search'
                placeholder='Search here'
                className='search'
                value={searchInput}
                onChange={handleInputChange}
              />
              <img src={Search} alt="search" />
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
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="INACTIVE">Inactive</option>
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
                  {loading && <div className='loader'><CircularProgress color='inherit'/></div>}
                  {data?.totalUsers?.aggregate?.count>0 
                  ?
                  (data?.users?.map((u: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className='table-cell'>{u.firstName || '-'}</TableCell>
                      <TableCell className='table-cell'>{u.lastName || '-'}</TableCell>
                      <TableCell className='table-cell'>{u.emailId}</TableCell>
                      <TableCell className='table-cell'>{u.department}</TableCell>
                      <TableCell className='table-cell'>
                        <div className={u.status === 'PENDING' ? 'pending' : u.status === 'ACTIVE' ? 'active' : 'inactive'}>
                          <div className='statusDot'></div>
                          <span>{u.status.toLowerCase()}</span>
                        </div>
                      </TableCell>
                      <TableCell className='table-cell'>
                        {user?.userId !== u?.id
                        &&
                        <img
                          src={menu}
                          alt='menu'
                          width={20}
                          onClick={(e) => handleMenuOpen(e, u)}
                        />
                       }
                      
                      </TableCell>
                    </TableRow>
                  )))
                  :(
                    <TableRow className='loader error'>No Records Found</TableRow>
                  )}
                  
                </TableBody>
              </Table>
            </TableContainer>
            
          </div>
          <div className='pagination'>
          <div className="rows-per-page">
            <label htmlFor="rowsPerPage">Rows per page </label>
            <select
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(0); 
              }}
            >
            <option value={10}>10 Rows</option>
            <option value={20}>20 Rows</option>
            <option value={30}>30 Rows</option>
            </select>
          </div>
            <div className='pagination-buttons'>
            <Button 
            className='nav-btn' icon={page === 0?DoubleLeft:SelectedDoubleLeft} action='' disabled={page === 0} 
            onClick={()=>navigateToStartEnd('start')}/>

            <Button 
            className='nav-btn' icon={page===0?Left:SelectedLeft} action='' disabled={page === 0}
            onClick={() => handleChangePage('previous')} />

            <p>
              <span>{`${ data?.totalUsers?.aggregate?.count>0?(page * rowsPerPage) + 1 : 0} - ${Math.min((page * rowsPerPage) + rowsPerPage, data?.totalUsers?.aggregate?.count ?? 0)}`} </span> 
              of {data?.totalUsers?.aggregate?.count ?? 0}
            </p>

            <Button 
            className='nav-btn' icon={data?.users?.length < rowsPerPage?Right:SelectedRight} action='' disabled={data?.users?.length < rowsPerPage}  
            onClick={() => handleChangePage('next')} />

            <Button className='nav-btn' icon={data?.users?.length < rowsPerPage?DoubleRight:SelectedDoubleRight} action='' disabled={data?.users?.length < rowsPerPage} 
            onClick={()=>navigateToStartEnd('end')}/>

            </div>
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

       
      </div>
    );
  };

  export default UserManagement;
