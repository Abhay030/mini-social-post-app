import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardActions, CardMedia, Avatar, Typography, IconButton, Box, Collapse, TextField, Divider, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import api from '../api/api';

const PostItem = ({ post, user, onUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  const isLiked = post.likes.includes(user?.username);

  const handleLike = async () => {
    try {
      const resp = await api.post(`/posts/${post._id}/like`);
      onUpdate(resp.data);
    } catch (e) {
      console.error('Error toggling like', e);
    }
  };

  const handleComment = async () => {
    if (!commentText) return;
    try {
      const resp = await api.post(`/posts/${post._id}/comment`, { text: commentText });
      onUpdate(resp.data);
      setCommentText('');
    } catch (e) {
      console.error('Error commenting', e);
    }
  };

  return (
    <Card className="glass" sx={{ mb: 4, borderRadius: 4, overflow: 'hidden' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 'bold' }}>
            {post.author.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={<Typography fontWeight="700" variant="body1" color="text.primary">{post.author}</Typography>}
        subheader={
          <Typography variant="caption" color="text.secondary" fontWeight="500">
            {new Date(post.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
          </Typography>
        }
      />
      
      {post.text && (
        <CardContent sx={{ pt: 0, pb: 1 }}>
          <Typography variant="body1">{post.text}</Typography>
        </CardContent>
      )}

      {post.image && (
        <CardMedia
          component="img"
          image={post.image}
          alt="Post attachment"
          sx={{ maxHeight: 400, objectFit: 'contain', bgcolor: '#f1f5f9' }}
        />
      )}

      <CardActions disableSpacing sx={{ px: 2, pt: 1, pb: 1 }}>
        <IconButton 
          onClick={handleLike} 
          sx={{ 
            color: isLiked ? 'secondary.main' : 'text.secondary',
            transition: 'transform 0.2s',
            '&:active': { transform: 'scale(0.8)' }
          }}
        >
          {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography variant="body2" sx={{ mr: 2, fontWeight: 'medium' }}>
          {post.likes.length}
        </Typography>

        <IconButton onClick={() => setExpanded(!expanded)} sx={{ color: 'text.secondary' }}>
          <ChatBubbleOutlineIcon />
        </IconButton>
        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
          {post.comments.length}
        </Typography>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.4)' }}>
          {post.comments.map((c, i) => (
            <Box key={i} sx={{ mb: 1.5 }}>
              <Typography variant="body2" fontWeight="bold">{c.username}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ bgcolor: 'rgba(255,255,255,0.7)', p: 1, borderRadius: 2, mt: 0.5 }}>
                {c.text}
              </Typography>
            </Box>
          ))}
          <Box sx={{ display: 'flex', mt: 2 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Write a comment..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              sx={{ mr: 1, '& .MuiOutlinedInput-root': { borderRadius: 8, bgcolor: 'rgba(255,255,255,0.8)' } }}
            />
            <Button 
              variant="contained" 
              color="primary"
              disabled={!commentText} 
              sx={{ borderRadius: 8, px: 3, boxShadow: 0 }} 
              onClick={handleComment}
            >
              Post
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
};

export default PostItem;
