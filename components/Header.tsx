'use client';
import React from 'react';
import { NetworkIcon } from './Icons';

const Header = () => {
  return (
    <header className="glass-effect border-b border-slate-800/50 py-6 sticky top-0 z-50 backdrop-blur-xl">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-900/50">
            Z
          </div>
          <h1 className="text-3xl font-bold gradient-text">ZamaVote</h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 glass-effect rounded-full border border-slate-800/30">
          <NetworkIcon className="w-4 h-4" />
          <span className="text-sm font-medium text-slate-400">Sepolia Testnet</span>
        </div>
      </div>
    </header>
  );
};

export default Header;

