"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flame, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { useContract } from "@/hooks/useContract";
import { useWeb3 } from "@/context/Web3Provider";
import type { Agent } from "@/config/contract";
import { COST_PER_USE } from "@/config/contract";

type TxState = "idle" | "pending" | "confirming" | "success" | "error";

interface BurnModalProps {
    isOpen: boolean;
    agent: Agent | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function BurnModal({ isOpen, agent, onClose, onSuccess }: BurnModalProps) {
    const contract = useContract();
    const { isConnected, isCorrectChain } = useWeb3();
    const [txState, setTxState] = useState<TxState>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    if (!agent) return null;

    const depreciation = agent.usageCount * COST_PER_USE;
    const refundAmount = agent.mintPrice > depreciation ? agent.mintPrice - depreciation : 0n;

    const handleBurn = async () => {
        if (!isConnected || !isCorrectChain) return;

        setTxState("pending");
        setErrorMsg("");

        try {
            const tx = await contract.burnAgent(agent.id);
            setTxState("confirming");
            await tx.wait();
            setTxState("success");
            setTimeout(() => {
                onSuccess();
                handleClose();
            }, 1500);
        } catch (err: any) {
            console.error("Burn failed:", err);
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
                                    style={{ background: "var(--gradient-burn)" }}
                                >
                                    <Flame size={18} color="white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[var(--text-primary)]">
                                        Burn Agent
                                    </h2>
                                    <p className="text-xs text-[var(--text-secondary)]">
                                        Destroy agent #{agent.id.toString()} for a refund
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
                                    Agent Burned!
                                </h3>
                                <p className="text-sm text-[var(--text-secondary)] mt-2">
                                    {ethers.formatEther(refundAmount)} OKB refunded to your wallet.
                                </p>
                            </motion.div>
                        ) : (
                            <>
                                {/* Warning */}
                                <div
                                    className="p-4 rounded-xl mb-5 flex items-start gap-3"
                                    style={{
                                        background: "rgba(249,115,22,0.06)",
                                        border: "1px solid rgba(249,115,22,0.15)",
                                    }}
                                >
                                    <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" color="var(--accent-orange)" />
                                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                        This action is <strong className="text-[var(--accent-orange)]">irreversible</strong>.
                                        The agent will be permanently destroyed.
                                    </p>
                                </div>

                                {/* Breakdown */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--text-secondary)]">Role</span>
                                        <span className="capitalize font-medium">{agent.role}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--text-secondary)]">Original Mint Price</span>
                                        <span className="font-mono">{ethers.formatEther(agent.mintPrice)} OKB</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--text-secondary)]">Total Uses</span>
                                        <span>{agent.usageCount.toString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--text-secondary)]">Depreciation</span>
                                        <span className="text-[var(--accent-red)]">
                                            -{ethers.formatEther(depreciation > agent.mintPrice ? agent.mintPrice : depreciation)} OKB
                                        </span>
                                    </div>
                                    <div className="border-t border-[rgba(100,100,180,0.1)] pt-3 flex justify-between text-sm">
                                        <span className="font-semibold text-[var(--text-primary)]">
                                            Refund Amount
                                        </span>
                                        <span className="font-bold text-lg gradient-text">
                                            {ethers.formatEther(refundAmount)} OKB
                                        </span>
                                    </div>
                                </div>

                                {/* Error */}
                                {errorMsg && (
                                    <div className="mb-4 p-3 rounded-lg text-xs text-[var(--accent-red)]" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
                                        {errorMsg}
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    onClick={handleBurn}
                                    disabled={txState !== "idle" || !isConnected || !isCorrectChain}
                                    className="btn-danger w-full flex items-center justify-center gap-2 py-3 text-sm"
                                >
                                    {txState === "pending" || txState === "confirming" ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            {txState === "pending" ? "Confirm in Wallet..." : "Burning..."}
                                        </>
                                    ) : (
                                        <>
                                            <Flame size={16} />
                                            Confirm Burn
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
