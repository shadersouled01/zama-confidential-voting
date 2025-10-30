import React from 'react';

interface ResultsProps {
  candidates: string[];
  results: bigint[];
}

const Results: React.FC<ResultsProps> = ({ candidates, results }) => {
  const totalVotes = results.reduce((acc, current) => acc + (current || BigInt(0)), BigInt(0));

  return (
    <div className="my-8">
      <h2 className="text-3xl font-bold text-center mb-6">Live Voting Results</h2>
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        {candidates.map((candidate, index) => {
          const voteCount = results[index] || BigInt(0);
          const percentage = totalVotes > 0 ? Number((voteCount * BigInt(100)) / totalVotes) : 0;
          return (
            <div key={index} className="my-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xl font-semibold">{candidate}</p>
                <p className="text-xl font-bold">{voteCount.toString()}</p>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div 
                  className="bg-blue-600 h-4 rounded-full" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
        <div className="mt-6 text-center text-lg font-semibold">
          Total Votes: {totalVotes.toString()}
        </div>
      </div>
    </div>
  );
};

export default Results;
