"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag, Loader2, CheckCircle2 } from "lucide-react";
import { useContract } from "@/hooks/useContract";
import { useWeb3 } from "@/context/Web3Provider";
import type { Agent } from "@/config/contract";

type TxState = "idle" | "pending" | "confirming" | "success" | "error";

interface ListModalProps {
    isOpen: boolean;
    agent: Agent | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ListModal({ isOpen, agent, onClose, onSuccess }: ListModalProps) {
    const contract = useContract();
    const { isConnected, isCorrectChain } = useWeb3();
    const [price, setPrice] = useState("");
    const [txState, setTxState] = useState<TxState>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    if (!agent) return null;

    const handleList = async () => {
        if (!isConnected || !isCorrectChain) return;
        if (!price || parseFloat(price) <= 0) {
            setErrorMsg("Price must be greater than 0.");
            return;
        }

        setTxState("pending");
        setErrorMsg("");

        try {
            const priceWei = ethers.parseEther(price);
            const tx = await contract.listAgent(agent.id, priceWei);
            setTxState("confirming");
            await tx.wait();
            setTxState("success");
            setTimeout(() => {
                onSuccess();
                handleClose();
            }, 1500);
        } catch (err: any) {
            console.error("List failed:", err);
            setErrorMsg(err?.reason || err?.message || "Transaction failed");
            setTxState("error");
        }
    };

    const handleClose = () => {
        setPrice("");
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
                                    style={{ background: "rgba(16,185,129,0.15)", color: "var(--accent-blue)" }}
                                >
                                    <Tag size={18} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[var(--text-primary)]">
                                        List Agent
                                    </h2>
                                    <p className="text-xs text-[var(--text-secondary)]">
                                        Sell agent #{agent.id.toString()} on the marketplace
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
                                    Agent Listed!
                                </h3>
                                <p className="text-sm text-[var(--text-secondary)] mt-2">
                                    Your {agent.role} agent is now on the marketplace.
                                </p>
                            </motion.div>
                        ) : (
                            <>
                                {/* Agent Info */}
                                <div
                                    className="p-4 rounded-xl mb-5"
                                    style={{
                                        background: "rgba(30,30,60,0.4)",
                                        border: "1px solid var(--border-default)",
                                    }}
                                >
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-[var(--text-secondary)]">Agent</span>
                                        <span className="capitalize font-medium">{agent.role} #{agent.id.toString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-[var(--text-secondary)]">Mint Price</span>
                                        <span className="font-mono">{ethers.formatEther(agent.mintPrice)} OKB</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--text-secondary)]">Uses</span>
                                        <span>{agent.usageCount.toString()}</span>
                                    </div>
                                </div>

                                {/* Price input */}
                                <div className="mb-6">
                                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                                        Listing Price (OKB)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.001"
                                        min="0"
                                        className="input"
                                        placeholder="0.5"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        disabled={txState !== "idle"}
                                    />
                                </div>

                                {/* Error */}
                                {errorMsg && (
                                    <div className="mb-4 p-3 rounded-lg text-xs text-[var(--accent-red)]" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
                                        {errorMsg}
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    onClick={handleList}
                                    disabled={txState !== "idle" || !isConnected || !isCorrectChain}
                                    className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                                >
                                    {txState === "pending" || txState === "confirming" ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            {txState === "pending" ? "Confirm in Wallet..." : "Listing..."}
                                        </>
                                    ) : (
                                        <>
                                            <Tag size={16} />
                                            List for Sale
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
