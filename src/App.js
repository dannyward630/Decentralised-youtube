import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom'; // 🔴 إزالة Routes و Route
import styled from 'styled-components';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import UploadModal from './components/UploadModal';
import { useWeb3 } from './contexts/Web3Context';
import { loadAllVideos } from './services/blockchain';
import { getIPFSFileUrl } from './services/ipfs';
// 🔴 إزالة: import VideoPage from './components/VideoPage';
// 🔴 إزالة: import Home from './pages/Home';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Alert
} from '@mui/material';
// 🔴 إزالة: import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// ==================== الجزء الخاص بتصميم YouTube ====================
const MainContent = styled.div`
  margin-top: 60px; /* ارتفاع الـ Navbar */
  margin-left: ${props => (props.isSidebarOpen ? '240px' : '0')};
  transition: margin-left 0.3s ease;
  padding: 20px;
  background-color: #0f0f0f;
  min-height: calc(100vh - 60px);
`;

const createPlaceholderThumbnail = (label, color) => (
  `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180">
      <rect width="320" height="180" fill="${color}"/>
      <circle cx="160" cy="90" r="32" fill="rgba(255,255,255,0.2)"/>
      <polygon points="150,70 150,110 186,90" fill="white"/>
      <text x="160" y="145" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="20" font-weight="700">${label}</text>
    </svg>
  `)}`
);

const IPFS_PLACEHOLDER = createPlaceholderThumbnail('IPFS Video', '#6a1b9a');

// ==================== المكون الرئيسي ====================
const App = () => {
  const { account, isConnected, connectWallet, disconnectWallet } = useWeb3();
  // حالة للشريط الجانبي
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [walletError, setWalletError] = useState('');
  
  // حالة الرفع والمحتوى
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: 'Decentralized YouTube Demo',
      description: 'This video demonstrates decentralized video uploads',
      category: 'Technology',
      date: '2023-12-24',
      thumbnail: createPlaceholderThumbnail('Decentralized Video', '#2e7d32'),
      source: 'demo'
    },
    {
      id: 2,
      title: 'Blockchain Technology Explained',
      description: 'Learn how blockchain enables decentralized applications',
      category: 'Education',
      date: '2023-12-23',
      thumbnail: createPlaceholderThumbnail('Blockchain 101', '#1565c0'),
      source: 'demo'
    },
    {
      id: 3,
      title: 'Web3 Revolution',
      description: 'The future of decentralized internet',
      category: 'Technology',
      date: '2023-12-22',
      thumbnail: createPlaceholderThumbnail('Web3 Future', '#ef6c00'),
      source: 'demo'
    }
  ]);

  useEffect(() => {
    const loadBlockchainVideos = async () => {
      try {
        const blockchainVideos = await loadAllVideos();
        if (blockchainVideos.length > 0) {
          setVideos((currentVideos) => [
            ...blockchainVideos,
            ...currentVideos.filter((video) => video.source !== 'blockchain'),
          ]);
        }
      } catch (error) {
        console.info('Blockchain videos are not available yet:', error.message);
      }
    };

    loadBlockchainVideos();
  }, []);

  // دالات التحكم بالشريط الجانبي والنوافذ
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleUploadModal = () => {
    setIsUploadModalOpen(!isUploadModalOpen);
  };

  const handleConnectWallet = async () => {
    try {
      setWalletError('');
      await connectWallet();
    } catch (error) {
      setWalletError(error.message);
    }
  };

  const handleVideoUploaded = (video) => {
    setVideos((currentVideos) => [video, ...currentVideos]);
  };

  return (
    <Router>
      {/* ========== NAVBAR (تصميم YouTube) ========== */}
      <Navbar 
        toggleSidebar={toggleSidebar}
        open={isSidebarOpen}
        user={isConnected ? { email: account } : null}
        toggleUploadModal={toggleUploadModal}
        handleLogin={handleConnectWallet}
        handleLogout={disconnectWallet}
      />
      
      {/* ========== SIDEBAR (تصميم YouTube) ========== */}
      <Sidebar 
        open={isSidebarOpen}
        handleLogin={handleConnectWallet}
        handleLogout={disconnectWallet}
        user={isConnected ? { email: account } : null}
      />
      
      {/* ========== MAIN CONTENT AREA ========== */}
      <MainContent isSidebarOpen={isSidebarOpen}>
        {/* نافذة رفع الفيديو (مودال) */}
        {isUploadModalOpen && (
          <UploadModal 
            open={isUploadModalOpen}
            handleClose={toggleUploadModal}
            onUploaded={handleVideoUploaded}
          />
        )}
        
        {/* ========== محتوى الصفحة الرئيسية ========== */}
        <Container maxWidth="lg" sx={{ py: 2, backgroundColor: '#0f0f0f' }}>
          {/* Header مع زر الاتصال */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'white' }}>
              🎬 Decentralized YouTube
            </Typography>
            
            {isConnected ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, bgcolor: '#065fd4', color: 'white', borderRadius: 1 }}>
                  <Typography variant="caption">
                    {account.substring(0, 8)}...{account.substring(account.length - 4)}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={handleConnectWallet}
                sx={{ bgcolor: '#065fd4', '&:hover': { bgcolor: '#1c62b9' } }}
              >
                Connect Wallet
              </Button>
            )}
          </Box>

          {/* Status Message */}
          {walletError ? (
            <Alert severity="error" sx={{ mb: 4 }}>
              {walletError}
            </Alert>
          ) : (
            <Alert severity="info" sx={{ mb: 4 }}>
              <strong>Decentralized uploads:</strong> connect MetaMask, upload to IPFS, then mint the video NFT to your wallet.
            </Alert>
          )}

          {/* Feature Info */}
          <Box sx={{ 
            mb: 6, 
            p: 3, 
            bgcolor: '#212121', 
            borderRadius: 2, 
            border: '1px solid #303030',
            color: 'white'
          }}>
            <Typography variant="h5" gutterBottom>
              🌐 Decentralized Video Uploads
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: '#4CAF50' }}>
                  ✅ Any User Can Upload
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  Not just the deployer. Any connected wallet can upload videos.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: '#4CAF50' }}>
                  ✅ IPFS Storage
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  Videos stored on decentralized IPFS network.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: '#4CAF50' }}>
                  ✅ NFT Ownership
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  Each video is minted as NFT, proving ownership.
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Video Grid */}
          <Typography variant="h4" gutterBottom sx={{ mb: 3, color: 'white' }}>
            🎥 Recommended Videos ({videos.length})
          </Typography>
          
          <Grid container spacing={3}>
            {videos.map((video) => (
              <Grid item key={video.id} xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  bgcolor: '#181818',
                  color: 'white',
                  '&:hover': { bgcolor: '#212121', transform: 'scale(1.02)' },
                  transition: 'all 0.2s ease'
                }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={video.thumbnail || getIPFSFileUrl(video.thumbnailHash) || IPFS_PLACEHOLDER}
                    alt={video.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div" sx={{ color: 'white' }}>
                      {video.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: '#aaa' }}>
                      {video.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#3ea6ff' }}>
                        🏷️ {video.category}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#aaa' }}>
                        📅 {video.date}
                      </Typography>
                    </Box>
                    {video.source === 'blockchain' && video.author && (
                      <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#3ea6ff' }}>
                        Owner: {video.author.substring(0, 8)}...{video.author.substring(video.author.length - 4)}
                      </Typography>
                    )}
                    {video.source === 'blockchain' ? (
                      <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#4CAF50' }}>
                        Stored on IPFS and minted as NFT
                      </Typography>
                    ) : (
                      <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#aaa' }}>
                        Demo video
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* How to Use */}
          <Box sx={{ 
            mt: 6, 
            p: 3, 
            bgcolor: '#212121', 
            borderRadius: 2, 
            border: '1px solid #303030',
            color: 'white'
          }}>
            <Typography variant="h5" gutterBottom>
              🚀 How to Use This Feature
            </Typography>
            <ol style={{ color: '#ccc', paddingLeft: '20px' }}>
              <li>
                <Typography variant="body1" gutterBottom sx={{ color: '#ccc' }}>
                  <strong style={{ color: 'white' }}>Connect Wallet:</strong> Click "Connect Wallet" button
                </Typography>
              </li>
              <li>
                <Typography variant="body1" gutterBottom sx={{ color: '#ccc' }}>
                  <strong style={{ color: 'white' }}>Click UPLOAD:</strong> Use the upload button in top navbar
                </Typography>
              </li>
              <li>
                <Typography variant="body1" gutterBottom sx={{ color: '#ccc' }}>
                  <strong style={{ color: 'white' }}>Watch Progress:</strong> See IPFS and transaction progress
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ color: '#ccc' }}>
                  <strong style={{ color: 'white' }}>View Results:</strong> New on-chain video appears in the grid
                </Typography>
              </li>
            </ol>
          </Box>

          {/* Footer */}
          <Box sx={{ 
            mt: 6, 
            pt: 3, 
            borderTop: 1, 
            borderColor: '#333', 
            textAlign: 'center',
            color: '#aaa'
          }}>
            <Typography variant="body2">
              Decentralized YouTube
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: '#666' }}>
              Videos uploaded through this app are owned by the uploader wallet.
            </Typography>
          </Box>
        </Container>
      </MainContent>
    </Router>
  );
};

export default App;
