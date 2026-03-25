# X-Sovereign Automated Integration Guide

This guide provides the exact smart-contract implementations needed to allow the **Agent Sovereign Terminal** (or any other protocol interface) to **autonomously mint and burn** foundational agents directly from the **Agent X** marketplace without human intervention.

## Setup Requirements

Agent Sovereign operates as an intelligent Orchestrator. It uses its **own OpenAI API Key** to process user intents and break them down into steps. When Sovereign encounters a specific task requiring specialized capability (like Deep Research or Smart Contract Security), it connects to the Agent X Smart Contract to autonomously hire (mint) a pre-empowered Agent X instance.

Extract the deployed `AgentMarket` ABI and use `ethers.js` attached to Sovereign's autonomous backend wallet. Ensure the Sovereign treasury holds enough OKB.

```typescript
import { ethers } from "ethers";
import AgentMarketABI from "./AgentMarket.json";

// Sovereign's OpenAI Configuration
const openaiApiKey = process.env.OPENAI_API_KEY; 

// Autonomous Sovereign Treasury Wallet
const provider = new ethers.JsonRpcProvider("https://rpc.xlayer.tech");
const sovereignWallet = new ethers.Wallet(process.env.SOVEREIGN_PRIVATE_KEY, provider);

// Agent X Market Address on X Layer
const AGENT_MARKET_ADDRESS = "0xF53e7cD080211b4c38369f2e5f1A0b9401B5470C";
const agentXContract = new ethers.Contract(AGENT_MARKET_ADDRESS, AgentMarketABI, sovereignWallet);
```

---

## 1. Autonomous Agent Minting
The Agent Sovereign backend can programmatically mint one of the 5 foundational AI Agents (`"Brain"|"Research"|"Security"|"Action"|"Economy"`) whenever required. It must send the fixed **0.001 OKB fee** via `msg.value`. 

If Agent X operates with its own `.env` key, the `metadataURI` can link to pre-empowered reasoning matrices.

```typescript
async function autonomousMint(role: string, metadataURI: string) {
    try {
        console.log(`Sovereign AI is autonomously minting the ${role} agent...`);
        
        // Exact fee required by the Agent X smart contract
        const fixedMintFee = ethers.parseEther("0.001");

        // Execute automated mint
        const tx = await agentXContract.mintAgent(role, metadataURI, {
            value: fixedMintFee
        });

        // Await confirmation
        const receipt = await tx.wait();
        
        // Extract Agent ID from events if successfully minted
        const mintEvent = receipt.logs.find(log => log.eventName === 'AgentMinted');
        const agentId = mintEvent.args.agentId.toString();

        console.log(`Success! Hired new ${role} Agent (ID: ${agentId}).`);
        return agentId;

    } catch (error) {
        console.error("Critical Failure in Autonomous On-Chain Minting:", error);
    }
}

// Example Execution
// await autonomousMint("Security", "ipfs://Qmbesquared...");
```

---

## 2. Autonomous Agent Burning (Refund Extraction)
When the Sovereign terminal no longer requires an agent, or it has been extensively used and its intrinsic value is depreciating, the Sovereign terminal can autonomously burn the asset to extract the remaining liquid `OKB` from the Agent Market treasury.

```typescript
async function autonomousBurn(agentId: string | number) {
    try {
        console.log(`Sovereign AI discarding Agent ID: ${agentId} to reclaim efficiency funds...`);

        // Execute automated burn
        const tx = await agentXContract.burnAgent(agentId);

        // Await confirmation
        const receipt = await tx.wait();

        // Extract Refund Data 
        const burnEvent = receipt.logs.find(log => log.eventName === 'AgentBurned');
        const refundAmountWei = burnEvent.args.refundAmount;
        const refundOKB = ethers.formatEther(refundAmountWei);

        console.log(`Successfully burned Agent. Sovereign Treasury reclaimed: ${refundOKB} OKB`);
        return refundOKB;

    } catch (error) {
        console.error("Critical Failure in Autonomous Burning Sequence:", error);
    }
}

// Example Execution
// await autonomousBurn(2);
```

## How Agent X Empowers Agents
Our integration design stipulates that before `autonomousMint()` is called—or directly inside the Agent X backend seeding logic—an OpenAI prompt should generate the specific operational capabilities of that agent profile. This logic is then securely pinned to IPFS, and its URL (`ipfs://...`) is sent as the `metadataURI` during the `mintAgent()` call. This ensures the AI Agent inherits deep operational reasoning natively from the blockchain instance.
