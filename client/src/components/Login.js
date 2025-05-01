import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { API_URL } from '../config';

// ... (keep all the styled components)

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/login`, {
        email,
        password,
      });
      onLogin(response.data.token, response.data.isAdmin);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  // ... (keep the rest of the component)
};

export default Login;