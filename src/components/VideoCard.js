import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { styled } from '@mui/material/styles';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { getIPFSFileUrl } from '../services/ipfs';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  margin: theme.spacing(2),
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const VideoCard = ({ video }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [authorShort, setAuthorShort] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    if (video) {
      // إذا كان الفيديو من IPFS
      if (video.hash && video.hash.startsWith('Qm')) {
        const ipfsVideoUrl = getIPFSFileUrl(video.hash);
        setVideoUrl(ipfsVideoUrl);
        if (video.thumbnailHash) {
          setThumbnailUrl(getIPFSFileUrl(video.thumbnailHash));
        }
      }
      // إذا كان الفيديو من Firebase (للتوافق مع البيانات القديمة)
      else if (video.videoUrl) {
        setVideoUrl(video.videoUrl);
        if (video.thumbnailUrl) {
          setThumbnailUrl(video.thumbnailUrl);
        }
      }

      // تقصير عنوان المحفظة
      if (video.author) {
        setAuthorShort(`${video.author.substring(0, 6)}...${video.author.substring(video.author.length - 4)}`);
      } else if (video.uploader) {
        setAuthorShort(video.uploader);
      }
    }
  }, [video]);

  const handleCardClick = () => {
    if (video.id) {
      // يمكن استخدام videoUrl هنا إذا أردت
      window.location.href = `/video/${video.id}`;
    }
  };

  return (
    <StyledCard>
      <CardActionArea onClick={handleCardClick}>
        <div style={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="194"
            image={thumbnailUrl || 'https://via.placeholder.com/345x194?text=Decentralized+Video'}
            alt={video.title || 'Video thumbnail'}
          />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '48px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            <PlayCircleIcon fontSize="inherit" />
          </div>
          {video.hash && (
            <div style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              backgroundColor: 'rgba(76, 175, 80, 0.9)',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '10px',
              fontSize: '10px',
              fontWeight: 'bold'
            }}>
              NFT
            </div>
          )}
        </div>
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {video.title || 'Untitled Video'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '40px'
          }}>
            {video.description || 'No description'}
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
            <Typography variant="caption" color="primary">
              {video.author ? '👤 ' + authorShort : ''}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {video.category || 'Uncategorized'}
            </Typography>
          </div>
          {video.date && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              📅 {video.date}
            </Typography>
          )}
          {video.hash && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              🌐 IPFS: {video.hash.substring(0, 10)}...
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </StyledCard>
  );
};

export default VideoCard;