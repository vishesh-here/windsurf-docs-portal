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

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(to bottom, #ffffff 0%, #f7f7f7 100%)',
  borderRadius: '16px',
  boxShadow: '0 10px 20px rgba(0,0,0,0.1), 0 6px 6px rgba(0,0,0,0.1)',
  border: '1px solid rgba(255,255,255,0.8)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(to right, #4f95ff, #2d7eff)',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.8)',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      background: 'rgba(255,255,255,0.9)',
    },
    '&.Mui-focused': {
      background: '#ffffff',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), 0 0 0 3px rgba(79,149,255,0.2)',
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0,0,0,0.1)',
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(to bottom, #4f95ff 0%, #2d7eff 100%)',
  borderRadius: '10px',
  padding: '12px',
  color: 'white',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 500,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    background: 'linear-gradient(to bottom, #3d85ff 0%, #1b6eff 100%)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(1px)',
    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
  }
}));

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        email,
        password,
      });
      onLogin(response.data.token, response.data.isAdmin);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <StyledPaper elevation={0} sx={{ p: 4, width: '100%' }}>
          <Typography 
            component="h1" 
            variant="h4" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 600,
              background: 'linear-gradient(45deg, #1a1a1a 30%, #4a4a4a 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Document Portal
          </Typography>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                borderRadius: '8px',
                border: '1px solid rgba(211, 47, 47, 0.3)',
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <StyledTextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <StyledTextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <StyledButton
              type="submit"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </StyledButton>
            
            <Typography 
              variant="body2" 
              align="center"
              sx={{
                color: 'text.secondary',
                p: 2,
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.03)',
                border: '1px solid rgba(0,0,0,0.1)',
              }}
            >
              Demo Credentials:
              <br />
              User: user@example.com / user123
              <br />
              Admin: admin@example.com / admin123
            </Typography>
          </Box>
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default Login;