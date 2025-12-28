import { ethers } from 'ethers';

// ABI للعقد الذكي
const CONTRACT_ABI = [
  "function uploadVideo(string memory _videoHash, string memory _title, string memory _description, string memory _location, string memory _category, string memory _thumbnailHash, string memory _date) public",
  "function getVideoCount() public view returns (uint256)",
  "function getVideo(uint256 _id) public view returns (tuple(uint256 id, string hash, string title, string description, string location, string category, string thumbnailHash, string date, address author, uint256 createdAt) memory)",
  "function getAllVideos() public view returns (tuple(uint256 id, string hash, string title, string description, string location, string category, string thumbnailHash, string date, address author, uint256 createdAt)[] memory)",
  "event VideoUploaded(uint256 id, string hash, string title, string description, string location, string category, string thumbnailHash, string date, address author, uint256 timestamp)"
];

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// الحصول على عقد متصل
export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

// الحصول على عقد للقراءة فقط
export const getReadOnlyContract = async () => {
  // استخدام RPC محلي للتطوير
  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};

// تحميل جميع الفيديوهات
export const loadAllVideos = async () => {
  try {
    const contract = await getReadOnlyContract();
    
    // محاولة استخدام getAllVideos
    try {
      const allVideos = await contract.getAllVideos();
      return allVideos.map(video => ({
        id: video.id.toString(),
        hash: video.hash,
        title: video.title || 'Untitled Video',
        description: video.description || '',
        author: video.author,
        category: video.category || 'Uncategorized',
        date: video.date || new Date().toLocaleDateString(),
        thumbnailHash: video.thumbnailHash,
        createdAt: video.createdAt.toString()
      }));
    } catch (error) {
      console.log('getAllVideos not available, loading individually');
      
      // بديل: تحميل الفيديوهات واحدة بواحدة
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
            createdAt: video.createdAt.toString()
          });
        } catch (err) {
          console.error(`Error loading video ${i}:`, err);
        }
      }
      
      return videosArray;
    }
  } catch (error) {
    console.error('Error loading videos from blockchain:', error);
    return [];
  }
};

// رفع فيديو جديد
export const uploadVideo = async (videoData) => {
  const contract = await getContract();
  
  const transaction = await contract.uploadVideo(
    videoData.videoHash,
    videoData.title,
    videoData.description,
    videoData.location || '',
    videoData.category,
    videoData.thumbnailHash || '',
    videoData.date || new Date().toISOString().split('T')[0]
  );
  
  return transaction;
};