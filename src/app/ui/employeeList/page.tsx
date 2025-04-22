'use client';

import { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Avatar, Box,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Paper
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useRouter } from 'next/navigation';
import Loader from '@/app/ui/loader/loader'; 


type Employee = {
  Id: number;
  Name: string;
  Email: string;
  Department: string;
  Phone: string;
};

export default function EmployeeList() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [employees, setEmployeesData] = useState<Employee[]>([]);
  const [updateEmployee, setUpdateEmployee] = useState(false);
  const [editingEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [employeeFormData, setEmployeeFormData] = useState({
    name: '',
    email: '',
    department: '',
    phone: '',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    department: '',
    phone: '',
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [username, setUsername] = useState('');
  const [confirmLogoutDialog, setConfirmLogoutDialog] = useState(false);

  // Get employee list and username from localstorage
  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) setUsername(storedUser);
    setLoading(true);
    fetch('/api/employeeList')
      .then((res) => res.json())
      .then((data) => setEmployeesData(data))
      .finally(() => setLoading(false));
  }, []);

  const addNewEmployee = () => {
    setEditEmployee(null);
    setEmployeeFormData({ name: '', email: '', department: '', phone: '' });
    setFormErrors({ name: '', email: '', department: '', phone: '' });
    setUpdateEmployee(true);
  };

  const editEmployee = (employee: Employee) => {
    setEditEmployee(employee);
    setEmployeeFormData({
      name: employee.Name,
      email: employee.Email,
      department: employee.Department,
      phone: employee.Phone,
    });
    setFormErrors({ name: '', email: '', department: '', phone: '' });
    setUpdateEmployee(true);
  };

  const saveEmployee = async () => {
    const errors = {
      name: employeeFormData.name ? '' : 'Name is required',
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employeeFormData.email) ? '' : 'Invalid email format',
      department: employeeFormData.department ? '' : 'Department is required',
      phone: /^[0-9]{10}$/.test(employeeFormData.phone) ? '' : 'Phone must be 10 digits',
    };

    setFormErrors(errors);
    const hasError = Object.values(errors).some(err => err);
    if (hasError) {
      return;
    }
    const method = editingEmployee ? 'PUT' : 'POST';
    const payload = editingEmployee
      ? { id: editingEmployee.Id, ...employeeFormData }
      : employeeFormData;
      setLoading(true);
    const res = await fetch('/api/employeeList', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const updatedList = await fetch('/api/employeeList').then((res) => res.json());
      setEmployeesData(updatedList);
      setUpdateEmployee(false);
    }
    setLoading(false);
  };

  const deleteEmployee = async (id: number) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    setLoading(true);
    const res = await fetch('/api/employeeList', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      const updatedList = await fetch('/api/employeeList').then((res) => res.json());
      setEmployeesData(updatedList);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeFormData({ ...employeeFormData, [e.target.name]: e.target.value });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  
// Logout 

  const handleLogoutConfirmDialog = () => {
    setConfirmLogoutDialog(true);
    handleMenuClose();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    localStorage.removeItem('username');
    router.push('/ui/login');
  };

  if (loading) {
    return <Loader />; // show spinner while loading
  }
  return (
    <Box>
      <AppBar position="fixed" color="default" sx={{ mb: 2, width: '100%' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">Employee Management</Typography>
          <Button
            startIcon={<Avatar>{username?.[0]?.toUpperCase()}</Avatar>}
            endIcon={<ArrowDropDownIcon />} onClick={handleMenuOpen}> {username}
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleLogoutConfirmDialog}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Dialog open={confirmLogoutDialog} onClose={() => setConfirmLogoutDialog(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmLogoutDialog(false)}>Cancel</Button>
          <Button onClick={logout} color="error" variant="contained">Logout</Button>
        </DialogActions>
      </Dialog>

      <Box p={3}>
        <Box sx={{ marginTop: 8 }}>
          <Button variant="contained" onClick={addNewEmployee}>Add Employee</Button>
        </Box>

        <Paper style={{ flex: 1, width: '100%' }}>
          <DataGrid
            rows={employees.map(emp => ({
              id: emp.Id,
              name: emp.Name,
              email: emp.Email,
              department: emp.Department,
              phone: emp.Phone,
            }))}
            columns={[
              { field: 'name', headerName: 'Name', flex: 1 },
              { field: 'email', headerName: 'Email', flex: 1 },
              { field: 'department', headerName: 'Department', flex: 1 },
              { field: 'phone', headerName: 'Mobile Number', flex: 1 },
              {
                field: 'actions',
                headerName: 'Actions',
                flex: 1,
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                  <>
                    <IconButton color="primary" onClick={() => editEmployee(employees.find(e => e.Id === params.row.id)!)} aria-label="edit">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => deleteEmployee(params.row.id)} aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </>
                ),
              },
            ]}
            initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
            pageSizeOptions={[5, 10, 20]}
          />
        </Paper>

        <Dialog open={updateEmployee} onClose={() => setUpdateEmployee(false)}>
          <DialogTitle>{editingEmployee ? 'Update Employee' : 'Add Employee'}</DialogTitle>
          <DialogContent>
            <TextField label="Name" name="name" fullWidth
              margin="normal" value={employeeFormData.name} onChange={handleChange}
              error={Boolean(formErrors.name)} helperText={formErrors.name}/>
            <TextField label="Email" name="email" fullWidth
              margin="normal" value={employeeFormData.email} onChange={handleChange}
              error={Boolean(formErrors.email)} helperText={formErrors.email}/>
            <TextField label="Department" name="department" fullWidth
              margin="normal" value={employeeFormData.department} onChange={handleChange}
              error={Boolean(formErrors.department)} helperText={formErrors.department}/>
            <TextField label="Mobile Number" name="phone" fullWidth
              margin="normal" value={employeeFormData.phone} onChange={handleChange}
              error={Boolean(formErrors.phone)} helperText={formErrors.phone}/>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUpdateEmployee(false)}>Cancel</Button>
            <Button onClick={saveEmployee} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
