// src/components/Wallet.jsx
import React, { useState } from "react";
import { useWalletConn } from "../hooks/useWalletConnect";
import { useBalance } from "../hooks/useAccountBalance";

const Wallet = () => {
  const [inputAddress, setInputAddress] = useState(""); //input 
  const [balanceForInput, setBalanceForInput] = useState(null); 


  const { account, chainId, isConnected, errorMessage, getAccount, disconnectAccount } = useWalletConn();
  
 
  const { balance: connectedAccountBalance, fetchBalance } = useBalance(window.ethereum, account, chainId);

  
  const handleGetBalanceForInput = async () => {
    if (inputAddress) {
      const provider = window.ethereum;
      try {
        const balanceHex = await provider.request({
          method: "eth_getBalance",
          params: [inputAddress, "latest"],
        });
        
        const balanceInEther = Number(balanceHex) / 1e18; 
        setBalanceForInput(balanceInEther);
      } catch (error) {
        console.error("Error fetching balance for input address:", error);
        setBalanceForInput(null);
      }
    } else {
      console.error("No address entered.");
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Enter address"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
        />
        <button onClick={handleGetBalanceForInput}>Get Balance for Address</button>

        
        <h3>
          Balance for {inputAddress}: {balanceForInput !== null ? `${balanceForInput} ETH` : "Enter a valid address"}
        </h3>
      </div>


      <div>
        {!isConnected ? (
          <button onClick={getAccount} className="enableEthereumButton">
            Enable Ethereum
          </button>
        ) : (
          <>
            <h2>Connected Account: {account || errorMessage}</h2>
            {chainId && <h3>Connected to Chain ID: {chainId}</h3>}
            <button onClick={disconnectAccount} className="disconnectButton">
              Disconnect
            </button>

            
            <h3>
              Balance for Connected Account:{" "}
              {connectedAccountBalance !== null ? `${connectedAccountBalance} ETH` : "Fetching balance..."}
            </h3>
          </>
        )}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Wallet;