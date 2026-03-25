"use client";

import { ethers } from "ethers";
import { motion } from "framer-motion";
import {
    Shield,
    Crosshair,
    Cpu,
    Search,
    DollarSign,
    Brain,
    Flame,
    Tag,
    ShoppingCart,
    Settings,
} from "lucide-react";
import type { Agent } from "@/config/contract";
import { COST_PER_USE } from "@/config/contract";

const ROLE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
    security: { icon: <Shield size={18} />, color: "#10B981", bg: "rgba(16,185,129,0.12)" },
    execution: { icon: <Cpu size={18} />, color: "#06B6D4", bg: "rgba(6,182,212,0.12)" },
    research: { icon: <Search size={18} />, color: "#10B981", bg: "rgba(16,185,129,0.12)" },
    economy: { icon: <DollarSign size={18} />, color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
    brain: { icon: <Brain size={18} />, color: "#EC4899", bg: "rgba(236,72,153,0.12)" },
};

function getRoleConfig(role: string) {
    return ROLE_CONFIG[role.toLowerCase()] ?? ROLE_CONFIG.brain;
}

function calculateCurrentValue(agent: Agent): bigint {
    const depreciation = agent.usageCount * COST_PER_USE;
    return agent.mintPrice > depreciation ? agent.mintPrice - depreciation : 0n;
}

function getDepreciationPercent(agent: Agent): number {
    if (agent.mintPrice === 0n) return 100;
    const depreciation = agent.usageCount * COST_PER_USE;
    if (depreciation >= agent.mintPrice) return 100;
    return Number((depreciation * 100n) / agent.mintPrice);
}

interface AgentCardProps {
    agent: Agent;
    isOwner: boolean;
    index?: number;
    onBuy?: () => void;
    onBurn?: () => void;
    onList?: () => void;
}

export default function AgentCard({
    agent,
    isOwner,
    index = 0,
    onBuy,
    onBurn,
    onList,
}: AgentCardProps) {
    const cfg = getRoleConfig(agent.role);
    const currentValue = calculateCurrentValue(agent);
    const depPercent = getDepreciationPercent(agent);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            whileHover={{ y: -4 }}
            className="glass-card overflow-hidden group"
        >
            {/* Top gradient strip */}
            <div
                className="h-1"
                style={{
                    background: `linear-gradient(90deg, ${cfg.color}, transparent)`,
                }}
            />

            {/* Header section */}
            <div className="p-5 pb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{ background: cfg.bg, color: cfg.color }}
                    >
                        {cfg.icon}
                    </div>
                    <div>
                        <h3 className="text-base font-bold capitalize text-[var(--text-primary)]">
                            {agent.role}
                        </h3>
                        <span
                            className="text-xs font-mono"
                            style={{ color: "var(--text-muted)" }}
                        >
                            #{agent.id.toString().padStart(4, "0")}
                        </span>
                    </div>
                </div>

                {/* Status badge */}
                {agent.listed ? (
                    <span
                        className="badge"
                        style={{
                            background: "rgba(16,185,129,0.1)",
                            color: "#10B981",
                            border: "1px solid rgba(16,185,129,0.2)",
                        }}
                    >
                        Listed
                    </span>
                ) : (
                    <span
                        className="badge"
                        style={{
                            background: "rgba(100,100,140,0.1)",
                            color: "var(--text-muted)",
                            border: "1px solid rgba(100,100,140,0.15)",
                        }}
                    >
                        Held
                    </span>
                )}
            </div>

            {/* Stats */}
            <div className="px-5 pb-4 space-y-3">
                {/* Reasoning Indicator */}
                <div className="flex justify-between items-center text-xs">
                    <span style={{ color: "var(--text-secondary)" }}>Reasoning Matrix</span>
                    <span
                        className="badge text-[10px] font-bold"
                        style={{
                            background: "rgba(6,182,212,0.1)",
                            color: "#06B6D4",
                            border: "1px solid rgba(6,182,212,0.2)",
                        }}
                    >
                        Neural Core Active
                    </span>
                </div>

                {/* Owner */}
                <div className="flex justify-between items-center text-xs">
                    <span style={{ color: "var(--text-secondary)" }}>Owner</span>
                    <span className="font-mono text-[var(--text-primary)]">
                        {agent.owner.slice(0, 6)}...{agent.owner.slice(-4)}
                    </span>
                </div>

                {/* Uses */}
                <div className="flex justify-between items-center text-xs">
                    <span style={{ color: "var(--text-secondary)" }}>Total Uses</span>
                    <span className="text-[var(--text-primary)]">
                        {agent.usageCount.toString()}
                    </span>
                </div>

                {/* Depreciation bar */}
                <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                        <span style={{ color: "var(--text-secondary)" }}>Health</span>
                        <span style={{ color: depPercent > 75 ? "var(--accent-red)" : depPercent > 40 ? "var(--accent-orange)" : "var(--accent-cyan)" }}>
                            {100 - depPercent}%
                        </span>
                    </div>
                    <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${100 - depPercent}%` }}
                            transition={{ duration: 0.8, delay: index * 0.06 + 0.2 }}
                            className="h-full rounded-full"
                            style={{
                                background: depPercent > 75
                                    ? "var(--gradient-burn)"
                                    : "var(--gradient-primary)",
                            }}
                        />
                    </div>
                </div>

                {/* Value / Price display */}
                <div className="pt-2 border-t border-[rgba(100,100,180,0.08)]">
                    <div className="flex justify-between items-center">
                        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                            {agent.listed ? "List Price" : "Current Value"}
                        </span>
                        <span className="text-sm font-bold gradient-text">
                            {ethers.formatEther(agent.listed ? agent.price : currentValue)} OKB
                        </span>
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            <div className="px-5 pb-5">
                {isOwner ? (
                    <div className="flex gap-2">
                        <button
                            onClick={onList}
                            className="btn-secondary flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs"
                        >
                            {agent.listed ? <Settings size={13} /> : <Tag size={13} />}
                            {agent.listed ? "Manage" : "List"}
                        </button>
                        <button
                            onClick={onBurn}
                            className="btn-danger flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs"
                        >
                            <Flame size={13} />
                            Burn
                        </button>
                    </div>
                ) : agent.listed ? (
                    <button
                        onClick={onBuy}
                        className="btn-primary w-full flex items-center justify-center gap-2 py-2.5"
                    >
                        <ShoppingCart size={14} />
                        Buy Agent
                    </button>
                ) : (
                    <button
                        disabled
                        className="w-full py-2.5 rounded-xl text-xs font-medium cursor-not-allowed text-[var(--text-muted)]"
                        style={{
                            background: "rgba(30,30,50,0.4)",
                            border: "1px solid rgba(100,100,140,0.08)",
                        }}
                    >
                        Not Available
                    </button>
                )}
            </div>
        </motion.div>
    );
}
