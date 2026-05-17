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
import { useWeb3 } from '../contexts/Web3Context';
import { uploadToIPFS } from '../services/ipfs';
import { uploadVideo as uploadVideoToBlockchain, formatVideo } from '../services/blockchain';

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

const UploadModal = ({ open, handleClose, onUploaded }) => {
  const { account, isConnected, connectWallet } = useWeb3();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Entertainment');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [status, setStatus] = useState('');

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

  const handleConnectWallet = async () => {
    try {
      setError('');
      await connectWallet();
      setSuccess('Wallet connected successfully.');
    } catch (error) {
      setError('Failed to connect wallet: ' + error.message);
    }
  };

  const submitUpload = async () => {
    if (!isConnected || !account) {
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
      setStatus('Uploading video to IPFS...');

      const videoHash = await uploadToIPFS(videoFile, (progress) => {
        setUploadProgress(Math.round(progress * 0.5));
      });

      let thumbnailHash = '';
      if (thumbnailFile) {
        setStatus('Uploading thumbnail to IPFS...');
        thumbnailHash = await uploadToIPFS(thumbnailFile, (progress) => {
          setUploadProgress(50 + Math.round(progress * 0.2));
        });
      }

      setStatus('Waiting for wallet transaction...');
      setUploadProgress(75);

      const transaction = await uploadVideoToBlockchain({
        videoHash,
        title: title.trim(),
        description: description.trim(),
        location: '',
        category,
        thumbnailHash,
        date: new Date().toISOString().split('T')[0],
      });

      setStatus(`Transaction submitted: ${transaction.hash}`);
      const receipt = await transaction.wait();
      const event = receipt.events?.find((item) => item.event === 'VideoUploaded');
      const uploadedVideo = event?.args ? formatVideo(event.args) : {
        id: receipt.transactionHash,
        hash: videoHash,
        title: title.trim(),
        description: description.trim(),
        author: account,
        category,
        date: new Date().toISOString().split('T')[0],
        thumbnailHash,
        createdAt: Math.floor(Date.now() / 1000).toString(),
        source: 'blockchain',
      };

      setUploadProgress(100);
      setStatus('Upload confirmed on-chain.');
      setSuccess('Video uploaded to IPFS and minted to your wallet.');
      onUploaded?.(uploadedVideo);

      setTitle('');
      setDescription('');
      setCategory('Entertainment');
      setVideoFile(null);
      setThumbnailFile(null);
      setUploading(false);

      setTimeout(() => {
        handleClose();
      }, 3000);

    } catch (error) {
      console.error('Error uploading video:', error);
      setError(`Upload failed: ${error.message || 'Unknown error'}`);
      setUploading(false);
      setUploadProgress(0);
      setStatus('');
    }
  };

  useEffect(() => {
    if (open) {
      setError('');
      setSuccess('');
      setUploading(false);
      setUploadProgress(0);
      setStatus('');
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
          Upload Video to Decentralized Network
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
        
        {!isConnected ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" gutterBottom>
              Connect your wallet to upload videos to the decentralized network
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleConnectWallet}
              startIcon={<CloudUploadIcon />}
              sx={{ mt: 2 }}
            >
              Connect Wallet
            </Button>
            <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
              MetaMask is required. Uploads are signed by the connected wallet.
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
              <Typography variant="body2">
                Connected: <strong>{account.substring(0, 8)}...{account.substring(account.length - 4)}</strong>
                <br />
                <small>This wallet will own the minted video NFT.</small>
              </Typography>
            </Box>
            
            {uploading ? (
              <Box sx={{ width: '100%', mt: 2 }}>
                <Typography variant="body1" gutterBottom>
                  {status || 'Uploading...'} {Math.round(uploadProgress)}%
                </Typography>
                <LinearProgress variant="determinate" value={uploadProgress} sx={{ height: 10, borderRadius: 5, mb: 2 }} />
                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                  Keep your wallet open until the blockchain transaction is confirmed.
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
                
                <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                    This upload will:
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                    1. Upload the selected file to the configured IPFS provider
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                    2. Register the IPFS hash with the deployed Youtube contract
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                    3. Mint the video NFT to {account.substring(0, 8)}...{account.substring(account.length - 4)}
                  </Typography>
                </Box>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                  <Button onClick={handleClose} disabled={uploading}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={submitUpload}
                    disabled={uploading || !videoFile || !title.trim()}
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload & Mint NFT
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
