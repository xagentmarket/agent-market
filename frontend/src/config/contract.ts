import { ethers } from "ethers";
import ContractJSON from "./AgentMarket.json";

export const CONTRACT_ADDRESS = "0xF53e7cD080211b4c38369f2e5f1A0b9401B5470C";
export const CONTRACT_ABI = ContractJSON.abi;
export const CHAIN_ID = 196; // X Layer Mainnet

export const XLAYER_CHAIN = {
    chainId: "0xc4", // 196 in hex
    chainName: "X Layer Mainnet",
    nativeCurrency: { name: "OKB", symbol: "OKB", decimals: 18 },
    rpcUrls: ["https://rpc.xlayer.tech"],
    blockExplorerUrls: ["https://www.oklink.com/xlayer"],
};

export const COST_PER_USE = ethers.parseEther("0.0001");
export const MINT_FEE = ethers.parseEther("0.001");

export type AgentRole = "security" | "execution" | "research" | "economy" | "brain";
export const AGENT_ROLES: AgentRole[] = ["brain", "research", "security", "execution", "economy"];

export const AGENT_REASONING_URIS: Record<AgentRole, string> = {
    "brain": "/agents/brain.png",
    "research": "/agents/research.png",
    "security": "/agents/security.png",
    "execution": "/agents/execution.png",
    "economy": "/agents/economy.png",
};

export interface Agent {
    id: bigint;
    creator: string;
    owner: string;
    mintPrice: bigint;
    usageCount: bigint;
    listed: boolean;
    price: bigint;
    role: string;
    metadataURI: string;
}
