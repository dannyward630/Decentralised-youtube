import { ethers } from 'ethers';

export const CONTRACT_ABI = [
  "function uploadVideo(string memory _videoHash, string memory _title, string memory _description, string memory _location, string memory _category, string memory _thumbnailHash, string memory _date) public",
  "function getVideoCount() public view returns (uint256)",
  "function getVideo(uint256 _id) public view returns (tuple(uint256 id, string hash, string title, string description, string location, string category, string thumbnailHash, string date, address author, uint256 createdAt) memory)",
  "function getAllVideos() public view returns (tuple(uint256 id, string hash, string title, string description, string location, string category, string thumbnailHash, string date, address author, uint256 createdAt)[] memory)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function tokenURI(uint256 tokenId) public view returns (string)",
  "event VideoUploaded(uint256 id, string hash, string title, string description, string location, string category, string thumbnailHash, string date, address author, uint256 timestamp)"
];

export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '';

const getConfiguredContractAddress = () => {
  if (!CONTRACT_ADDRESS) {
    throw new Error('REACT_APP_CONTRACT_ADDRESS is not configured.');
  }

  return CONTRACT_ADDRESS;
};

export const formatVideo = (video) => ({
  id: video.id.toString(),
  hash: video.hash,
  title: video.title || 'Untitled Video',
  description: video.description || '',
  author: video.author,
  category: video.category || 'Uncategorized',
  date: video.date || new Date().toLocaleDateString(),
  thumbnailHash: video.thumbnailHash,
  createdAt: video.createdAt.toString(),
  source: 'blockchain',
});

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(getConfiguredContractAddress(), CONTRACT_ABI, signer);
};

export const getReadOnlyContract = async () => {
  const address = getConfiguredContractAddress();

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return new ethers.Contract(address, CONTRACT_ABI, provider);
  }

  if (!process.env.REACT_APP_READ_ONLY_RPC_URL) {
    throw new Error('No wallet or REACT_APP_READ_ONLY_RPC_URL available for reading blockchain videos.');
  }

  const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_READ_ONLY_RPC_URL);
  return new ethers.Contract(address, CONTRACT_ABI, provider);
};

export const loadAllVideos = async () => {
  try {
    const contract = await getReadOnlyContract();
    
    // محاولة استخدام getAllVideos
    try {
      const allVideos = await contract.getAllVideos();
      return allVideos.map(formatVideo);
    } catch (error) {
      console.log('getAllVideos not available, loading individually');
      
      // بديل: تحميل الفيديوهات واحدة بواحدة
      const count = await contract.getVideoCount();
      const videosArray = [];
      
      for (let i = 1; i <= count; i++) {
        try {
          const video = await contract.getVideo(i);
          videosArray.push(formatVideo(video));
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
