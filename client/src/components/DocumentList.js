import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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

const DocumentList = ({ token, isAdmin, onLogout }) => {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [open, setOpen] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [fullContent, setFullContent] = useState('');
  const [error, setError] = useState('');
  const [accessAttempted, setAccessAttempted] = useState(false);

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(response.data);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleAccessSubmit = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/documents/${selectedDoc.id}/access`,
        { password: accessCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFullContent(response.data.content);
      setError('');
      setAccessAttempted(true);
      fetchDocuments(); // Refresh the list after successful access
    } catch (err) {
      setError('Invalid access code');
      setAccessAttempted(true);
    }
  };

  // ... (keep the rest of the component)
};

export default DocumentList;