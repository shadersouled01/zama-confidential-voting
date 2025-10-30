import React from 'react';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-3xl font-bold tracking-wider">ZamaVote</h1>
        <p className="text-sm text-gray-400">Decentralized & Confidential</p>
      </div>
    </header>
  );
};

export default Header;
