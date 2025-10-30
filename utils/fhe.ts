// Using the bundled version for Next.js compatibility
// See: https://docs.zama.ai/protocol/relayer-sdk-guides/development-guide/webpack
import { initSDK, createInstance } from "@zama-fhe/relayer-sdk/bundle";

let instance: any;

export const initFhevm = async () => {
  if (!instance) {
    // Load WASM needed for FHE operations
    await initSDK();
    console.log("FHEVM SDK initialized.");
  }
};

export const getFhevmInstance = () => {
  if (!instance) {
    throw new Error("FHEVM is not initialized. Call initFhevm() first.");
  }
  return instance;
};

// Placeholder function for encrypting a vote
// In a real implementation, this would use the createInstance to encrypt data
export const encryptVote = async (vote: number) => {
  console.log(`Encrypting vote for candidate index: ${vote}`);
  
  // Placeholder for the actual encryption logic
  // In production, you would create an instance with proper config and encrypt the vote
  const encryptedVote = {
    data: `encrypted_vote_${vote}_${Date.now()}`,
    type: "fhe-ciphertext"
  };

  console.log("Generated placeholder encrypted vote:", encryptedVote);
  return encryptedVote;
};
