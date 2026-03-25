// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AgentMarket {
    struct Agent {
        uint256 id;
        address creator;
        address owner;
        uint256 mintPrice;
        uint256 usageCount;
        bool listed;
        uint256 price;
        string role;
        string metadataURI;
    }

    address public immutable marketOwner;
    uint256 private _agentIds;
    
    uint256 public constant mintFee = 0.001 ether;
    uint256 public constant costPerUse = 0.0001 ether; // Depreciation cost per use

    mapping(uint256 => Agent) public agents;
    mapping(uint256 => bool) public agentExists;
    uint256[] public allAgentIds;

    event AgentMinted(uint256 indexed agentId, address indexed creator, string role);
    event AgentListed(uint256 indexed agentId, uint256 price);
    event AgentBought(uint256 indexed agentId, address indexed oldOwner, address indexed newOwner, uint256 price);
    event AgentUsed(uint256 indexed agentId, address caller);
    event AgentBurned(uint256 indexed agentId, address indexed owner, uint256 refundAmount);

    constructor() {
        marketOwner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == marketOwner, "Not the marketplace owner");
        _;
    }

    /// @notice Mint a new AI Agent on-chain
    /// @param role The role of the agent (e.g. "signal", "security", "execution")
    /// @param metadataURI Off-chain metadata URI (IPFS)
    function mintAgent(string memory role, string memory metadataURI) external payable {
        require(msg.value == mintFee, "Must pay exactly 0.001 OKB to mint agent");

        _agentIds++;
        uint256 newAgentId = _agentIds;

        Agent memory newAgent = Agent({
            id: newAgentId,
            creator: msg.sender,
            owner: msg.sender,
            mintPrice: mintFee,
            usageCount: 0,
            listed: false,
            price: 0,
            role: role,
            metadataURI: metadataURI
        });

        agents[newAgentId] = newAgent;
        agentExists[newAgentId] = true;
        allAgentIds.push(newAgentId);

        emit AgentMinted(newAgentId, msg.sender, role);
    }

    /// @notice List an agent for sale on the marketplace
    function listAgent(uint256 agentId, uint256 price) external {
        require(agentExists[agentId], "Agent does not exist");
        require(agents[agentId].owner == msg.sender, "Not the agent owner");
        require(price > 0, "Price must be greater than zero");

        agents[agentId].listed = true;
        agents[agentId].price = price;

        emit AgentListed(agentId, price);
    }

    /// @notice Buy a listed agent
    function buyAgent(uint256 agentId) external payable {
        require(agentExists[agentId], "Agent does not exist");
        
        Agent storage agent = agents[agentId];
        require(agent.listed, "Agent is not listed for sale");
        require(msg.value == agent.price, "Incorrect ETH sent");
        require(agent.owner != msg.sender, "Cannot buy your own agent");

        address previousOwner = agent.owner;
        agent.owner = msg.sender;
        agent.listed = false;

        // Pay the seller
        (bool success, ) = payable(previousOwner).call{value: msg.value}("");
        require(success, "Transfer failed");

        emit AgentBought(agentId, previousOwner, msg.sender, msg.value);
    }

    /// @notice Called by external execution systems (like X-Sovereign) when an agent is used
    /// Increment usage count which reduces its total value
    function useAgent(uint256 agentId) external {
        require(agentExists[agentId], "Agent does not exist");
        agents[agentId].usageCount++;
        emit AgentUsed(agentId, msg.sender);
    }

    /// @notice Burn the agent and receive a partial refund based on usage decay
    function burnAgent(uint256 agentId) external {
        require(agentExists[agentId], "Agent does not exist");
        require(agents[agentId].owner == msg.sender, "Not the agent owner");

        Agent memory agent = agents[agentId];
        
        uint256 depreciation = agent.usageCount * costPerUse;
        uint256 refundAmount = 0;
        
        if (agent.mintPrice > depreciation) {
            refundAmount = agent.mintPrice - depreciation;
        }

        // Remove agent
        delete agents[agentId];
        agentExists[agentId] = false;

        // Refund owner from contract balance
        if (refundAmount > 0) {
            require(address(this).balance >= refundAmount, "Contract has insufficient balance for refund");
            (bool success, ) = payable(msg.sender).call{value: refundAmount}("");
            require(success, "Refund transfer failed");
        }

        emit AgentBurned(agentId, msg.sender, refundAmount);
    }

    /// @notice Get a list of agents filtered by role (e.g. "signal", "security")
    function getAgentsByRole(string memory role) external view returns (Agent[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < allAgentIds.length; i++) {
            uint256 id = allAgentIds[i];
            if (agentExists[id] && keccak256(bytes(agents[id].role)) == keccak256(bytes(role))) {
                count++;
            }
        }

        Agent[] memory matchingAgents = new Agent[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < allAgentIds.length; i++) {
            uint256 id = allAgentIds[i];
            if (agentExists[id] && keccak256(bytes(agents[id].role)) == keccak256(bytes(role))) {
                matchingAgents[index] = agents[id];
                index++;
            }
        }

        return matchingAgents;
    }

    /// @notice Allows the market owner to withdraw accumulated fees from agent depreciation
    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        (bool success, ) = payable(marketOwner).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
}

