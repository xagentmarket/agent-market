"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ShoppingCart,
  Flame,
  Bot,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Header from "@/components/Header";
import AgentCard from "@/components/AgentCard";
import MintModal from "@/components/MintModal";
import BurnModal from "@/components/BurnModal";
import ListModal from "@/components/ListModal";
import BuyModal from "@/components/BuyModal";
import { useAgents } from "@/hooks/useAgents";
import { useWeb3 } from "@/context/Web3Provider";
import { AGENT_ROLES, type Agent } from "@/config/contract";
import { useRouter } from "next/navigation";

export default function MarketplacePage() {
  const { agents, listedAgents, loading, refresh } = useAgents();
  const { account } = useWeb3();
  const router = useRouter();

  const [mintOpen, setMintOpen] = useState(false);
  const [burnOpen, setBurnOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filteredAgents =
    roleFilter === "all"
      ? listedAgents
      : listedAgents.filter((a) => a.role.toLowerCase() === roleFilter);

  const handleBuy = (agent: Agent) => {
    setSelectedAgent(agent);
    setBuyOpen(true);
  };

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

      <main className="flex-1">
        {/* ─── Hero Section ─── */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold text-[var(--accent-purple)]"
              style={{
                background: "rgba(6,182,212,0.08)",
                border: "1px solid rgba(6,182,212,0.15)",
              }}
            >
              <Bot size={14} />
              Onchain AI Economy on X Layer
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-5">
              <span className="gradient-text">Mint, Trade &</span>
              <br />
              <span className="text-[var(--text-primary)]">Burn AI Agents</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-8 max-w-lg">
              Agent X is the onchain marketplace for AI agents. Each agent depreciates with use,
              creating real economic incentives for the autonomous agent economy.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setMintOpen(true)}
                className="btn-primary flex items-center gap-2 py-3 px-6"
              >
                <Sparkles size={16} />
                Mint Agent
              </button>
              <a
                href="#marketplace"
                className="btn-secondary flex items-center gap-2 py-3 px-6 no-underline"
              >
                <ShoppingCart size={16} />
                Browse Marketplace
                <ArrowRight size={14} />
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-4 mt-16 max-w-lg"
          >
            {[
              { label: "Total Agents", value: agents.length.toString() },
              { label: "Listed", value: listedAgents.length.toString() },
              { label: "Roles", value: new Set(agents.map((a) => a.role.toLowerCase())).size.toString() },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-[var(--text-secondary)] mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ─── Action Cards ─── */}
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: <Sparkles size={20} />,
                color: "var(--accent-purple)",
                bg: "rgba(6,182,212,0.1)",
                title: "Mint Agent",
                desc: "Create a new AI agent asset on-chain with a role and initial value.",
                onClick: () => setMintOpen(true),
              },
              {
                icon: <ShoppingCart size={20} />,
                color: "var(--accent-blue)",
                bg: "rgba(16,185,129,0.1)",
                title: "Marketplace",
                desc: "Browse and acquire AI agents listed by other users.",
                onClick: () => document.getElementById("marketplace")?.scrollIntoView({ behavior: "smooth" }),
              },
              {
                icon: <Flame size={20} />,
                color: "var(--accent-orange)",
                bg: "rgba(249,115,22,0.1)",
                title: "Burn Agent",
                desc: "Destroy an agent you own and receive a usage-based refund.",
                onClick: () => router.push("/my-agents"),
              },
            ].map((card) => (
              <motion.div
                key={card.title}
                whileHover={{ y: -3 }}
                className="glass-card p-6 cursor-pointer"
                onClick={card.onClick}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: card.bg, color: card.color }}
                >
                  {card.icon}
                </div>
                <h3 className="text-base font-bold mb-1.5 text-[var(--text-primary)]">
                  {card.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── Marketplace Grid ─── */}
        <section id="marketplace" className="max-w-7xl mx-auto px-6 pb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <ShoppingCart size={22} className="text-[var(--accent-purple)]" />
                Marketplace
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {listedAgents.length} agent{listedAgents.length !== 1 ? "s" : ""} available
              </p>
            </div>
          </div>

          {/* Role Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setRoleFilter("all")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${roleFilter === "all"
                ? "text-white"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              style={{
                background: roleFilter === "all" ? "var(--gradient-primary)" : "rgba(30,30,50,0.5)",
                border: `1px solid ${roleFilter === "all" ? "transparent" : "var(--border-default)"}`,
              }}
            >
              All
            </button>
            {AGENT_ROLES.map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${roleFilter === r
                  ? "text-white"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                style={{
                  background: roleFilter === r ? "var(--gradient-primary)" : "rgba(30,30,50,0.5)",
                  border: `1px solid ${roleFilter === r ? "transparent" : "var(--border-default)"}`,
                }}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 size={32} className="animate-spin text-[var(--accent-purple)]" />
            </div>
          ) : filteredAgents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <Bot size={48} className="mx-auto mb-4 text-[var(--text-muted)]" />
              <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-2">
                No Agents Listed
              </h3>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                Be the first to mint and list an agent on the marketplace.
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAgents.map((agent, i) => (
                <AgentCard
                  key={agent.id.toString()}
                  agent={agent}
                  isOwner={
                    !!account &&
                    agent.owner.toLowerCase() === account.toLowerCase()
                  }
                  index={i}
                  onBuy={() => handleBuy(agent)}
                  onBurn={() => handleBurn(agent)}
                  onList={() => handleList(agent)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-default)] py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span>Agent X — AI Agent Marketplace on X Layer</span>
          <span className="font-mono">Powered by OKB</span>
        </div>
      </footer>

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
      <BuyModal
        isOpen={buyOpen}
        agent={selectedAgent}
        onClose={() => { setBuyOpen(false); setSelectedAgent(null); }}
        onSuccess={refresh}
      />
    </div>
  );
}
