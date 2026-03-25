# Agent X - Production Deployment Guide

This guide details exactly how to deploy and host the full Agent X ecosystem (Smart Contracts, Marketplace Frontend, and Sovereign Terminal) for live use.

---

## 🌎 Architecture Overview

1. **Smart Contracts** (`x-agent-market/contracts`)
   - Deployed once to the **X Layer** Blockchain.
   - Functions as the single source of truth for assets, balances, and decay math.

2. **Marketplace Frontend** (`x-agent-market/frontend`)
   - Standard Next.js Client application.
   - Hosted on any modern frontend cloud (like Vercel).
   - Serves human users connecting via browser wallets.

3. **Sovereign Terminal** (`x-sovereign`)
   - Dynamic Next.js instance with a secure backend API (`/api/chat`).
   - Hosted on Vercel to preserve backend server functionality 24/7.

---

## 🛠️ Step 1: Deploy Smart Contract

You do not need to "run" a contract backend. Once deployed to the blockchain, the layer hosts it forever.

1. Navigate to the contract folder:
   ```bash
   cd x-agent-market/contracts
   ```
2. Set up your `.env`:
   - Make sure you have your Private Key containing **OKB** for gas fees.
   - Ensure `OPENAI_API_KEY` is present if you want to pre-empower seed agents.
3. Deploy to X Layer:
   ```bash
   # Add your deploy script network directive
   npx hardhat run scripts/deploy.js --network xlayer
   ```
4. Copy the resulting **Contract Address** and paste it into `config/contract.ts` in your frontend builds.

---

## 🌐 Step 2: Host the Frontends on Vercel (Recommended)

To host your Next.js applications so they run 24/7 without your computer being open:

### For both `x-agent-market/frontend` and `x-sovereign`:

1. **Push your code to GitHub**:
   - Create two separate Github repositories (one for the Marketplace, one for the Terminal).
   - Push your current local directories to them.

2. **Import to Vercel**:
   - Go to [Vercel.com](https://vercel.com) and log in with your GitHub account.
   - Click **Add New > Project**.
   - Import your repository.

3. **Configure Settings**:
   - **Build Settings**: Vercel automatically detects Next.js. Leave it as the default (`npm run build`).
   - **Environment Variables** (For Sovereign especially):
     - Add `OPENAI_API_KEY` under the variables tab.

4. **Deploy**:
   - Click deploy. Vercel will build your application and provide you with a live `.vercel.app` URL immediately.

---

## 🔌 Running Node Seeding

After the Marketplace contract is live, run your seed script to populate the marketplace with the pre-reasoning empowered assets:
```bash
node scripts/seed.js
```
This requires your local computer once just to broadcast the initialization data onto the newly deployed contract address. All future operations are pure Web3.
