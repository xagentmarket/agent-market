import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
    solidity: "0.8.24",
    networks: {
        // X Layer Mainnet
        xlayer: {
            url: "https://rpc.xlayer.tech",
            accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
            chainId: 196,
        },
        // X Layer Testnet
        xlayer_testnet: {
            url: "https://testrpc.xlayer.tech" || "",
            accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
            chainId: 195,
        }
    }
};

export default config;
