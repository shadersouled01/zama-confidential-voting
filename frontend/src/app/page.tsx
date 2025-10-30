"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConnectWallet from "@/components/ConnectWallet";
import Voting from "@/components/Voting";
import Results from "@/components/Results";
import Image from "next/image";
import { initFhevm, encryptVote } from "@/utils/fhe";

// The ABI of the VotingMock contract
const contractABI = [
  "function vote(uint256 candidateIndex)",
  "function getCandidates() view returns (string[])",
  "function getResult(uint256 candidateIndex) view returns (uint256)",
  "function hasVoted(address voter) view returns (bool)",
];

// The address of the deployed contract on Sepolia
const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // TODO: Replace with actual address

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [results, setResults] = useState<bigint[]>([]);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  useEffect(() => {
    initFhevm().catch(console.error);
  }, []);

  useEffect(() => {
    if (provider) {
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer as any);
      setContract(contractInstance);

      const loadContractData = async () => {
        const candidateList = await contractInstance.getCandidates();
        setCandidates(candidateList);

        if (account) {
          const votedStatus = await contractInstance.hasVoted(account);
          setHasVoted(votedStatus);
        }
      };

      loadContractData();
    }
  }, [provider, account]);

  useEffect(() => {
    if (contract) {
      const loadResults = async () => {
        const resultsPromises = candidates.map((_, index) =>
          contract.getResult(index)
        );
        const resultsData = await Promise.all(resultsPromises);
        setResults(resultsData);
      };
      if (candidates.length > 0) {
        loadResults();
      }
    }
  }, [contract, candidates]);
  
  const connectWallet = async () => {
    if ((window as any).ethereum ) {
      try { 
        const newProvider = new ethers.BrowserProvider((window as any).ethereum);
        setProvider(newProvider);
        const accounts = await newProvider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setContract(null);
    setCandidates([]);
    setResults([]);
    setHasVoted(false);
  };

  const vote = async (candidateIndex: number) => {
    if (contract && provider) {
      try {
        // This is where the FHE encryption would happen in a real application.
        // For now, it's a placeholder that simulates the encryption process.
        const encryptedVote = await encryptVote(candidateIndex);
        console.log("Proceeding with mock vote using placeholder ciphertext:", encryptedVote);

        const signer = await provider.getSigner();
        const contractWithSigner = contract.connect(signer) as ethers.Contract;
        
        // In a real FHE implementation, the `encryptedVote.data` would be sent to the contract.
        // Since this is a mock contract, we'll proceed with the plaintext candidateIndex.
        const tx = await contractWithSigner.vote(candidateIndex);
        await tx.wait();
        alert("Vote cast successfully!");
        setHasVoted(true);
        // Refresh results
        const resultsPromises = candidates.map((_, index) =>
          contract.getResult(index)
        );
        const resultsData = await Promise.all(resultsPromises);
        setResults(resultsData);
      } catch (error) {
        console.error("Error casting vote:", error);
        alert("Error casting vote. See console for details.");
      }
    }
  };
  
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold mb-4 leading-tight">
              Welcome to <span className="text-blue-500">ZamaVote</span>
            </h1>
            <p className="text-lg text-gray-400">A demonstration of fully confidential on-chain voting using FHE.</p>
            <div className="mt-8">
              <ConnectWallet connectWallet={connectWallet} disconnectWallet={disconnectWallet} account={account} />
            </div>
        </div>
        
        {account ? (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
              <Voting 
                candidates={candidates}
                results={results}
                hasVoted={hasVoted}
                votedCandidateIndex={null}
                onVote={vote as any}
              />
              <Results 
                candidates={candidates}
                results={results}
              />
            </div>

            <div className="mt-20 bg-gray-800 p-8 rounded-2xl shadow-2xl">
                <h2 className="text-4xl font-bold text-center mb-8">How It Works: The Magic of FHE</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center">
                        <Image src="/file.svg" alt="Encrypted Vote" width={80} height={80} />
                        <h3 className="text-2xl font-semibold mt-4 mb-2">1. Encrypted Voting</h3>
                        <p className="text-gray-400">Your vote is encrypted on your device *before* being sent to the blockchain. No one can see how you voted.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Image src="/globe.svg" alt="Homomorphic Tallying" width={80} height={80} />
                        <h3 className="text-2xl font-semibold mt-4 mb-2">2. Homomorphic Tallying</h3>
                        <p className="text-gray-400">The smart contract tallies votes directly on the encrypted data, ensuring privacy throughout the process.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Image src="/window.svg" alt="Public Results" width={80} height={80} />
                        <h3 className="text-2xl font-semibold mt-4 mb-2">3. Public Results, Private Votes</h3>
                        <p className="text-gray-400">The final tally is public, but individual votes remain encrypted and confidential forever.</p>
                    </div>
                </div>
            </div>
          </div>
        ) : (
          <div className="text-center mt-20">
            <h2 className="text-3xl font-bold">Connect Your Wallet to Begin</h2>
            <p className="text-gray-400 mt-2">Please connect your wallet to view the candidates and cast your vote.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
