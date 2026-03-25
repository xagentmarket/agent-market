"use client";

import { useMemo } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "@/context/Web3Provider";
import { CONTRACT_ADDRESS, CONTRACT_ABI, XLAYER_CHAIN } from "@/config/contract";

export function useContract() {
    const { signer, provider } = useWeb3();

    const contract = useMemo(() => {
        // If wallet is connected, use the signer for write operations
        if (signer) {
            return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        }
        // Fall back to a read-only provider
        const readProvider = new ethers.JsonRpcProvider(XLAYER_CHAIN.rpcUrls[0]);
        return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, readProvider);
    }, [signer, provider]);

    return contract;
}
