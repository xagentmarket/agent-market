# GitHub Repository Push Guide

Follow these exact terminal commands to securely bundle and push your local projects into GitHub repositories for submitting and hosting.

---

## 💻 Step 1: Create Repositories on GitHub
1. Go to **[GitHub.com](https://github.com/)** and log into your dashboard.
2. Click the green **New** button in the top left.
3. Create two **Public** repositories:
   - Name one `agent-x-marketplace`
   - Name the second `agent-sovereign-terminal`
4. **DO NOT** initialize with a README, `.gitignore`, or License. Leave them blank.

---

## 📂 Step 2: Push Agent X Marketplace

Execute these commands inside your **Marketplace** folder. 
*(Note: We will bundle the `frontend` and `contracts` directories into ONE git repo for simplicity).*

1. Navigate into the parent directory:
   ```bash
   cd /Users/user/.gemini/antigravity/scratch/x-agent-market
   ```
2. Initialize and stage files:
   ```bash
   git init
   git add .
   git commit -m "Initialize Agent X Marketplace"
   ```
3. Link and Push to your GitHub repository:
   *(Replace YOUR_USERNAME with your GitHub profile handle)*
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/agent-x-marketplace.git
   git push -u origin main
   ```

---

## 📂 Step 3: Push Sovereign Terminal

Execute these commands inside your **Sovereign** folder.

1. Navigate into the sovereign directory:
   ```bash
   cd /Users/user/.gemini/antigravity/scratch/x-sovereign
   ```
2. Initialize and stage files:
   ```bash
   git init
   git add .
   git commit -m "Initialize X-Sovereign Terminal"
   ```
3. Link and Push to your GitHub repository:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/agent-sovereign-terminal.git
   git push -u origin main
   ```

---

## 🚨 Critical Note on Credentials

**DO NOT** push your raw `.env` files containing your PRIVATE_KEY or OPENAI_API_KEY to GitHub. 
Both projects already include a `.gitignore` that prevents your environment credentials from leaking into your profile publicly. You will declare those keys inside Vercel's control panel securely later.
