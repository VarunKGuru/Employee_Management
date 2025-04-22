'use client';

import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function LoginPage() {
  const router = useRouter();
  const [userCredential, setUserCredential] = useState({ username: '', password: '' });
  const [touchedFields, setTouchedFields] = useState({ username: false, password: false });
  const [loader, setLoading] = useState(false);

  // Validation 
  const isUsernameValid = userCredential.username.trim() !== '';
  const isPasswordValid = userCredential.password.trim() !== '';

  // handle changes in username and password
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserCredential({ ...userCredential, [e.target.name]: e.target.value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  const validateForm = () => {
    setTouchedFields({ username: true, password: true });
    return isUsernameValid && isPasswordValid;
  };


  //  validate the user is valid or not
  const handleLogin = async  (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setLoading(true)
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userCredential),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('username', userCredential.username);
        router.push('/ui/employeeList'); 
      } else {
        alert(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f0f2f5">
      <Paper sx={{ padding: 4, width: 300 }}>
        <Typography align="center">
          Login
        </Typography>
        <Typography align="center" variant="body2" mt={2}>
          Don&apos;t have an account?{' '}
        <Link href="/ui/login/register" style={{ color: '#1976d2', textDecoration: 'none' }}>
          Register here
        </Link>
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField label="Username" name="username" fullWidth
            margin="normal" value={userCredential.username} onChange={handleLoginChange} 
            onBlur={handleBlur}
            error={touchedFields.username && !isUsernameValid}
            helperText={
              touchedFields.username && !isUsernameValid ? 'Username is required' : ''
            }
            />
          <TextField label="Password" name="password" fullWidth
            margin="normal" value={userCredential.password} onChange={handleLoginChange} type="password"
            onBlur={handleBlur}
            error={touchedFields.password && !isPasswordValid}
            helperText={
              touchedFields.password && !isPasswordValid ? 'Username is required' : ''
            }/>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} >
            {loader ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </form>

        
      </Paper>
    </Box>
  );
}
