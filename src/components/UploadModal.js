import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const UploadModal = ({ open, handleClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Entertainment');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [account, setAccount] = useState('');

  const categories = [
    'Entertainment',
    'Education',
    'Music',
    'Gaming',
    'Technology',
    'Sports',
    'News',
    'Comedy',
    'Other'
  ];

  // محاكاة اتصال المحفظة
  const connectWallet = async () => {
    try {
      // محاكاة اتصال MetaMask
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // عنوان محفظة وهمي
      const fakeAccount = '0x' + Math.random().toString(16).substring(2, 42);
      setAccount(fakeAccount);
      setSuccess('Wallet connected successfully! (Demo Mode)');
    } catch (error) {
      setError('Failed to connect wallet: ' + error.message);
    }
  };

  // محاكاة تحميل الفيديو
  const uploadVideo = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    if (!videoFile) {
      setError('Please select a video file');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a video title');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setSuccess('');
      setUploadProgress(0);

      // محاكاة الرفع إلى IPFS
      console.log('📤 Simulating upload to IPFS...');
      
      // محاكاة التقدم
      const simulateProgress = () => {
        return new Promise((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 5;
            setUploadProgress(progress);
            
            if (progress >= 100) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
        });
      };
      
      await simulateProgress();

      // إعادة تعيين النموذج
      setTitle('');
      setDescription('');
      setCategory('Entertainment');
      setVideoFile(null);
      setThumbnailFile(null);
      setUploading(false);
      setSuccess('✅ Video uploaded successfully! NFT minted to your wallet. (Demo Mode)');

      // إغلاق النافذة بعد 3 ثواني
      setTimeout(() => {
        handleClose();
      }, 3000);

    } catch (error) {
      console.error('❌ Error uploading video:', error);
      setError(`Upload failed: ${error.message || 'Unknown error'}`);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // إعادة تعيين الحالة عند فتح النافذة
  useEffect(() => {
    if (open) {
      setAccount('');
      setError('');
      setSuccess('');
      setUploading(false);
      setUploadProgress(0);
    }
  }, [open]);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    maxWidth: '90vw',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: '90vh',
    overflow: 'auto',
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="upload-modal-title"
      aria-describedby="upload-modal-description"
    >
      <Box sx={style}>
        <Typography id="upload-modal-title" variant="h5" component="h2" gutterBottom>
          🚀 Upload Video to Decentralized Network
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        
        {/* قسم اتصال المحفظة */}
        {!account ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" gutterBottom>
              Connect your wallet to upload videos to the decentralized network
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={connectWallet}
              startIcon={<CloudUploadIcon />}
              sx={{ mt: 2 }}
            >
              Connect Wallet (Demo)
            </Button>
            <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
              ⚠️ Demo Mode: Using simulated wallet and blockchain
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
              <Typography variant="body2">
                ✅ Connected: <strong>{account.substring(0, 8)}...{account.substring(account.length - 4)}</strong>
                <br />
                <small>Demo Account - Not a real wallet</small>
              </Typography>
            </Box>
            
            {uploading ? (
              <Box sx={{ width: '100%', mt: 2 }}>
                <Typography variant="body1" gutterBottom>
                  Uploading... {Math.round(uploadProgress)}%
                </Typography>
                <LinearProgress variant="determinate" value={uploadProgress} sx={{ height: 10, borderRadius: 5, mb: 2 }} />
                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                  Simulating: Uploading to IPFS and minting NFT on blockchain...
                </Typography>
              </Box>
            ) : (
              <>
                {/* حقل الفيديو */}
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 2 }}
                >
                  {videoFile ? `Video: ${videoFile.name}` : 'Upload Video File *'}
                  <VisuallyHiddenInput
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                  />
                </Button>
                
                {/* حقل الصورة المصغرة */}
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 2 }}
                >
                  {thumbnailFile ? `Thumbnail: ${thumbnailFile.name}` : 'Upload Thumbnail (Optional)'}
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnailFile(e.target.files[0])}
                  />
                </Button>
                
                {/* حقل العنوان */}
                <TextField
                  fullWidth
                  label="Video Title *"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  margin="normal"
                  disabled={uploading}
                />
                
                {/* حقل الوصف */}
                <TextField
                  fullWidth
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  margin="normal"
                  multiline
                  rows={3}
                  disabled={uploading}
                />
                
                {/* حقل التصنيف */}
                <TextField
                  select
                  fullWidth
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  margin="normal"
                  disabled={uploading}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
                
                {/* معلومات عن العملية */}
                <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                    ℹ️ In Demo Mode this simulates:
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                    1. Uploading to IPFS (decentralized storage)
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                    2. Minting as NFT on Ethereum blockchain
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                    3. Owning content with your wallet address
                  </Typography>
                </Box>
                
                {/* أزرار الإجراءات */}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                  <Button onClick={handleClose} disabled={uploading}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={uploadVideo}
                    disabled={uploading || !videoFile || !title.trim()}
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload & Mint NFT (Demo)
                  </Button>
                </Box>
              </>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
};

export default UploadModal;