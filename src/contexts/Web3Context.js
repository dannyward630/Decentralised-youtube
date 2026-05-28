import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../services/blockchain';

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState('');

  const contractAbi = useMemo(() => CONTRACT_ABI, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        if (!CONTRACT_ADDRESS) {
          throw new Error('REACT_APP_CONTRACT_ADDRESS is not configured');
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!accounts.length) {
          throw new Error('No wallet account was selected');
        }
        setAccount(accounts[0]);
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);
        
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
            const contractInstance = CONTRACT_ADDRESS
              ? new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer)
              : null;
            
            const network = await provider.getNetwork();
            setNetwork(network.name);
            
            setContract(contractInstance);
            setIsConnected(Boolean(contractInstance));
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
  }, [contractAbi]);

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
