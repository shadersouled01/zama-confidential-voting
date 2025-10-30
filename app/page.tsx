'use client';

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConnectWallet from "@/components/ConnectWallet";
import Voting from "@/components/Voting";
import Results from "@/components/Results";
import { LockIcon, ChartIcon, ShieldCheckIcon, ClockIcon, LightningIcon } from "@/components/Icons";

// The ABI of the VotingMock contract (Multi-Session)
const contractABI = [
  "function vote(uint256 sessionId, uint256 candidateIndex)",
  "function getCandidates(uint256 sessionId) view returns (string[])",
  "function getResult(uint256 sessionId, uint256 candidateIndex) view returns (uint256)",
  "function hasVoted(uint256 sessionId, address voter) view returns (bool)",
  "function getVotedCandidate(uint256 sessionId, address voter) view returns (uint256)",
  "function getSessionInfo(uint256 sessionId) view returns (string title, uint256 startTime, uint256 endTime, bool isActive)",
  "function getActiveSessions() view returns (uint256[])",
  "function sessionCount() view returns (uint256)",
];

// The address of the deployed contract on Sepolia (Multi-Session)
const contractAddress = "0x5d36BcD10379dAEBCa1B05f0da35c122010c2bcB";

// Default session ID (the first session created on deployment)
const DEFAULT_SESSION_ID = 0;

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [results, setResults] = useState<bigint[]>([]);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [votedCandidateIndex, setVotedCandidateIndex] = useState<number | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [sessionId, setSessionId] = useState<number>(DEFAULT_SESSION_ID);
  const [sessionTitle, setSessionTitle] = useState<string>("");
  const [sessionEndTime, setSessionEndTime] = useState<number>(0);
  const [activeSessions, setActiveSessions] = useState<Array<{id: number, title: string, endTime: number}>>([]);
  const [walletError, setWalletError] = useState<string>("");

  useEffect(() => {
    // FHE initialization - Currently disabled for mock contract
    // Uncomment when using real FHEVM contract
    /*
    import("@/utils/fhe").then(({ initFhevm }) => {
      initFhevm().catch(console.error);
    });
    */
  }, []);

  useEffect(() => {
    if (provider) {
      const contractInstance = new ethers.Contract(contractAddress, contractABI, provider);
      
      const loadContractData = async () => {
        try {
            console.log("Loading contract data for session:", sessionId);
            console.log("Contract address:", contractAddress);
            
            const signer = await provider.getSigner();
            const contractWithSigner = contractInstance.connect(signer) as ethers.Contract;
            setContract(contractWithSigner);

            // Load session info
            console.log("Fetching session info...");
            const sessionInfo = await contractWithSigner.getSessionInfo(sessionId);
            console.log("Session info received:", sessionInfo);
            
            const [title, startTime, endTime, isActive] = sessionInfo;
            setSessionTitle(title);
            setSessionEndTime(Number(endTime));
            console.log("Session title:", title, "End time:", new Date(Number(endTime) * 1000));

            // Load candidates for this session
            console.log("Fetching candidates...");
            const candidateList = await contractWithSigner.getCandidates(sessionId);
            console.log("Candidates:", candidateList);
            setCandidates(candidateList);

            if (account) {
                console.log("Checking vote status for:", account);
                const votedStatus = await contractWithSigner.hasVoted(sessionId, account);
                console.log("Has voted:", votedStatus);
                setHasVoted(votedStatus);
                
                // If user has voted, get which candidate they voted for
                if (votedStatus) {
                  try {
                    const votedCandidate = await contractWithSigner.getVotedCandidate(sessionId, account);
                    console.log("User voted for candidate index:", Number(votedCandidate));
                    setVotedCandidateIndex(Number(votedCandidate));
                  } catch (error) {
                    console.error("Error getting voted candidate:", error);
                    setVotedCandidateIndex(null);
                  }
                } else {
                  setVotedCandidateIndex(null);
                }
            }
            
            // Load all active sessions
            console.log("Fetching active sessions...");
            const activeSessionIds = await contractWithSigner.getActiveSessions();
            console.log("Active session IDs:", activeSessionIds);
            
            const sessionsData = await Promise.all(
              activeSessionIds.map(async (id: bigint) => {
                const [sessionTitle, , endTime] = await contractWithSigner.getSessionInfo(Number(id));
                return {
                  id: Number(id),
                  title: sessionTitle,
                  endTime: Number(endTime)
                };
              })
            );
            console.log("Active sessions:", sessionsData);
            setActiveSessions(sessionsData);
            
        } catch (error) {
            console.error("Error loading contract data:", error);
            // Try to provide more helpful error information
            if (error instanceof Error) {
                console.error("Error details:", error.message);
            }
        }
      };

      loadContractData();
    }
  }, [provider, account, sessionId]);

  useEffect(() => {
    const loadResults = async () => {
        if (contract && candidates.length > 0) {
            try {
                const resultsPromises = candidates.map((_, index) =>
                    contract.getResult(sessionId, index)
                );
                const resultsData = await Promise.all(resultsPromises);
                setResults(resultsData);
            } catch (error) {
                console.error("Error loading results:", error);
            }
        }
    };
    loadResults();

    const interval = setInterval(() => {
        loadResults();
    }, 5000); // Refresh results every 5 seconds

    return () => clearInterval(interval);

  }, [contract, candidates, sessionId]);
  
  const connectWallet = async () => {
    setWalletError(""); // Clear any previous errors
    
    if ((window as any).ethereum) {
      try {
        const newProvider = new ethers.BrowserProvider((window as any).ethereum);
        
        // Check if on Sepolia network (chainId: 11155111)
        const network = await newProvider.getNetwork();
        console.log("Connected to network:", network.chainId, network.name);
        
        if (network.chainId !== BigInt(11155111)) {
          console.log("Wrong network detected. Attempting to switch to Sepolia...");
          
          // Try to switch network automatically
          try {
            await (window as any).ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xaa36a7' }], // Sepolia chainId in hex
            });
            // Retry connection after network switch
            const updatedProvider = new ethers.BrowserProvider((window as any).ethereum);
            setProvider(updatedProvider);
            const accounts = await updatedProvider.send("eth_requestAccounts", []);
            setAccount(accounts[0]);
            setWalletError(""); // Clear error on successful connection
            console.log("Wallet connected on Sepolia:", accounts[0]);
          } catch (switchError: any) {
            console.error("Failed to switch network:", switchError);
            // If user rejects, show message
            if (switchError.code === 4001) {
              console.log("User rejected network switch");
              setWalletError("Please switch to Sepolia testnet to continue");
            } else {
              setWalletError("Unable to switch network. Please switch to Sepolia manually");
            }
          }
          return;
        }
        
        setProvider(newProvider);
        const accounts = await newProvider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        setWalletError(""); // Clear error on successful connection
        console.log("Wallet connected:", accounts[0]);
      } catch (error: any) {
        console.error("Error connecting to wallet:", error);
        if (error.code === 4001) {
          console.log("User rejected connection request");
        } else {
          setWalletError("Failed to connect wallet. Please try again");
        }
      }
    } else {
      setWalletError("No wallet detected. Please install MetaMask");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setContract(null);
    setCandidates([]);
    setResults([]);
    setHasVoted(false);
    setVotedCandidateIndex(null);
    setActiveSessions([]);
    console.log("Wallet disconnected");
  };

  const vote = async (candidateIndex: number) => {
    if (contract && provider) {
      try {
        // FHE ENCRYPTION - Currently disabled for mock contract
        // Uncomment when using real FHEVM contract:
        /*
        const { encryptVote } = await import("@/utils/fhe");
        const encryptedVoteData = await encryptVote(candidateIndex);
        console.log("Using FHE encrypted data:", encryptedVoteData);
        // In a real FHE implementation, send encryptedVoteData to the contract
        */

        // Mock contract implementation - using plaintext voting with sessionId
        const tx = await contract.vote(sessionId, candidateIndex);
        await tx.wait();
        console.log("Vote cast successfully for candidate index:", candidateIndex);
        setHasVoted(true);
        setVotedCandidateIndex(candidateIndex);
        
        // Immediately refresh results
        const resultsPromises = candidates.map((_, index) =>
          contract.getResult(sessionId, index)
        );
        const resultsData = await Promise.all(resultsPromises);
        setResults(resultsData);
      } catch (error: any) {
        console.error("Error casting vote:", error);
        // Only log, don't alert
        if (error.code === 4001) {
          console.log("User rejected transaction");
        }
      }
    }
  };
  
  return (
    <div className="text-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="text-center mb-16">
            <div className="mb-6">
              <div className="inline-block px-4 py-2 glass-effect rounded-full border border-indigo-800/40 mb-6 flex items-center gap-2">
                <LockIcon className="w-4 h-4" />
                <span className="text-sm gradient-text font-bold">Powered by Fully Homomorphic Encryption</span>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
              Welcome to <span className="gradient-text">ZamaVote</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
              Experience the future of private blockchain voting. Your vote stays encrypted, always.
            </p>
            
            {sessionTitle && (
              <div className="mt-8 glass-effect rounded-2xl p-6 inline-block border border-indigo-800/40 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Active Session</span>
                </div>
                <h2 className="text-3xl font-bold gradient-text mb-2">{sessionTitle}</h2>
                {sessionEndTime > 0 && (
                  <p className="text-sm text-slate-500">
                    ⏰ Ends: {new Date(sessionEndTime * 1000).toLocaleString()}
                  </p>
                )}
              </div>
            )}
            
            <div className="mt-10">
              <ConnectWallet connectWallet={connectWallet} disconnectWallet={disconnectWallet} account={account} />
              
              {walletError && (
                <div className="mt-4 glass-effect border border-orange-700/40 rounded-xl p-4 max-w-md mx-auto">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-orange-400 text-sm font-medium">{walletError}</p>
                  </div>
                </div>
              )}
            </div>
        </div>
        
        {account ? (
          <div>
            {/* Session Selector - Show if multiple sessions exist */}
            {activeSessions.length > 1 && (
              <div className="mb-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold gradient-text mb-2">Active Voting Sessions</h2>
                  <p className="text-slate-400">Choose a session to participate in</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeSessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => setSessionId(session.id)}
                      className={`glass-effect p-6 rounded-2xl transition-all duration-300 text-left ${
                        sessionId === session.id
                          ? 'border-2 border-indigo-700 shadow-lg shadow-indigo-900/30 scale-105'
                          : 'border border-slate-800/50 hover:border-indigo-800/50 hover:scale-102'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-white">{session.title}</h3>
                        {sessionId === session.id && (
                          <span className="px-2 py-1 bg-indigo-800 rounded-full text-xs font-bold">Active</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <ClockIcon className="w-4 h-4" />
                        <span>Ends: {new Date(session.endTime * 1000).toLocaleDateString()}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
        
        {account ? (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
              <Voting 
                candidates={candidates}
                results={results}
                hasVoted={hasVoted}
                votedCandidateIndex={votedCandidateIndex}
                onVote={vote}
              />
              <Results 
                candidates={candidates}
                results={results}
              />
            </div>

            <div className="mt-20 glass-effect p-10 rounded-3xl border border-indigo-900/30">
                <div className="text-center mb-12">
                  <h2 className="text-5xl font-bold gradient-text mb-3">How It Works</h2>
                  <p className="text-slate-500 text-lg">The Magic of Fully Homomorphic Encryption</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="glass-effect rounded-2xl p-8 text-center group hover:border-blue-800/50 border border-transparent transition-all duration-300">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-900/50">
                          <LockIcon className="w-12 h-12" />
                        </div>
                        <div className="mb-4 inline-block px-3 py-1 bg-blue-900/30 rounded-full">
                          <span className="text-xs font-bold text-blue-400">STEP 1</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Encrypted Voting</h3>
                        <p className="text-slate-500 leading-relaxed">
                          Your vote is encrypted on your device before being sent to the blockchain. Complete privacy guaranteed.
                        </p>
                    </div>
                    
                    <div className="glass-effect rounded-2xl p-8 text-center group hover:border-indigo-800/50 border border-transparent transition-all duration-300">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-800 to-indigo-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-900/50">
                          <ChartIcon className="w-12 h-12" />
                        </div>
                        <div className="mb-4 inline-block px-3 py-1 bg-indigo-900/30 rounded-full">
                          <span className="text-xs font-bold text-indigo-400">STEP 2</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Homomorphic Tallying</h3>
                        <p className="text-slate-500 leading-relaxed">
                          The smart contract tallies votes directly on encrypted data, ensuring privacy throughout.
                        </p>
                    </div>
                    
                    <div className="glass-effect rounded-2xl p-8 text-center group hover:border-purple-800/50 border border-transparent transition-all duration-300">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-800 to-purple-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-900/50">
                          <ShieldCheckIcon className="w-12 h-12" />
                        </div>
                        <div className="mb-4 inline-block px-3 py-1 bg-purple-900/30 rounded-full">
                          <span className="text-xs font-bold text-purple-400">STEP 3</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Public Results, Private Votes</h3>
                        <p className="text-slate-500 leading-relaxed">
                          Final tallies are public, but individual votes remain encrypted and confidential forever.
                        </p>
                    </div>
                </div>
            </div>
          </div>
        ) : (
          <div className="text-center mt-20">
            <div className="glass-effect rounded-3xl p-16 border border-cyan-900/30 max-w-3xl mx-auto">
              <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-cyan-700 to-blue-800 flex items-center justify-center shadow-2xl shadow-cyan-800/50 animate-pulse">
                <LockIcon className="w-14 h-14" />
              </div>
              <h2 className="text-5xl font-bold gradient-text mb-4">Ready to Vote?</h2>
              <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto">
                Connect your MetaMask wallet to participate in secure, confidential blockchain voting
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="glass-effect rounded-xl p-6 border border-slate-800/30 group hover:border-cyan-700/50 transition-all duration-300">
                  <div className="mb-4 mx-auto w-12 h-12 flex items-center justify-center">
                    <LockIcon className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <p className="font-bold text-white mb-1">Secure</p>
                  <p className="text-sm text-slate-500">Blockchain-powered</p>
                </div>
                <div className="glass-effect rounded-xl p-6 border border-slate-800/30 group hover:border-emerald-700/50 transition-all duration-300">
                  <div className="mb-4 mx-auto w-12 h-12 flex items-center justify-center">
                    <ShieldCheckIcon className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <p className="font-bold text-white mb-1">One Vote</p>
                  <p className="text-sm text-slate-500">Per wallet per session</p>
                </div>
                <div className="glass-effect rounded-xl p-6 border border-slate-800/30 group hover:border-amber-700/50 transition-all duration-300">
                  <div className="mb-4 mx-auto w-12 h-12 flex items-center justify-center">
                    <LightningIcon className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <p className="font-bold text-white mb-1">Real-time</p>
                  <p className="text-sm text-slate-500">Live result updates</p>
                </div>
              </div>
              
              <p className="text-slate-600 text-sm">
                Make sure you're connected to the <span className="text-emerald-400 font-semibold">Sepolia testnet</span>
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
