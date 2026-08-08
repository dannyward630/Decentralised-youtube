import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Button, CircularProgress } from '@mui/material';
import VideoCard from '../components/VideoCard';
import { fetchVideos } from '../data';
import { ethers } from 'ethers';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

// ABI للعقد الذكي
const CONTRACT_ABI = [
  "function getVideoCount() public view returns (uint256)",
  "function getVideo(uint256 _id) public view returns (tuple(uint256 id, string hash, string title, string description, string location, string category, string thumbnailHash, string date, address author, uint256 createdAt) memory)",
  "function getAllVideos() public view returns (tuple(uint256 id, string hash, string title, string description, string location, string category, string thumbnailHash, string date, address author, uint256 createdAt)[] memory)"
];

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blockchainVideos, setBlockchainVideos] = useState([]);
  const [firebaseVideos, setFirebaseVideos] = useState([]);
  const [showBlockchainOnly, setShowBlockchainOnly] = useState(false);

  // تحميل الفيديوهات من Firebase
  useEffect(() => {
    const loadFirebaseVideos = async () => {
      try {
        const firebaseVids = await fetchVideos();
        const formattedVideos = firebaseVids.map(video => ({
          ...video,
          source: 'firebase'
        }));
        setFirebaseVideos(formattedVideos);
      } catch (error) {
        console.error('Error loading Firebase videos:', error);
      }
    };

    loadFirebaseVideos();
  }, []);

  // تحميل الفيديوهات من Blockchain
  useEffect(() => {
    const loadBlockchainVideos = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
          
          try {
            // محاولة استخدام getAllVideos إذا كانت موجودة
            const allVideos = await contract.getAllVideos();
            const formattedVideos = allVideos.map(video => ({
              id: video.id.toString(),
              hash: video.hash,
              title: video.title || 'Untitled Video',
              description: video.description || '',
              author: video.author,
              category: video.category || 'Uncategorized',
              date: video.date || new Date().toLocaleDateString(),
              thumbnailHash: video.thumbnailHash,
              source: 'blockchain',
              createdAt: video.createdAt
            }));
            setBlockchainVideos(formattedVideos);
          } catch (error) {
            console.log('getAllVideos not available, trying individual loading');
            // بديل: تحميل الفيديوهات واحدة بواحدة
            try {
              const count = await contract.getVideoCount();
              const videosArray = [];
              for (let i = 1; i <= count; i++) {
                try {
                  const video = await contract.getVideo(i);
                  videosArray.push({
                    id: video.id.toString(),
                    hash: video.hash,
                    title: video.title || 'Untitled Video',
                    description: video.description || '',
                    author: video.author,
                    category: video.category || 'Uncategorized',
                    date: video.date || new Date().toLocaleDateString(),
                    thumbnailHash: video.thumbnailHash,
                    source: 'blockchain',
                    createdAt: video.createdAt
                  });
                } catch (err) {
                  console.error(`Error loading video ${i}:`, err);
                }
              }
              setBlockchainVideos(videosArray);
            } catch (err2) {
              console.error('Error getting video count:', err2);
            }
          }
        } catch (error) {
          console.error('Error loading blockchain videos:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadBlockchainVideos();
  }, []);

  // دمج الفيديوهات عند التحديث
  useEffect(() => {
    if (showBlockchainOnly) {
      setVideos(blockchainVideos);
    } else {
      setVideos([...blockchainVideos, ...firebaseVideos]);
    }
  }, [blockchainVideos, firebaseVideos, showBlockchainOnly]);

  return (
    <Box sx={{ p: 3 }}>
      {/* عنوان الصفحة */}
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
        🎬 Decentralized YouTube Videos
      </Typography>

      {/* أزرار التصفية */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button
          variant={!showBlockchainOnly ? "contained" : "outlined"}
          onClick={() => setShowBlockchainOnly(false)}
        >
          All Videos ({videos.length})
        </Button>
        <Button
          variant={showBlockchainOnly ? "contained" : "outlined"}
          onClick={() => setShowBlockchainOnly(true)}
          color="primary"
        >
          Blockchain Videos ({blockchainVideos.length})
        </Button>
        <Typography variant="body2" color="text.secondary">
          {showBlockchainOnly ? 'Showing only videos stored on blockchain' : 'Showing all videos from blockchain and Firebase'}
        </Typography>
      </Box>

      {/* قسم معلومات Blockchain */}
      {blockchainVideos.length > 0 && (
        <Box sx={{ mb: 4, p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
          <Typography variant="body1" gutterBottom>
            🌐 <strong>Decentralized Videos:</strong> These videos are stored on IPFS and registered on Ethereum blockchain.
            Each video is an NFT owned by the uploader.
          </Typography>
        </Box>
      )}

      {/* حالة التحميل */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading videos from blockchain...
          </Typography>
        </Box>
      ) : videos.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <PlayCircleIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
          <Typography variant="h5" gutterBottom>
            No videos available
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {showBlockchainOnly 
              ? 'No decentralized videos uploaded yet. Be the first to upload a video to the blockchain!'
              : 'No videos available. Upload a video to get started!'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {videos.map((video) => (
            <Grid item key={`${video.source}-${video.id}`} xs={12} sm={6} md={4} lg={3}>
              <VideoCard video={video} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* قسم التعليمات */}
      <Box sx={{ mt: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom>
          📚 How to Upload Decentralized Videos
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              1. Connect Wallet
            </Typography>
            <Typography variant="body2">
              Click the upload button in the navbar and connect your MetaMask wallet.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              2. Upload to IPFS
            </Typography>
            <Typography variant="body2">
              Select your video file. It will be uploaded to IPFS (decentralized storage).
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              3. Mint as NFT
            </Typography>
            <Typography variant="body2">
              Your video is minted as an NFT on Ethereum blockchain. You own it!
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
