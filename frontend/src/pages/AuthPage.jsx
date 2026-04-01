import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Tab, Tabs } from '@mui/material';
import api from '../api/api';

const AuthPage = ({ onLogin }) => {
  const [tab, setTab] = useState(0); // 0=Login, 1=Signup
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = tab === 0 ? '/auth/login' : '/auth/register';
    try {
      const res = await api.post(url, formData);
      onLogin(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '90vh' }}>
      <Paper elevation={0} className="glass" sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 4 }}>
        <Typography variant="h4" fontWeight="bold" align="center" color="primary" gutterBottom>
          TaskPlanet Social
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
          {tab === 0 ? 'Welcome back! Please login.' : 'Create an account to join the feed.'}
        </Typography>
        
        <Tabs value={tab} onChange={(e, val) => { setTab(val); setError(''); }} variant="fullWidth" sx={{ mb: 3 }}>
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>

        {error && <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center' }}>{error}</Typography>}

        <form onSubmit={handleSubmit}>
          {tab === 1 && (
            <TextField
              fullWidth
              label="Username"
              name="username"
              margin="normal"
              value={formData.username}
              onChange={handleChange}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          )}
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2, borderRadius: '12px', py: 1.5, textTransform: 'none', fontWeight: 'bold' }}
          >
            {loading ? 'Processing...' : tab === 0 ? 'Log In' : 'Sign Up'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AuthPage;
