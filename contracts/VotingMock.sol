// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title A mock voting contract with multi-session support
/// @author ZamaVote Team
/// @notice This contract simulates the voting process without FHE with support for multiple voting sessions
contract VotingMock {
    struct VotingSession {
        string title;
        string[] candidates;
        mapping(string => uint256) results;
        mapping(address => bool) hasVoted;
        mapping(address => uint256) votedFor; // Track which candidate index the user voted for
        uint256 startTime;
        uint256 endTime;
        bool isActive;
    }

    mapping(uint256 => VotingSession) public sessions;
    uint256 public sessionCount;

    constructor() {
        // Create a default voting session
        createSession("Favorite Cryptocurrency Poll", 60 days);
        
        // Add default candidates to session 0
        sessions[0].candidates.push("Bitcoin");
        sessions[0].candidates.push("Ethereum");
        sessions[0].candidates.push("Solana");
    }

    /// @notice Create a new voting session
    /// @param title The title of the voting session
    /// @param duration Duration in seconds
    function createSession(string memory title, uint256 duration) public returns (uint256) {
        uint256 newSessionId = sessionCount;
        VotingSession storage newSession = sessions[newSessionId];
        
        newSession.title = title;
        newSession.startTime = block.timestamp;
        newSession.endTime = block.timestamp + duration;
        newSession.isActive = true;
        
        sessionCount++;
        return newSessionId;
    }

    /// @notice Add a candidate to a session
    /// @param sessionId The ID of the session
    /// @param candidateName The name of the candidate
    function addCandidate(uint256 sessionId, string memory candidateName) public {
        require(sessionId < sessionCount, "Invalid session ID");
        sessions[sessionId].candidates.push(candidateName);
    }

    /// @notice Allows a user to vote for a candidate in a specific session
    /// @param sessionId The ID of the voting session
    /// @param candidateIndex The index of the candidate to vote for
    function vote(uint256 sessionId, uint256 candidateIndex) public {
        require(sessionId < sessionCount, "Invalid session ID");
        VotingSession storage session = sessions[sessionId];
        
        require(session.isActive, "Voting session is not active");
        require(block.timestamp < session.endTime, "Voting period has ended");
        require(!session.hasVoted[msg.sender], "You have already voted in this session");
        require(candidateIndex < session.candidates.length, "Invalid candidate");

        session.hasVoted[msg.sender] = true;
        session.votedFor[msg.sender] = candidateIndex;
        session.results[session.candidates[candidateIndex]]++;
    }

    /// @notice Get the list of candidates for a specific session
    /// @param sessionId The ID of the voting session
    /// @return An array of candidate names
    function getCandidates(uint256 sessionId) public view returns (string[] memory) {
        require(sessionId < sessionCount, "Invalid session ID");
        return sessions[sessionId].candidates;
    }

    /// @notice Get the results of the vote for a specific candidate in a session
    /// @param sessionId The ID of the voting session
    /// @param candidateIndex The index of the candidate
    /// @return The number of votes for the candidate
    function getResult(uint256 sessionId, uint256 candidateIndex) public view returns (uint256) {
        require(sessionId < sessionCount, "Invalid session ID");
        require(candidateIndex < sessions[sessionId].candidates.length, "Invalid candidate");
        return sessions[sessionId].results[sessions[sessionId].candidates[candidateIndex]];
    }

    /// @notice Check if a user has voted in a specific session
    /// @param sessionId The ID of the voting session
    /// @param voter The address of the voter
    /// @return True if the voter has voted, false otherwise
    function hasVoted(uint256 sessionId, address voter) public view returns (bool) {
        require(sessionId < sessionCount, "Invalid session ID");
        return sessions[sessionId].hasVoted[voter];
    }

    /// @notice Get which candidate a user voted for in a specific session
    /// @param sessionId The ID of the voting session
    /// @param voter The address of the voter
    /// @return The index of the candidate the user voted for
    function getVotedCandidate(uint256 sessionId, address voter) public view returns (uint256) {
        require(sessionId < sessionCount, "Invalid session ID");
        require(sessions[sessionId].hasVoted[voter], "User has not voted in this session");
        return sessions[sessionId].votedFor[voter];
    }

    /// @notice Get session information
    /// @param sessionId The ID of the voting session
    /// @return title The title of the session
    /// @return startTime The start time of the session
    /// @return endTime The end time of the session
    /// @return isActive Whether the session is active
    function getSessionInfo(uint256 sessionId) public view returns (
        string memory title,
        uint256 startTime,
        uint256 endTime,
        bool isActive
    ) {
        require(sessionId < sessionCount, "Invalid session ID");
        VotingSession storage session = sessions[sessionId];
        return (session.title, session.startTime, session.endTime, session.isActive);
    }

    /// @notice Get all active sessions
    /// @return An array of active session IDs
    function getActiveSessions() public view returns (uint256[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < sessionCount; i++) {
            if (sessions[i].isActive && block.timestamp < sessions[i].endTime) {
                activeCount++;
            }
        }

        uint256[] memory activeSessions = new uint256[](activeCount);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < sessionCount; i++) {
            if (sessions[i].isActive && block.timestamp < sessions[i].endTime) {
                activeSessions[currentIndex] = i;
                currentIndex++;
            }
        }

        return activeSessions;
    }

    /// @notice End a voting session
    /// @param sessionId The ID of the voting session
    function endSession(uint256 sessionId) public {
        require(sessionId < sessionCount, "Invalid session ID");
        sessions[sessionId].isActive = false;
    }
}
