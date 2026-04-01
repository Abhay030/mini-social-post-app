import React, { useState, useRef } from 'react';
import { Box, Paper, TextField, IconButton, Button, Avatar, Typography, LinearProgress } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import api from '../api/api';

const CreatePost = ({ user, onPostCreated }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async () => {
    if (!text && !image) return;
    setLoading(true);

    try {
      const resp = await api.post('/posts', { text, image });
      setText('');
      setImage(null);
      onPostCreated(resp.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper className="glass" sx={{ p: 3, mb: 4, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
      {loading && <LinearProgress color="secondary" sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'secondary.main' }}>{user?.username?.charAt(0).toUpperCase()}</Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <TextField
            multiline
            fullWidth
            placeholder="What's on your mind?"
            variant="standard"
            value={text}
            onChange={(e) => setText(e.target.value)}
            InputProps={{ disableUnderline: true, style: { fontSize: '1.15rem', lineHeight: 1.5 } }}
          />
          {image && (
            <Box sx={{ mt: 2, position: 'relative', display: 'inline-block' }}>
              <img src={image} alt="preview" style={{ maxHeight: 200, borderRadius: 12, objectFit: 'cover' }} />
              <IconButton 
                size="small" 
                onClick={() => setImage(null)}
                sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, borderTop: '1px solid rgba(0,0,0,0.05)', pt: 1 }}>
        <Box>
          <input
            accept="image/*"
            type="file"
            id="icon-button-file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
          <IconButton color="primary" component="span" onClick={() => fileInputRef.current.click()}>
            <PhotoCameraIcon />
          </IconButton>
        </Box>
        <Button 
          variant="contained" 
          color="primary"
          endIcon={<SendIcon />}
          sx={{ borderRadius: 8, fontWeight: 'bold', px: 3, py: 1, boxShadow: 2, transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}
          onClick={handlePost}
          disabled={loading || (!text && !image)}
        >
          Post
        </Button>
      </Box>
    </Paper>
  );
};

export default CreatePost;
