"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";
import { ethers } from "ethers";
import { XLAYER_CHAIN } from "@/config/contract";

interface Web3ContextType {
    provider: ethers.BrowserProvider | null;
    signer: ethers.Signer | null;
    account: string | null;
    chainId: number | null;
    isConnected: boolean;
    isCorrectChain: boolean;
    connect: () => Promise<void>;
    disconnect: () => void;
    switchChain: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType>({
    provider: null,
    signer: null,
    account: null,
    chainId: null,
    isConnected: false,
    isCorrectChain: false,
    connect: async () => { },
    disconnect: () => { },
    switchChain: async () => { },
});

export const useWeb3 = () => useContext(Web3Context);

export default function Web3Provider({ children }: { children: ReactNode }) {
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const [chainId, setChainId] = useState<number | null>(null);

    const isConnected = !!account;
    const isCorrectChain = chainId === parseInt(XLAYER_CHAIN.chainId, 16);

    const connect = useCallback(async () => {
        const ethereum = (window as any).okxwallet || (window as any).ethereum;
        if (!ethereum) {
            alert("Please install OKX Wallet or MetaMask to use Agent X.");
            return;
        }

        try {
            const browserProvider = new ethers.BrowserProvider(ethereum);
            await browserProvider.send("eth_requestAccounts", []);
            const walletSigner = await browserProvider.getSigner();
            const address = await walletSigner.getAddress();
            const network = await browserProvider.getNetwork();

            setProvider(browserProvider);
            setSigner(walletSigner);
            setAccount(address);
            setChainId(Number(network.chainId));
        } catch (err) {
            console.error("Failed to connect wallet:", err);
        }
    }, []);

    const disconnect = useCallback(() => {
        setProvider(null);
        setSigner(null);
        setAccount(null);
        setChainId(null);
    }, []);

    const switchChain = useCallback(async () => {
        const ethereum = (window as any).okxwallet || (window as any).ethereum;
        if (!ethereum) return;

        try {
            await ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: XLAYER_CHAIN.chainId }],
            });
        } catch (switchError: any) {
            // Chain not added — add it
            if (switchError.code === 4902) {
                try {
                    await ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [XLAYER_CHAIN],
                    });
                } catch (addError) {
                    console.error("Failed to add X Layer:", addError);
                }
            }
        }
    }, []);

    // Listen for account and chain changes
    useEffect(() => {
        const ethereum = (window as any).okxwallet || (window as any).ethereum;
        if (!ethereum) return;

        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length === 0) {
                disconnect();
            } else {
                setAccount(accounts[0]);
                // Refresh provider/signer
                const browserProvider = new ethers.BrowserProvider(ethereum);
                setProvider(browserProvider);
                browserProvider.getSigner().then(setSigner);
            }
        };

        const handleChainChanged = (newChainId: string) => {
            setChainId(parseInt(newChainId, 16));
            // Refresh provider/signer on chain change
            const browserProvider = new ethers.BrowserProvider(ethereum);
            setProvider(browserProvider);
            browserProvider.getSigner().then(setSigner);
        };

        ethereum.on("accountsChanged", handleAccountsChanged);
        ethereum.on("chainChanged", handleChainChanged);

        return () => {
            ethereum.removeListener("accountsChanged", handleAccountsChanged);
            ethereum.removeListener("chainChanged", handleChainChanged);
        };
    }, [disconnect]);

    return (
        <Web3Context.Provider
            value={{
                provider,
                signer,
                account,
                chainId,
                isConnected,
                isCorrectChain,
                connect,
                disconnect,
                switchChain,
            }}
        >
            {children}
        </Web3Context.Provider>
    );
}
