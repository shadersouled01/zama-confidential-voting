import hre from "hardhat";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

const { ethers } = hre;

// The deployed contract address on Sepolia
const CONTRACT_ADDRESS = "0x5d36BcD10379dAEBCa1B05f0da35c122010c2bcB";

// Contract ABI for multi-session voting
const CONTRACT_ABI = [
  "function createSession(string memory title, uint256 duration) returns (uint256)",
  "function addCandidate(uint256 sessionId, string memory candidateName)",
  "function getCandidates(uint256 sessionId) view returns (string[])",
  "function getSessionInfo(uint256 sessionId) view returns (string title, uint256 startTime, uint256 endTime, bool isActive)",
  "function getActiveSessions() view returns (uint256[])",
  "function sessionCount() view returns (uint256)",
  "function vote(uint256 sessionId, uint256 candidateIndex)",
  "function getResult(uint256 sessionId, uint256 candidateIndex) view returns (uint256)",
  "function hasVoted(uint256 sessionId, address voter) view returns (bool)",
];

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log("🗳️  ZamaVote - Create Voting Session\n");
  console.log("════════════════════════════════════════\n");

  // Get signer
  const signers = await ethers.getSigners();
  const creator = signers[0];

  console.log(`📋 Creator Address: ${creator.address}\n`);

  // Connect to the deployed contract
  const votingContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, creator);

  // Show current session count
  const currentSessionCount = await votingContract.sessionCount();
  console.log(`📊 Current Sessions: ${currentSessionCount}\n`);

  // Show active sessions
  const activeSessions = await votingContract.getActiveSessions();
  if (activeSessions.length > 0) {
    console.log("🟢 Active Sessions:");
    for (const sessionId of activeSessions) {
      const [title, startTime, endTime, isActive] = await votingContract.getSessionInfo(sessionId);
      console.log(`   Session ${sessionId}: ${title}`);
      console.log(`   Ends: ${new Date(Number(endTime) * 1000).toLocaleString()}`);
    }
    console.log();
  }

  // Get session details from user
  const sessionTitle = await question("Enter voting session title: ");
  if (!sessionTitle.trim()) {
    console.log("\n❌ Session title cannot be empty!");
    rl.close();
    return;
  }

  const durationInput = await question("Enter duration in days (default: 7): ");
  const durationDays = durationInput.trim() ? parseInt(durationInput) : 7;
  
  if (isNaN(durationDays) || durationDays <= 0) {
    console.log("\n❌ Invalid duration! Using default 7 days.");
  }

  const durationSeconds = BigInt(durationDays * 24 * 60 * 60);

  try {
    console.log(`\n📝 Creating session "${sessionTitle}" for ${durationDays} days...`);
    
    // Create the session
    const tx1 = await votingContract.createSession(sessionTitle, durationSeconds);
    console.log(`⏳ Transaction sent: ${tx1.hash}`);
    
    await tx1.wait();
    console.log(`✅ Session created successfully!\n`);

    // Get the new session ID
    const newSessionCount = await votingContract.sessionCount();
    const newSessionId = newSessionCount - 1;

    console.log(`📋 Session ID: ${newSessionId}`);
    console.log(`📋 Session Title: ${sessionTitle}`);
    console.log(`📋 Duration: ${durationDays} days`);
    console.log(`📋 End Time: ${new Date((Date.now() / 1000 + Number(durationSeconds)) * 1000).toLocaleString()}\n`);

    // Add candidates
    console.log("🎯 Adding candidates to the session...\n");
    
    const candidates = [];
    let addMore = true;
    let candidateIndex = 0;

    while (addMore && candidateIndex < 10) { // Limit to 10 candidates
      const candidateName = await question(`Enter candidate ${candidateIndex + 1} name (or 'done' to finish): `);
      
      if (candidateName.toLowerCase() === 'done' || candidateName.toLowerCase() === '') {
        addMore = false;
        break;
      }

      if (candidateName.trim()) {
        candidates.push(candidateName.trim());
        
        // Add candidate to contract
        const tx2 = await votingContract.addCandidate(newSessionId, candidateName.trim());
        await tx2.wait();
        
        console.log(`✅ Added candidate: ${candidateName.trim()}`);
        candidateIndex++;
      }
    }

    if (candidates.length === 0) {
      console.log("\n⚠️  No candidates added. Session created but empty.");
    } else {
      console.log(`\n🎉 Session created with ${candidates.length} candidates!\n`);
      
      // Display final session info
      console.log("📊 Final Session Details:");
      console.log(`   ID: ${newSessionId}`);
      console.log(`   Title: ${sessionTitle}`);
      console.log(`   Candidates: ${candidates.join(', ')}`);
      console.log(`   Duration: ${durationDays} days`);
      console.log(`   End Time: ${new Date((Date.now() / 1000 + Number(durationSeconds)) * 1000).toLocaleString()}\n`);

      // Ask if user wants to vote immediately
      const voteNow = await question("Would you like to vote in this session now? (yes/no): ");
      
      if (voteNow.toLowerCase() === 'yes' || voteNow.toLowerCase() === 'y') {
        console.log("\n🎯 Available Candidates:");
        candidates.forEach((candidate, index) => {
          console.log(`   ${index}: ${candidate}`);
        });

        const choice = await question("\nEnter the number of your candidate: ");
        const candidateIndex = parseInt(choice);

        if (!isNaN(candidateIndex) && candidateIndex >= 0 && candidateIndex < candidates.length) {
          try {
            console.log(`\n📝 Casting vote for ${candidates[candidateIndex]}...`);
            const tx3 = await votingContract.vote(newSessionId, candidateIndex);
            console.log(`⏳ Vote transaction sent: ${tx3.hash}`);
            
            await tx3.wait();
            console.log(`✅ Vote cast successfully!\n`);

            // Show updated results
            console.log("📊 Current Results:");
            for (let i = 0; i < candidates.length; i++) {
              const result = await votingContract.getResult(newSessionId, i);
              console.log(`   ${candidates[i]}: ${result} votes`);
            }
          } catch (error) {
            console.error(`\n❌ Error casting vote: ${error.message}`);
          }
        } else {
          console.log("\n❌ Invalid candidate selection!");
        }
      }
    }

    console.log("\n🎉 Voting session creation completed!\n");

  } catch (error) {
    console.error(`\n❌ Error creating session: ${error.message}\n`);
  }

  rl.close();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
