'use client';
import React, { useState } from 'react';
import { CheckIcon } from './Icons';

interface VotingProps {
  candidates: string[];
  results: bigint[];
  hasVoted: boolean;
  votedCandidateIndex: number | null;
  onVote: (index: number) => void;
}

const Voting: React.FC<VotingProps> = ({ candidates, results, hasVoted, votedCandidateIndex, onVote }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleVote = async (index: number) => {
    setSelectedIndex(index);
    await onVote(index);
    setSelectedIndex(null);
  };

  const totalVotes = results.reduce((acc, curr) => acc + (curr || BigInt(0)), BigInt(0));

  return (
    <div className="my-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold gradient-text mb-2">Cast Your Vote</h2>
        <p className="text-slate-400">Choose your favorite cryptocurrency</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {candidates.map((candidate, index) => {
          const voteCount = results[index]?.toString() || '0';
          const isSelected = selectedIndex === index;
          const percentage = totalVotes > 0 ? Number((results[index] || BigInt(0)) * BigInt(100) / totalVotes) : 0;
          
          return (
            <div 
              key={index} 
              className={`glass-effect rounded-2xl p-6 card-hover group ${votedCandidateIndex === index ? 'border-2 border-emerald-600/50' : ''}`}
            >
              <div className="mb-6">
                <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-500 group-hover:bg-clip-text transition-all duration-300">
                  {candidate}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-slate-400 text-sm">Votes: <span className="text-white font-bold text-lg">{voteCount}</span></p>
                  {percentage > 0 && (
                    <span className="text-xs text-purple-400 font-semibold">{percentage}%</span>
                  )}
                </div>
              </div>

              {votedCandidateIndex === index ? (
                <div className="w-full py-4 px-4 bg-gradient-to-r from-emerald-800/50 to-emerald-900/50 rounded-xl text-center font-bold border border-emerald-600/50 flex items-center justify-center gap-2">
                  <CheckIcon className="w-5 h-5" />
                  <span className="text-emerald-400">Your Vote</span>
                </div>
              ) : votedCandidateIndex !== null ? (
                <div className="w-full py-4 px-4 glass-effect rounded-xl text-center text-slate-600 font-semibold border border-slate-800/50 opacity-60">
                  {candidate}
                </div>
              ) : !hasVoted ? (
                <button
                  onClick={() => handleVote(index)}
                  disabled={isSelected}
                  className="w-full py-4 px-4 bg-gradient-to-r from-blue-800 to-indigo-800 hover:from-blue-700 hover:to-indigo-700 rounded-xl font-bold text-white transition-all duration-300 shadow-lg hover:shadow-indigo-900/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {isSelected ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    `Vote for ${candidate}`
                  )}
                </button>
              ) : (
                <div className="w-full py-4 px-4 glass-effect rounded-xl text-center text-slate-600 font-semibold border border-slate-800/50 opacity-60">
                  {candidate}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {votedCandidateIndex !== null && (
        <div className="mt-8 glass-effect border border-emerald-700/40 rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <CheckIcon className="w-12 h-12" />
            <div>
              <p className="text-emerald-400 font-bold text-lg">Your vote has been recorded successfully!</p>
              <p className="text-slate-400 text-sm mt-1">You voted for <span className="text-emerald-400 font-semibold">{candidates[votedCandidateIndex]}</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Voting;
