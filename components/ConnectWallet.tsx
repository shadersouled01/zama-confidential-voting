'use client';
import React from 'react';
import { WalletIcon, DisconnectIcon } from './Icons';

interface ConnectWalletProps {
  connectWallet: () => void;
  disconnectWallet: () => void;
  account: string;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ connectWallet, disconnectWallet, account }) => {
  return (
    <div className="flex justify-center items-center gap-4">
      {account ? (
        <>
          <div className="glass-effect px-5 py-3 rounded-xl flex items-center gap-3 border border-slate-800/40">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-slate-300 font-medium">{account.substring(0, 6)}...{account.substring(38)}</span>
          </div>
          <button
            onClick={disconnectWallet}
            className="px-7 py-3 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white transition-all duration-300 shadow-lg hover:shadow-orange-400/60 flex items-center gap-2 border-2 border-orange-400/40 transform hover:scale-105"
          >
            <DisconnectIcon className="w-5 h-5" />
            Disconnect
          </button>
        </>
      ) : (
        <button
          onClick={connectWallet}
          className="px-12 py-5 rounded-xl font-bold text-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:from-cyan-400 hover:via-blue-400 hover:to-indigo-400 text-white transition-all duration-300 shadow-2xl hover:shadow-cyan-400/60 transform hover:scale-110 flex items-center gap-4 border-2 border-cyan-400/40"
        >
          <WalletIcon className="w-8 h-8" />
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;

