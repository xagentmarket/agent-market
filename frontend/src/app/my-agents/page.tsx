"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Sparkles, Loader2, Wallet } from "lucide-react";
import Header from "@/components/Header";
import AgentCard from "@/components/AgentCard";
import MintModal from "@/components/MintModal";
import BurnModal from "@/components/BurnModal";
import ListModal from "@/components/ListModal";
import { useAgents } from "@/hooks/useAgents";
import { useWeb3 } from "@/context/Web3Provider";
import type { Agent } from "@/config/contract";

export default function MyAgentsPage() {
    const { myAgents, loading, refresh } = useAgents();
    const { account, isConnected, connect } = useWeb3();

    const [mintOpen, setMintOpen] = useState(false);
    const [burnOpen, setBurnOpen] = useState(false);
    const [listOpen, setListOpen] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

    const handleBurn = (agent: Agent) => {
        setSelectedAgent(agent);
        setBurnOpen(true);
    };

    const handleList = (agent: Agent) => {
        setSelectedAgent(agent);
        setListOpen(true);
    };

    return (
        <div className="relative z-10 flex flex-col min-h-screen">
            <Header onMintClick={() => setMintOpen(true)} />

            <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                                <Bot size={28} className="text-[var(--accent-purple)]" />
                                My Agents
                            </h1>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">
                                Manage your AI agent portfolio
                            </p>
                        </div>
                        <button
                            onClick={() => setMintOpen(true)}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Sparkles size={16} />
                            Mint New
                        </button>
                    </div>
                </motion.div>

                {/* Content */}
                {!isConnected ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24"
                    >
                        <Wallet size={48} className="mx-auto mb-4 text-[var(--text-muted)]" />
                        <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-2">
                            Wallet Not Connected
                        </h3>
                        <p className="text-sm text-[var(--text-muted)] mb-6">
                            Connect your wallet to view your agents.
                        </p>
                        <button onClick={connect} className="btn-primary inline-flex items-center gap-2">
                            <Wallet size={16} />
                            Connect Wallet
                        </button>
                    </motion.div>
                ) : loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 size={32} className="animate-spin text-[var(--accent-purple)]" />
                    </div>
                ) : myAgents.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24"
                    >
                        <Bot size={48} className="mx-auto mb-4 text-[var(--text-muted)]" />
                        <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-2">
                            No Agents Yet
                        </h3>
                        <p className="text-sm text-[var(--text-muted)] mb-6">
                            Mint your first agent or buy one from the marketplace.
                        </p>
                        <button
                            onClick={() => setMintOpen(true)}
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            <Sparkles size={16} />
                            Mint Agent
                        </button>
                    </motion.div>
                ) : (
                    <>
                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-4 mb-10">
                            {[
                                { label: "Owned", value: myAgents.length.toString() },
                                { label: "Listed", value: myAgents.filter((a) => a.listed).length.toString() },
                                { label: "Unique Roles", value: new Set(myAgents.map((a) => a.role.toLowerCase())).size.toString() },
                            ].map((stat) => (
                                <div key={stat.label} className="glass-card p-4 text-center">
                                    <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                                    <div className="text-xs text-[var(--text-secondary)] mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {myAgents.map((agent, i) => (
                                <AgentCard
                                    key={agent.id.toString()}
                                    agent={agent}
                                    isOwner={true}
                                    index={i}
                                    onBurn={() => handleBurn(agent)}
                                    onList={() => handleList(agent)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </main>

            {/* Modals */}
            <MintModal
                isOpen={mintOpen}
                onClose={() => setMintOpen(false)}
                onSuccess={refresh}
            />
            <BurnModal
                isOpen={burnOpen}
                agent={selectedAgent}
                onClose={() => { setBurnOpen(false); setSelectedAgent(null); }}
                onSuccess={refresh}
            />
            <ListModal
                isOpen={listOpen}
                agent={selectedAgent}
                onClose={() => { setListOpen(false); setSelectedAgent(null); }}
                onSuccess={refresh}
            />
        </div>
    );
}
