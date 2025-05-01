import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  AppBar,
  Toolbar,
  Box,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

// ... (keep all the styled components)

const AdminPanel = ({ token, onLogout }) => {
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    creator_name: '',
    price: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_URL}/api/documents`,
        {
          ...formData,
          price: parseFloat(formData.price)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSuccess(true);
      setError('');
      setFormData({
        name: '',
        content: '',
        creator_name: '',
        price: '',
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to upload document');
      setSuccess(false);
    }
  };

  // ... (keep the rest of the component)
};

export default AdminPanel;