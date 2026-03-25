"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { useContract } from "@/hooks/useContract";
import { useWeb3 } from "@/context/Web3Provider";
import { AGENT_ROLES, MINT_FEE, AGENT_REASONING_URIS, type AgentRole } from "@/config/contract";

type TxState = "idle" | "pending" | "confirming" | "success" | "error";

interface MintModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function MintModal({ isOpen, onClose, onSuccess }: MintModalProps) {
    const contract = useContract();
    const { isConnected, isCorrectChain } = useWeb3();

    const [role, setRole] = useState<AgentRole>('brain');
    const [txState, setTxState] = useState<TxState>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleMint = async () => {
        if (!isConnected || !isCorrectChain) return;

        setTxState("pending");
        setErrorMsg("");

        try {
            // Auto-map the URI
            const assignedURI = AGENT_REASONING_URIS[role];

            // Trigger Mint Transaction
            const tx = await contract.mintAgent(role, assignedURI, { value: MINT_FEE });
            setTxState("confirming");
            await tx.wait();
            setTxState("success");
            setTimeout(() => {
                onSuccess();
                resetForm();
            }, 1500);
        } catch (err: any) {
            console.error("Mint failed:", err);
            setErrorMsg(err?.reason || err?.message || "Transaction failed");
            setTxState("error");
        }
    };

    const resetForm = () => {
        setRole(AGENT_ROLES[0]);
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
                    onClick={(e) => e.target === e.currentTarget && txState === "idle" && resetForm()}
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
                                    <Sparkles size={18} color="white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[var(--text-primary)]">
                                        Mint Agent
                                    </h2>
                                    <p className="text-xs text-[var(--text-secondary)]">
                                        Create a new AI agent on X Layer
                                    </p>
                                </div>
                            </div>
                            {txState === "idle" && (
                                <button
                                    onClick={resetForm}
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
                                    Agent Minted!
                                </h3>
                                <p className="text-sm text-[var(--text-secondary)] mt-2">
                                    Your new {role} agent has been created on-chain.
                                </p>
                                <button
                                    onClick={resetForm}
                                    className="btn-secondary w-full mt-6"
                                >
                                    Back to Home
                                </button>
                            </motion.div>

                        ) : (
                            <>
                                {/* Role */}
                                <div className="mb-4">
                                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                                        Role
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {AGENT_ROLES.map((r) => (
                                            <button
                                                key={r}
                                                onClick={() => setRole(r)}
                                                disabled={txState !== "idle"}
                                                className={`py-2 rounded-lg text-xs font-semibold capitalize transition-all ${role === r
                                                    ? "text-white"
                                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                                    }`}
                                                style={{
                                                    background: role === r ? "var(--gradient-primary)" : "rgba(30,30,50,0.5)",
                                                    border: `1px solid ${role === r ? "transparent" : "var(--border-default)"}`,
                                                }}
                                            >
                                                {r}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Removed Manual Metadata URI Field - Agent Logic is Pre-Mapped */}

                                {/* Mint Price */}
                                <div className="mb-6">
                                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                                        Mint Price (OKB)
                                    </label>
                                    <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-default)] bg-[rgba(30,30,50,0.5)]">
                                        <span className="text-sm font-semibold text-[var(--text-primary)]">0.001</span>
                                        <span className="text-xs text-[var(--text-secondary)]">Fixed Fee</span>
                                    </div>
                                    <p className="text-xs text-[var(--text-muted)] mt-2">
                                        This sets the agent&apos;s base value and is secured in the smart contract.
                                    </p>
                                </div>

                                {/* Error */}
                                {errorMsg && (
                                    <div className="mb-4 p-3 rounded-lg text-xs text-[var(--accent-red)]" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
                                        {errorMsg}
                                    </div>
                                )}

                                {/* Submit */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={resetForm}
                                        disabled={txState !== "idle"}
                                        className="btn-secondary flex-1 py-3 text-xs font-semibold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleMint}
                                        disabled={txState !== "idle" || !isConnected || !isCorrectChain}
                                        className="btn-primary flex-[2] flex items-center justify-center gap-2 py-3"
                                    >
                                        {txState === "pending" || txState === "confirming" ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                {txState === "pending" ? "Confirm in Wallet..." : "Confirming..."}
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={16} />
                                                Mint Agent
                                            </>
                                        )}
                                    </button>
                                </div>


                                {!isConnected && (
                                    <p className="text-xs text-[var(--accent-orange)] text-center mt-3">
                                        Connect your wallet to mint.
                                    </p>
                                )}
                                {isConnected && !isCorrectChain && (
                                    <p className="text-xs text-[var(--accent-orange)] text-center mt-3">
                                        Switch to X Layer to mint.
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
