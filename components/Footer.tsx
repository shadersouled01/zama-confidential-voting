'use client';
import React from 'react';

const Footer = () => {
  return (
    <footer className="glass-effect border-t border-slate-900/50 py-8 mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-slate-400 font-semibold">&copy; 2024 ZamaVote</p>
            <p className="text-slate-600 text-sm mt-1">Confidential Voting on Blockchain</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-slate-600 text-sm">Powered by</span>
            <span className="font-bold gradient-text">Zama FHEVM</span>
          </div>
          
          <div className="flex gap-4">
            <a href="https://docs.zama.ai" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-indigo-400 transition-colors text-sm font-medium">
              Docs
            </a>
            <a href="https://github.com/zama-ai" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-indigo-400 transition-colors text-sm font-medium">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

