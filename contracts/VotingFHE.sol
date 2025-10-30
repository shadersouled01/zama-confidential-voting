// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";
import "fhevm/gateway/GatewayCaller.sol";

/// @title Multi-Session Confidential Voting Contract using FHE
/// @author Zama Protocol Demo
/// @notice This contract implements a fully confidential voting system with multiple time-limited sessions
/// @dev Votes are encrypted and tallied homomorphically without ever being decrypted
contract VotingFHE is GatewayCaller {
    
    struct VotingSession {
        string title;
        string[] candidates;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        mapping(uint256 => euint32) encryptedVotes; // candidateIndex => encrypted vote count
        mapping(address => bool) hasVoted;
        mapping(address => euint32) userVotes; // Store encrypted votes for verification
    }
    
    // Session management
    uint256 public sessionCount;
    mapping(uint256 => VotingSession) public sessions;
    
    address public owner;
    
    // Events
    event SessionCreated(uint256 indexed sessionId, string title, uint256 endTime);
    event VoteCast(uint256 indexed sessionId, address indexed voter);
    event SessionEnded(uint256 indexed sessionId);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    modifier sessionExists(uint256 sessionId) {
        require(sessionId < sessionCount, "Session does not exist");
        _;
    }
    
    modifier sessionActive(uint256 sessionId) {
        require(sessions[sessionId].isActive, "Session is not active");
        require(block.timestamp >= sessions[sessionId].startTime, "Session has not started");
        require(block.timestamp <= sessions[sessionId].endTime, "Session has ended");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        sessionCount = 0;
    }
    
    /// @notice Create a new voting session
    /// @param title The title of the voting session
    /// @param candidates Array of candidate names
    /// @param duration Duration of the voting session in seconds
    function createSession(
        string memory title,
        string[] memory candidates,
        uint256 duration
    ) public onlyOwner returns (uint256) {
        require(candidates.length > 0, "Must have at least one candidate");
        require(duration > 0, "Duration must be greater than 0");
        
        uint256 sessionId = sessionCount;
        VotingSession storage newSession = sessions[sessionId];
        
        newSession.title = title;
        newSession.startTime = block.timestamp;
        newSession.endTime = block.timestamp + duration;
        newSession.isActive = true;
        
        // Initialize candidates and encrypted vote counts
        for (uint256 i = 0; i < candidates.length; i++) {
            newSession.candidates.push(candidates[i]);
            newSession.encryptedVotes[i] = TFHE.asEuint32(0);
        }
        
        sessionCount++;
        
        emit SessionCreated(sessionId, title, newSession.endTime);
        return sessionId;
    }
    
    /// @notice Cast an encrypted vote for a candidate in a specific session
    /// @param sessionId The ID of the voting session
    /// @param encryptedVote The encrypted vote (candidate index)
    /// @dev The vote is encrypted on the client side and never revealed on-chain
    function vote(
        uint256 sessionId,
        einput encryptedVote,
        bytes calldata inputProof
    ) public sessionExists(sessionId) sessionActive(sessionId) {
        VotingSession storage session = sessions[sessionId];
        
        require(!session.hasVoted[msg.sender], "You have already voted in this session");
        
        // Convert input to encrypted uint32
        euint32 encryptedChoice = TFHE.asEuint32(encryptedVote, inputProof);
        
        // Store the encrypted vote
        session.userVotes[msg.sender] = encryptedChoice;
        
        // Homomorphically tally votes for each candidate
        for (uint256 i = 0; i < session.candidates.length; i++) {
            // Create encrypted comparison: encryptedChoice == i
            ebool isCandidate = TFHE.eq(encryptedChoice, TFHE.asEuint32(uint32(i)));
            
            // Increment the counter if this is the selected candidate
            session.encryptedVotes[i] = TFHE.add(
                session.encryptedVotes[i],
                TFHE.select(isCandidate, TFHE.asEuint32(1), TFHE.asEuint32(0))
            );
        }
        
        // Mark as voted
        session.hasVoted[msg.sender] = true;
        
        emit VoteCast(sessionId, msg.sender);
    }
    
    /// @notice End a voting session
    /// @param sessionId The ID of the session to end
    function endSession(uint256 sessionId) public onlyOwner sessionExists(sessionId) {
        sessions[sessionId].isActive = false;
        emit SessionEnded(sessionId);
    }
    
    /// @notice Get encrypted vote count for a specific candidate in a session
    /// @param sessionId The session ID
    /// @param candidateIndex The candidate index
    /// @return The encrypted vote count
    function getEncryptedVotes(uint256 sessionId, uint256 candidateIndex) 
        public view sessionExists(sessionId) returns (euint32) {
        require(candidateIndex < sessions[sessionId].candidates.length, "Invalid candidate");
        return sessions[sessionId].encryptedVotes[candidateIndex];
    }
    
    /// @notice Get the list of candidates for a session
    /// @param sessionId The session ID
    /// @return An array of candidate names
    function getCandidates(uint256 sessionId) public view sessionExists(sessionId) returns (string[] memory) {
        return sessions[sessionId].candidates;
    }
    
    /// @notice Get session details
    /// @param sessionId The session ID
    /// @return title The session title
    /// @return startTime The session start time
    /// @return endTime The session end time
    /// @return isActive Whether the session is active
    function getSessionInfo(uint256 sessionId) 
        public view sessionExists(sessionId) 
        returns (string memory title, uint256 startTime, uint256 endTime, bool isActive) {
        VotingSession storage session = sessions[sessionId];
        return (session.title, session.startTime, session.endTime, session.isActive);
    }
    
    /// @notice Check if an address has voted in a session
    /// @param sessionId The session ID
    /// @param voter The voter address
    /// @return Whether the address has voted
    function hasVoted(uint256 sessionId, address voter) 
        public view sessionExists(sessionId) returns (bool) {
        return sessions[sessionId].hasVoted[voter];
    }
    
    /// @notice Get all active sessions
    /// @return Array of active session IDs
    function getActiveSessions() public view returns (uint256[] memory) {
        uint256 activeCount = 0;
        
        // Count active sessions
        for (uint256 i = 0; i < sessionCount; i++) {
            if (sessions[i].isActive && block.timestamp <= sessions[i].endTime) {
                activeCount++;
            }
        }
        
        // Fill array with active session IDs
        uint256[] memory activeSessions = new uint256[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < sessionCount; i++) {
            if (sessions[i].isActive && block.timestamp <= sessions[i].endTime) {
                activeSessions[index] = i;
                index++;
            }
        }
        
        return activeSessions;
    }
    
    /// @notice Check if a specific user's vote can be decrypted (requires permission)
    /// @param sessionId The session ID
    /// @param voter The address of the voter
    /// @return The encrypted vote of the user
    function getUserVote(uint256 sessionId, address voter) 
        public view sessionExists(sessionId) returns (euint32) {
        require(msg.sender == voter, "Can only view your own vote");
        return sessions[sessionId].userVotes[voter];
    }
}

