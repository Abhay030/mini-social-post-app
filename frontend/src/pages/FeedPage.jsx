import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, AppBar, Toolbar, CircularProgress } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import CreatePost from '../components/CreatePost';
import PostItem from '../components/PostItem';
import api from '../api/api';

const FeedPage = ({ user, onLogout }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = async (pageNum = 1) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const resp = await api.get(`/posts?page=${pageNum}&limit=5`);
      if (pageNum === 1) {
        setPosts(resp.data.posts);
      } else {
        setPosts(prev => [...prev, ...resp.data.posts]);
      }
      setHasMore(resp.data.hasMore);
    } catch (e) {
      console.error('Failed to fetch posts', e);
    } finally {
      if (pageNum === 1) setLoading(false);
      else setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(prev => prev.map(p => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <Box sx={{ pb: 8 }}>
      <AppBar position="sticky" elevation={0} className="glass" sx={{ color: 'primary.main', mb: 3, top: 16, borderRadius: 4, zIndex: 1100 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 800 }}>
            TaskPlanet Social
          </Typography>
          <Button color="inherit" onClick={onLogout} endIcon={<LogoutIcon />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ width: '100%' }}>
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

        {hasMore && (
           <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 1 }}>
             <Button 
               variant="contained" 
               color="secondary"
               onClick={handleLoadMore} 
               disabled={loadingMore}
               sx={{ borderRadius: 8, px: 4, py: 1.5, fontWeight: 'bold', boxShadow: 3 }}
             >
               {loadingMore ? 'Loading...' : 'Load More'}
             </Button>
           </Box>
        )}
      </Box>
    </Box>
  );
};

export default FeedPage;
