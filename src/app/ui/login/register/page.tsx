'use client';

import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter(); 
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [touched, setTouched] = useState({ username: false, password: false });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (field: 'username' | 'password') => {
    setTouched({ ...touched, [field]: true });
  };

  const isPasswordValid = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
  const isFormValid = formData.username && formData.password && isPasswordValid;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    try {
      const res = await fetch('/api/login/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        alert('Registered successfully! Redirecting to login...');
        router.push('/ui/login'); // ✅ Redirect to login
      } else {
        alert(result.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      alert('Something went wrong during registration.');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f0f2f5">
      <Paper sx={{ padding: 4, width: 300 }}>
        <Typography align="center" mb={2}>Register</Typography>
        <form onSubmit={handleRegister}>
          <TextField
            label="Username"
            name="username"
            fullWidth
            margin="normal"
            value={formData.username}
            onChange={handleChange}
            onBlur={() => handleBlur('username')}
            error={touched.username && !formData.username}
            helperText={touched.username && !formData.username ? 'Username is required' : ''}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            onBlur={() => handleBlur('password')}
            error={touched.password && (!formData.password || !isPasswordValid)}
            helperText={
              touched.password && !formData.password
                ? 'Password is required'
                : touched.password && !isPasswordValid
                ? 'Password must contain a special character'
                : ''
            }
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={!isFormValid}
          >
            Register
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
