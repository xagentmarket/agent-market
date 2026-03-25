"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Loader2, CheckCircle2 } from "lucide-react";
import { useContract } from "@/hooks/useContract";
import { useWeb3 } from "@/context/Web3Provider";
import type { Agent } from "@/config/contract";

type TxState = "idle" | "pending" | "confirming" | "success" | "error";

interface BuyModalProps {
    isOpen: boolean;
    agent: Agent | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function BuyModal({ isOpen, agent, onClose, onSuccess }: BuyModalProps) {
    const contract = useContract();
    const { isConnected, isCorrectChain } = useWeb3();
    const [txState, setTxState] = useState<TxState>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    if (!agent) return null;

    const handleBuy = async () => {
        if (!isConnected || !isCorrectChain) return;

        setTxState("pending");
        setErrorMsg("");

        try {
            const tx = await contract.buyAgent(agent.id, { value: agent.price });
            setTxState("confirming");
            await tx.wait();
            setTxState("success");
            setTimeout(() => {
                onSuccess();
                handleClose();
            }, 1500);
        } catch (err: any) {
            console.error("Buy failed:", err);
            setErrorMsg(err?.reason || err?.message || "Transaction failed");
            setTxState("error");
        }
    };

    const handleClose = () => {
        setTxState("idle");
        setErrorMsg("");
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="modal-backdrop"
                    onClick={(e) => e.target === e.currentTarget && txState === "idle" && handleClose()}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="modal-content"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: "var(--gradient-primary)" }}
                                >
                                    <ShoppingCart size={18} color="white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[var(--text-primary)]">
                                        Buy Agent
                                    </h2>
                                    <p className="text-xs text-[var(--text-secondary)]">
                                        Acquire agent #{agent.id.toString()} from the marketplace
                                    </p>
                                </div>
                            </div>
                            {txState === "idle" && (
                                <button
                                    onClick={handleClose}
                                    className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                                >
                                    <X size={18} color="var(--text-muted)" />
                                </button>
                            )}
                        </div>

                        {txState === "success" ? (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center py-8"
                            >
                                <CheckCircle2 size={48} className="mx-auto mb-4" color="#10B981" />
                                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                                    Agent Acquired!
                                </h3>
                                <p className="text-sm text-[var(--text-secondary)] mt-2">
                                    The {agent.role} agent is now yours.
                                </p>
                            </motion.div>
                        ) : (
                            <>
                                {/* Agent Details */}
                                <div
                                    className="p-4 rounded-xl mb-5 space-y-2"
                                    style={{
                                        background: "rgba(30,30,60,0.4)",
                                        border: "1px solid var(--border-default)",
                                    }}
                                >
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--text-secondary)]">Role</span>
                                        <span className="capitalize font-medium">{agent.role}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--text-secondary)]">Owner</span>
                                        <span className="font-mono text-xs">
                                            {agent.owner.slice(0, 6)}...{agent.owner.slice(-4)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--text-secondary)]">Uses</span>
                                        <span>{agent.usageCount.toString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--text-secondary)]">Mint Price</span>
                                        <span className="font-mono">{ethers.formatEther(agent.mintPrice)} OKB</span>
                                    </div>
                                </div>

                                {/* Price */}
                                <div
                                    className="p-4 rounded-xl mb-6 flex justify-between items-center"
                                    style={{
                                        background: "rgba(6,182,212,0.06)",
                                        border: "1px solid rgba(6,182,212,0.15)",
                                    }}
                                >
                                    <span className="text-sm font-medium text-[var(--text-secondary)]">Total Price</span>
                                    <span className="text-xl font-bold gradient-text">
                                        {ethers.formatEther(agent.price)} OKB
                                    </span>
                                </div>

                                {/* Error */}
                                {errorMsg && (
                                    <div className="mb-4 p-3 rounded-lg text-xs text-[var(--accent-red)]" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
                                        {errorMsg}
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    onClick={handleBuy}
                                    disabled={txState !== "idle" || !isConnected || !isCorrectChain}
                                    className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                                >
                                    {txState === "pending" || txState === "confirming" ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            {txState === "pending" ? "Confirm in Wallet..." : "Processing..."}
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart size={16} />
                                            Buy for {ethers.formatEther(agent.price)} OKB
                                        </>
                                    )}
                                </button>

                                {!isConnected && (
                                    <p className="text-xs text-[var(--accent-orange)] text-center mt-3">
                                        Connect your wallet to buy.
                                    </p>
                                )}
                                {isConnected && !isCorrectChain && (
                                    <p className="text-xs text-[var(--accent-orange)] text-center mt-3">
                                        Switch to X Layer to buy.
                                    </p>
                                )}
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
