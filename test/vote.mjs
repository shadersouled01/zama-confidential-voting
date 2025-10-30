import hre from "hardhat";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

const { ethers } = hre;

// The deployed contract address on Sepolia (Multi-Session)
const CONTRACT_ADDRESS = "0x5d36BcD10379dAEBCa1B05f0da35c122010c2bcB";

// Contract ABI for multi-session voting
const CONTRACT_ABI = [
  "function vote(uint256 sessionId, uint256 candidateIndex)",
  "function getCandidates(uint256 sessionId) view returns (string[])",
  "function getResult(uint256 sessionId, uint256 candidateIndex) view returns (uint256)",
  "function hasVoted(uint256 sessionId, address voter) view returns (bool)",
  "function getVotedCandidate(uint256 sessionId, address voter) view returns (uint256)",
  "function getSessionInfo(uint256 sessionId) view returns (string title, uint256 startTime, uint256 endTime, bool isActive)",
  "function getActiveSessions() view returns (uint256[])",
];

// Default session ID
const SESSION_ID = 0;

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log("🗳️  ZamaVote - Cast Your Vote\n");
  console.log("════════════════════════════════════════\n");

  // Get signer
  const signers = await ethers.getSigners();
  const voter = signers[0];

  console.log(`📋 Voter Address: ${voter.address}\n`);

  // Connect to the deployed contract
  const votingContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, voter);

  // Get session info
  const [title, startTime, endTime, isActive] = await votingContract.getSessionInfo(SESSION_ID);
  console.log(`📋 Session: ${title}`);
  console.log(`   Ends: ${new Date(Number(endTime) * 1000).toLocaleString()}\n`);

  // Check if session is active
  if (!isActive) {
    console.log("❌ This session is no longer active!");
    rl.close();
    return;
  }

  if (Date.now() / 1000 > Number(endTime)) {
    console.log("❌ This session has ended!");
    rl.close();
    return;
  }

  // Check if already voted
  const alreadyVoted = await votingContract.hasVoted(SESSION_ID, voter.address);
  
  if (alreadyVoted) {
    console.log("❌ You have already voted in this session!");
    console.log("   Please use a different wallet to vote again.\n");
    rl.close();
    return;
  }

  // Get candidates
  const candidates = await votingContract.getCandidates(SESSION_ID);
  console.log("🎯 Available Candidates:\n");
  candidates.forEach((candidate, index) => {
    console.log(`   ${index}: ${candidate}`);
  });
  console.log();

  // Get current results
  console.log("📊 Current Results:\n");
  for (let i = 0; i < candidates.length; i++) {
    const result = await votingContract.getResult(SESSION_ID, i);
    console.log(`   ${candidates[i]}: ${result} votes`);
  }
  console.log("\n════════════════════════════════════════\n");

  // Ask user for their vote
  const choice = await question("Enter the number of your candidate (0-2): ");
  const candidateIndex = parseInt(choice);

  // Validate input
  if (isNaN(candidateIndex) || candidateIndex < 0 || candidateIndex >= candidates.length) {
    console.log("\n❌ Invalid candidate number!");
    rl.close();
    return;
  }

  const selectedCandidate = candidates[candidateIndex];
  
  console.log(`\n✅ You selected: ${selectedCandidate}`);
  const confirm = await question("\nConfirm your vote? (yes/no): ");

  if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
    console.log("\n🚫 Vote cancelled.");
    rl.close();
    return;
  }

  try {
    console.log(`\n📝 Casting vote for ${selectedCandidate}...`);
    const tx = await votingContract.vote(SESSION_ID, candidateIndex);
    console.log(`⏳ Transaction sent: ${tx.hash}`);
    
    await tx.wait();
    console.log(`✅ Vote confirmed!\n`);

    // Display updated results
    console.log("📊 Updated Results:\n");
    for (let i = 0; i < candidates.length; i++) {
      const result = await votingContract.getResult(SESSION_ID, i);
      console.log(`   ${candidates[i]}: ${result} votes`);
    }
    console.log("\n🎉 Thank you for voting!\n");

  } catch (error) {
    console.error(`\n❌ Error casting vote: ${error.message}\n`);
  }

  rl.close();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

