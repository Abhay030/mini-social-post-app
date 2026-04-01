import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, AppBar, Toolbar, CircularProgress } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import CreatePost from '../components/CreatePost';
import PostItem from '../components/PostItem';
import api from '../api/api';

const FeedPage = ({ user, onLogout }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const resp = await api.get('/posts');
      setPosts(resp.data);
    } catch (e) {
      console.error('Failed to fetch posts', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostUpdate = (updatedPost) => {
    setPosts(prev => prev.map(p => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <Box sx={{ pb: 8 }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', color: 'primary.main', mb: 3, borderRadius: '0 0 16px 16px' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            TaskPlanet Social
          </Typography>
          <Button color="inherit" onClick={onLogout} endIcon={<LogoutIcon />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ px: 2, maxWidth: 600, mx: 'auto' }}>
        <CreatePost user={user} onPostCreated={handlePostCreated} />
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          posts.map(post => (
            <PostItem 
              key={post._id} 
              post={post} 
              user={user} 
              onUpdate={handlePostUpdate} 
            />
          ))
        )}

        {!loading && posts.length === 0 && (
          <Typography textAlign="center" color="text.secondary" sx={{ mt: 5 }}>
            No posts yet. Be the first to share something!
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default FeedPage;
