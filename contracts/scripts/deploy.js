const hre = require("hardhat");

async function main() {
    console.log("Deploying AgentMarket contract to X Layer...");

    const AgentMarket = await hre.ethers.getContractFactory("AgentMarket");
    const agentMarket = await AgentMarket.deploy();

    await agentMarket.waitForDeployment();

    const address = await agentMarket.getAddress();
    console.log(`🚀 AgentMarket deployed successfully to: ${address}`);
    console.log(`You can now give this address to your partner building X-Sovereign.`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
