import React from 'react';

interface ConnectWalletProps {
  connectWallet: () => void;
  account: string | null;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ connectWallet, account }) => {
  return (
    <div>
      {account ? (
        <p className="mb-4">Connected as: <span className="font-mono">{account}</span></p>
      ) : (
        <button 
          onClick={connectWallet}
          className="px-6 py-3 bg-blue-600 rounded-lg text-xl hover:bg-blue-700 transition"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
