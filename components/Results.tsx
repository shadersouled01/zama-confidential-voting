'use client';
import React from 'react';

interface ResultsProps {
  candidates: string[];
  results: bigint[];
}

const Results: React.FC<ResultsProps> = ({ candidates, results }) => {
  const totalVotes = results.reduce((acc, current) => acc + (current || BigInt(0)), BigInt(0));
  
  const colors = [
    'from-orange-700 via-orange-800 to-orange-900',
    'from-blue-700 via-blue-800 to-indigo-900',
    'from-purple-700 via-purple-800 to-purple-900',
  ];

  return (
    <div className="my-12">
      <div className="glass-effect rounded-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold gradient-text">Live Results</h2>
            <p className="text-slate-400 mt-1">Real-time vote tracking</p>
          </div>
          <div className="text-right glass-effect p-4 rounded-xl">
            <p className="text-sm text-slate-400 mb-1">Total Votes</p>
            <p className="text-5xl font-bold gradient-text">{totalVotes.toString()}</p>
          </div>
        </div>

        <div className="space-y-6">
          {candidates.map((candidate, index) => {
            const voteCount = results[index] || BigInt(0);
            const percentage = totalVotes > 0 ? Number((voteCount * BigInt(100)) / totalVotes) : 0;
            
            return (
              <div key={index} className="glass-effect p-4 rounded-xl card-hover">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-2xl font-bold text-white">{candidate}</p>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">{voteCount.toString()}</p>
                    <p className="text-sm font-semibold text-purple-400">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
                
                <div className="w-full h-4 bg-slate-800/50 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full bg-gradient-to-r ${colors[index % colors.length]} transition-all duration-1000 ease-out shadow-lg`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
            <span>Results update every 5 seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;

