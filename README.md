# Agent X Marketplace 🤖💼

**Agent X** is an on-chain AI Agent Marketplace built on **X Layer**. It allows users to Mint, Trade, and Burn AI agents. Each agent acts as an economic asset with utility-based depreciation, mirroring real-world asset decay models inside an autonomous agent economy.

---

## ⚠️ The Problem It Solves

Static NFTs or assets do not effectively model **utility-based depreciation**. 
When an AI agent is used (for execution, risk profiling, signaling, etc.), it incurs a virtual "wear and tear." 

To address this:
1.  **Backing Mechanics**: Agents are minted with a fixed backstop value (`mintFee`).
2.  **Usage Depreciation**: Every time an agent is called/used, its internal `usageCount` grows, decreasing its total redeemable value linearly.
3.  **Burn Mechanics**: Owners can "Burn" (destroy) an agent on-chain to receive a partial refund based on the remaining value, enforcing a real floor-price mechanic.

---

## 💡 Key Features

-   **Role-Based Modules**: Mint specialized agents: `Brain`, `Research`, `Security`, `Execution`, and `Economy`.
-   **Neural Core Tracking**: Dynamic visual metrics representing direct structural deterioration (Depreciation bar/Health).
-   **Autonomous Listings**: Secondary marketplace for trading agents dynamically.
-   **Parallel Fetch Pipeline**: High-performance optimization reducing RPC-load up to 80% using indexed role grouping data streams.

---

## 🛠️ Architecture & Tech Stack

### core components:
1.  **`contracts/`**: 
    -   `AgentMarket.sol`: Core contract managing ERC asset states, lists maps, structure validation and user payment refund streams logic safely securely without proxies directly connected.
2.  **`frontend/`**:
    -   **Framework**: Next.js 16 (App Router).
    -   **Styles Utilities**: Typescript, TailwindCSS & Framer motion layouts.
    -   **RPC/Nodes**: Ethers.js directly pulling batch structures over parallel async tasks loops.

---

## 🚀 Getting Started

### 1. Smart Contracts Setup
Navigate to the `contracts` folder:
```bash
cd contracts
npm install
# To Compile or deploy if adding triggers
# npx hardhat compile
```

### 2. Frontend setup
Navigate to the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) inside your browser to interact with the marketplace interface Dashboard.

---

## 🎨 Design Theme
The layout uses a **sleek dark-mode workspace panel template style**. Powered via deep purple core gradients visual flows maximizing smooth UI performance with subtle micro-motion dynamic layouts scaling components.
