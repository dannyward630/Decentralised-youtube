import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState('');

  // استخدام useMemo للـ ABI
  const CONTRACT_ABI = useMemo(() => [
    "function uploadVideo(string memory _videoHash, string memory _title, string memory _description, string memory _location, string memory _category, string memory _thumbnailHash, string memory _date) public",
    "function getVideoCount() public view returns (uint256)",
    "function getVideo(uint256 _id) public view returns (tuple(uint256 id, string hash, string title, string description, string location, string category, string thumbnailHash, string date, address author, uint256 createdAt) memory)",
    "function getAllVideos() public view returns (tuple(uint256 id, string hash, string title, string description, string location, string category, string thumbnailHash, string date, address author, uint256 createdAt)[] memory)",
    "event VideoUploaded(uint256 id, string hash, string title, string description, string location, string category, string thumbnailHash, string date, address author, uint256 timestamp)"
  ], []);

  const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        
        // استخدام Web3Provider في ethers v5.7
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        
        const network = await provider.getNetwork();
        setNetwork(network.name);
        
        setContract(contractInstance);
        setIsConnected(true);
        
        // حفظ حالة الاتصال
        localStorage.setItem('web3Connected', 'true');
        localStorage.setItem('web3Account', accounts[0]);
        
        return contractInstance;
      } catch (error) {
        console.error('Error connecting wallet:', error);
        throw error;
      }
    } else {
      throw new Error('MetaMask is not installed');
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setContract(null);
    setIsConnected(false);
    setNetwork('');
    localStorage.removeItem('web3Connected');
    localStorage.removeItem('web3Account');
  };

  // التحقق من الاتصال عند التحميل
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            
            const network = await provider.getNetwork();
            setNetwork(network.name);
            
            setContract(contractInstance);
            setIsConnected(true);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };

    checkConnection();

    // الاستماع لتغير الحسابات
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          disconnectWallet();
        }
      };
      
      const handleChainChanged = () => {
        window.location.reload();
      };
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      // التنظيف عند إلغاء التثبيت
      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [CONTRACT_ABI]);

  const value = {
    account,
    contract,
    isConnected,
    network,
    connectWallet,
    disconnectWallet
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};