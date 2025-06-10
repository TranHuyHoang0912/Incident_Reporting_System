import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axiosClient.post('/auth/login', {
        user_email: email,
        password: password,
      });
      localStorage.setItem('token', res.data.access_token);
      navigate('/incidents');
    } catch (err) {
      alert('Đăng nhập thất bại!');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={10}>
        <Typography variant="h5">Đăng Nhập</Typography>
        <TextField fullWidth label="Email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField fullWidth label="Mật khẩu" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button fullWidth variant="contained" color="primary" onClick={handleLogin}>Đăng nhập</Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
