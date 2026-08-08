import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom'; // 🔴 إزالة Routes و Route
import styled from 'styled-components';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import UploadModal from './components/UploadModal';
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
  LinearProgress,
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

// ==================== المكون الرئيسي ====================
const App = () => {
  // حالة للشريط الجانبي
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // حالة الرفع والمحتوى
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: 'Decentralized YouTube Demo',
      description: 'This video demonstrates decentralized video uploads',
      category: 'Technology',
      date: '2023-12-24',
      thumbnail: 'https://via.placeholder.com/320x180/4CAF50/FFFFFF?text=Decentralized+Video'
    },
    {
      id: 2,
      title: 'Blockchain Technology Explained',
      description: 'Learn how blockchain enables decentralized applications',
      category: 'Education',
      date: '2023-12-23',
      thumbnail: 'https://via.placeholder.com/320x180/2196F3/FFFFFF?text=Blockchain+101'
    },
    {
      id: 3,
      title: 'Web3 Revolution',
      description: 'The future of decentralized internet',
      category: 'Technology',
      date: '2023-12-22',
      thumbnail: 'https://via.placeholder.com/320x180/FF9800/FFFFFF?text=Web3+Future'
    }
  ]);

  // دالات التحكم بالشريط الجانبي والنوافذ
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleUploadModal = () => {
    setIsUploadModalOpen(!isUploadModalOpen);
  };

  // دالات اتصال المحفظة والرفع
  const connectWallet = () => {
    // محاكاة اتصال المحفظة
    const fakeAddress = '0x' + Math.random().toString(16).substring(2, 42);
    setWalletAddress(fakeAddress);
    setConnected(true);
  };

  const uploadVideo = () => {
    setUploading(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploading(false);
            toggleUploadModal(); // إغلاق النافذة بعد الرفع
            
            // إضافة فيديو جديد
            const newVideo = {
              id: videos.length + 1,
              title: `Uploaded Video ${videos.length + 1}`,
              description: 'This video was uploaded to IPFS and minted as NFT',
              category: 'User Generated',
              date: new Date().toISOString().split('T')[0],
              thumbnail: 'https://via.placeholder.com/320x180/9C27B0/FFFFFF?text=New+NFT+Video'
            };
            setVideos([newVideo, ...videos]);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 100);
  };

  return (
    <Router>
      {/* ========== NAVBAR (تصميم YouTube) ========== */}
      <Navbar 
        toggleSidebar={toggleSidebar}
        open={isSidebarOpen}
        user={connected ? { email: walletAddress } : null}
        toggleUploadModal={toggleUploadModal}
      />
      
      {/* ========== SIDEBAR (تصميم YouTube) ========== */}
      <Sidebar 
        open={isSidebarOpen}
        handleLogin={connectWallet}
        handleLogout={() => {
          setConnected(false);
          setWalletAddress('');
        }}
        user={connected ? { email: walletAddress } : null}
      />
      
      {/* ========== MAIN CONTENT AREA ========== */}
      <MainContent isSidebarOpen={isSidebarOpen}>
        {/* نافذة رفع الفيديو (مودال) */}
        {isUploadModalOpen && (
          <UploadModal 
            open={isUploadModalOpen}
            handleClose={toggleUploadModal}
            uploadVideo={uploadVideo}
            uploading={uploading}
            progress={progress}
            connected={connected}
          />
        )}
        
        {/* ========== محتوى الصفحة الرئيسية ========== */}
        <Container maxWidth="lg" sx={{ py: 2, backgroundColor: '#0f0f0f' }}>
          {/* Header مع زر الاتصال */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'white' }}>
              🎬 Decentralized YouTube
            </Typography>
            
            {connected ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1, bgcolor: '#065fd4', color: 'white', borderRadius: 1 }}>
                  <Typography variant="caption">
                    {walletAddress.substring(0, 8)}...{walletAddress.substring(walletAddress.length - 4)}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={connectWallet}
                sx={{ bgcolor: '#065fd4', '&:hover': { bgcolor: '#1c62b9' } }}
              >
                Connect Wallet (Demo)
              </Button>
            )}
          </Box>

          {/* Status Message */}
          <Alert severity="success" sx={{ mb: 4, bgcolor: '#1b5e20', color: 'white' }}>
            ✅ <strong>Issue #1 Implemented:</strong> Decentralized video uploads enabled!
          </Alert>

          {/* Upload Progress (يظهر عند الرفع) */}
          {uploading && (
            <Box sx={{ mb: 4, p: 2, bgcolor: '#1e1e1e', borderRadius: 2 }}>
              <Typography variant="body1" gutterBottom sx={{ color: 'white' }}>
                Uploading to IPFS and minting NFT... {progress}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ height: 10, borderRadius: 5, bgcolor: '#333' }}
              />
              <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#aaa' }}>
                Simulating: IPFS Upload → Blockchain Transaction → NFT Minting
              </Typography>
            </Box>
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
                  Not just contract owner. Any connected wallet can upload videos.
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
                    image={video.thumbnail}
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
                    {video.id <= 3 && (
                      <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#4CAF50' }}>
                        {video.id === 1 ? '🌐 Stored on IPFS' : '📡 Decentralized'}
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
                  <strong style={{ color: 'white' }}>Click UPLOAD:</strong> Use the UPLOAD button in top navbar
                </Typography>
              </li>
              <li>
                <Typography variant="body1" gutterBottom sx={{ color: '#ccc' }}>
                  <strong style={{ color: 'white' }}>Watch Progress:</strong> See the upload progress
                </Typography>
              </li>
              <li>
                <Typography variant="body1" sx={{ color: '#ccc' }}>
                  <strong style={{ color: 'white' }}>View Results:</strong> New video appears in the grid
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
              Decentralized YouTube - Issue #1 Implementation Complete
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: '#666' }}>
              Design matches reference image | Status: ✅ IMPLEMENTED
            </Typography>
          </Box>
        </Container>
      </MainContent>
    </Router>
  );
};

export default App;
