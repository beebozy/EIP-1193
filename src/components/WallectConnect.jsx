import React, { useState } from 'react';
import useWallet from '../hooks/WalletHook.jsx'; // Import the custom hook

const WalletConnector = () => {
  const { address, balance, isConnected, network, connectWallet, isConnecting } = useWallet();
  const [inputAddress, setInputAddress] = useState('');
  const [customBalance, setCustomBalance] = useState(null);

  // Update the input field for a custom address
  const handleInputChange = (e) => {
    setInputAddress(e.target.value);
  };

  // Fetch balance for the entered address
  const handleFetchBalance = async () => {
    if (inputAddress) {
      const fetchedBalance = await fetchBalance(inputAddress);
      setCustomBalance(fetchedBalance);
    }
  };

  // Handle Connect Wallet button click
  const handleConnectWallet = async () => {
    await connectWallet();
  };

  return (
    <div className="wallet-connector">
      <h1>Ethereum Wallet Connector</h1>
      <button onClick={handleConnectWallet} disabled={isConnected || isConnecting}>
        {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
      {isConnected && (
        <>
          <div>
            <h3>Connected Address:</h3>
            <p>{address}</p>
          </div>
          <div>
            <h3>Network ID:</h3>
            <p>{network}</p>
          </div>
          <div>
            <h3>Balance:</h3>
            <p>{balance} ETH</p>
          </div>
          <div>
            <h3>Check Balance for Another Address:</h3>
            <input
              type="text"
              value={inputAddress}
              onChange={handleInputChange}
              placeholder="Enter Ethereum address"
            />
            <button onClick={handleFetchBalance}>Get Balance</button>
            {customBalance !== null && (
              <div>
                <h3>Balance for {inputAddress}:</h3>
                <p>{customBalance} ETH</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WalletConnector;
