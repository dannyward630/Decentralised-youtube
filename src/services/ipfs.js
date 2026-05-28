import axios from 'axios';

export const getIPFSFileUrl = (cid) => {
  if (!cid) return '';
  if (cid.startsWith('ipfs://')) {
    return `https://ipfs.io/ipfs/${cid.replace('ipfs://', '')}`;
  }
  return `https://ipfs.io/ipfs/${cid}`;
};

export const uploadToIPFS = async (file, onProgress) => {
  if (!file) {
    return '';
  }

  if (process.env.REACT_APP_PINATA_UPLOAD_URL) {
    return uploadWithUploadProxy(file, onProgress);
  }

  if (process.env.REACT_APP_IPFS_API_URL) {
    return uploadWithIpfsApi(file, onProgress);
  }

  throw new Error(
    'IPFS upload is not configured. Set REACT_APP_PINATA_UPLOAD_URL or REACT_APP_IPFS_API_URL before uploading.',
  );
};

const uploadWithUploadProxy = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(process.env.REACT_APP_PINATA_UPLOAD_URL, formData, {
    onUploadProgress: toProgressHandler(onProgress),
  });
  const cid = response.data?.IpfsHash || response.data?.Hash || response.data?.cid;

  if (!cid) {
    throw new Error('Upload proxy did not return an IPFS hash.');
  }

  return cid;
};

const uploadWithIpfsApi = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const baseUrl = process.env.REACT_APP_IPFS_API_URL.replace(/\/$/, '');
  const response = await axios.post(`${baseUrl}/api/v0/add`, formData, {
    params: { pin: true },
    onUploadProgress: toProgressHandler(onProgress),
  });

  if (!response.data?.Hash) {
    throw new Error('IPFS API did not return a content hash.');
  }

  return response.data.Hash;
};

const toProgressHandler = (onProgress) => (event) => {
  if (!onProgress || !event.total) return;
  onProgress(Math.round((event.loaded * 100) / event.total));
};
