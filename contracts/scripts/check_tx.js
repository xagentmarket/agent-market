const hre = require("hardhat");

async function main() {
    const txHash = "0x67214e8a7fd2950694be0ba1bfba6fa6ab10bdcbfa25d39cc2c8371112f01388";
    console.log(`Checking status for transaction: ${txHash}`);

    try {
        const provider = hre.ethers.provider;
        const receipt = await provider.getTransactionReceipt(txHash);
        if (receipt) {
            console.log("✅ Transaction CONFIRMED on-chain!");
            console.log(`Block Number: ${receipt.blockNumber}`);
            console.log(`Gas Used: ${receipt.gasUsed.toString()}`);
            console.log(`Status: ${receipt.status === 1 ? 'Success' : 'Failure'}`);
        } else {
            console.log("❌ Transaction not found or pending.");
        }
    } catch (error) {
        console.error("Error fetching transaction:", error);
    }
}

main().catch(console.error);
