import React from 'react';

interface VotingProps {
  candidates: string[];
  results: bigint[];
  hasVoted: boolean;
  vote: (candidateIndex: number) => void;
}

const Voting: React.FC<VotingProps> = ({ candidates, results, hasVoted, vote }) => {
  return (
    <div className="my-8">
      <h2 className="text-3xl font-bold text-center mb-6">Cast Your Vote</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((candidate, index) => (
          <div key={index} className="bg-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-semibold mb-3">{candidate}</h3>
            <p className="text-gray-400 mb-4">Current Votes: {results[index]?.toString() || '0'}</p>
            {!hasVoted && (
              <button
                onClick={() => vote(index)}
                className="w-full mt-4 px-4 py-2 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
              >
                Vote for {candidate}
              </button>
            )}
          </div>
        ))}
      </div>
      {hasVoted && <p className="mt-6 text-center text-green-400 text-lg">You have already cast your vote. Thank you for participating!</p>}
    </div>
  );
};

export default Voting;
