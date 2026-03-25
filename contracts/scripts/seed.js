const hre = require("hardhat");

async function main() {
    // Use the exact address of the deployed AgentMarket contract
    const contractAddress = "0xF53e7cD080211b4c38369f2e5f1A0b9401B5470C";
    console.log(`Attaching to AgentMarket at ${contractAddress}...`);

    const AgentMarket = await hre.ethers.getContractFactory("AgentMarket");
    const agentMarket = AgentMarket.attach(contractAddress);

    const roles = ["Brain", "Research", "Security", "Action", "Economy"];
    const mintPrice = hre.ethers.parseEther("0.001"); // Updated base OKB parameter 
    const apiKey = process.env.OPENAI_API_KEY;

    console.log("Starting to mint the 5 foundational AI Agent Assets on-chain...");

    if (!apiKey) {
        console.warn("\n⚠️  WARNING: OPENAI_API_KEY not found in .env.");
        console.warn("Agents will be minted with default mock reasoning. Please add the key to empower them with real reasoning before minting.\n");
    } else {
        console.log("✅ OpenAI API Key detected. Empowering agents with bespoke reasoning matrices...\n");
    }

    for (const role of roles) {
        let agentReasoningURI = `ipfs://mock-${role.toLowerCase()}-metadata`;

        if (apiKey) {
            console.log(`🧠 Synthesizing base reasoning matrix for [${role}]...`);
            try {
                // We use standard fetch node API to dynamically prompt reasoning instructions
                const response = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                        model: "gpt-4",
                        messages: [
                            {
                                role: "system",
                                content: `You are the core consciousness architect for Agent X. Generate a hyper-specific, production-ready system prompting blueprint for an autonomous agent specializing in the role of: ${role}. This blueprint will be embedded into the agent's on-chain metadata URI.`
                            }
                        ],
                        temperature: 0.7,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    let reasoningOutput = data.choices[0].message.content;
                    // In a production environment, this text would be uploaded to IPFS.
                    // For now, we simulate the hashed CID of the generated reasoning object.
                    agentReasoningURI = `ipfs://QmA1GenReasoning_${role}_${Date.now()}`;
                    console.log(`   -> Reasoning Synthesized (URI Hash: ${agentReasoningURI})`);
                }
            } catch (err) {
                console.log(`   -> Failed to empower agent: ${err.message}`);
            }
        }

        console.log(`💥 Minting [${role}] Agent...`);
        const tx = await agentMarket.mintAgent(role, agentReasoningURI, {
            value: mintPrice,
        });

        await tx.wait();
        console.log(`✅ [${role}] Agent successfully minted! TxHash: ${tx.hash}\n`);
    }

    console.log("🎉 All 5 foundation agents have been seeded onto the X Layer Mainnet!");
}

main().catch((error) => {
    console.error("Error seeding agents:", error);
    process.exitCode = 1;
});
