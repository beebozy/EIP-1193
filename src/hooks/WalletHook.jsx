import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const useWallet = () => {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState('');
  const [isConnecting, setIsConnecting] = useState(false); // Track connection progress

  // Connect to the wallet and request account access
  const connectWallet = async () => {
    if (!window.ethereum) {
      console.error('MetaMask is not installed!');
      return;
    }

    if (isConnecting) {
      console.warn('Already connecting to MetaMask. Please wait.');
      return;
    }

    setIsConnecting(true); // Set connection state to true

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        getBalance(accounts[0]);
      }
    } catch (error) {
      console.error('Failed to connect MetaMask:', error);
    }

    setIsConnecting(false); // Reset connection state
  };

  // Retrieve balance for a given account
  const getBalance = async (account) => {
    if (window.ethereum && account) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(account);
      setBalance(parseFloat(ethers.utils.formatEther(balance)).toFixed(4));
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAddress(accounts[0]);
        getBalance(accounts[0]);
      });

      window.ethereum.on('chainChanged', (chainId) => {
        setNetwork(chainId);
      });
    }
  }, []);

  return {
    address,
    balance,
    isConnected,
    network,
    connectWallet,
    isConnecting, // Return isConnecting state
  };
};

export default useWallet;
